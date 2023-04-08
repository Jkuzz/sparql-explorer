import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { z } from 'zod'
import { makeNodeObject, makeEdgeObject } from '@/stores/queryQueue'
import type { StoreNode, StoreEdge } from '@/stores/validators'
import { NodeResponse, EdgeResponse, AttributesResponse } from '@/stores/validators'
import type { SchemaType } from '@/importSchema'
import { MarkerType } from '@vue-flow/core'

import QueryQueue from '@/stores/queryQueue'
import {
  getClassesQuery,
  getClassLinksQuery,
  getClassPropertiesQuery,
  getAttributesQuery,
} from '@/stores/sparql'

const PROPERTY_MINIMUM_FACTOR = 0.01
const ATTRIBUTE_MINIMUM_FACTOR = 0.005

export const useEndpointStore = defineStore('endpoint', () => {
  const nodes = ref<Array<StoreNode>>([])
  const edges = ref<Array<StoreEdge>>([])
  const renderEdges = ref<Array<StoreEdge>>([])
  const endpointURL = ref(new URL('https://dbpedia.org/sparql'))
  const queryQueue = new QueryQueue(endpointURL.value)

  queryClasses()

  /**
   * Add a new node to the store unless it already exists.
   * @param node to add
   * @returns true of the node was added
   */
  function addNode(node: StoreNode) {
    if (nodes.value.find((n) => n.id == node.id)) return false
    nodes.value.push(node)
    return true
  }

  /**
   * Get the edges thet begin in the desired node
   */
  function getNodeFromEdges(nodeId: string) {
    return edges.value.filter((e) => e.source == nodeId)
  }

  /**
   * Get the edges thet end in the desired node
   */
  function getNodeToEdges(nodeId: string) {
    return edges.value.filter((e) => e.target == nodeId)
  }

  /**
   * Add a new edge to the store unless it already exists
   * @param edge to add
   * @returns true of the edge was added
   */
  function addEdge(edge: StoreEdge) {
    if (edges.value.find((n) => n.id == edge.id)) return false
    edges.value.push(edge)
    addRenderEdge(edge)
    return true
  }

  function addRenderEdge(newEdge: StoreEdge) {
    const existingEdge = renderEdges.value.find(
      (e) => e.source == newEdge.source && e.target == newEdge.target
    )
    if (existingEdge) {
      renderEdges.value.splice(renderEdges.value.indexOf(existingEdge), 1, newEdge)
    } else {
      renderEdges.value.push(newEdge)
    }
  }

  /**
   * Change the store's target endpoint, reset the state and
   * restart the querying process.
   * @param newEndpoint to change to
   * @param doQueries whether to query for classes. Use false when manually importing
   */
  function changeEndpoint(newEndpoint: URL, doQueries = true) {
    endpointURL.value = newEndpoint
    queryQueue.changeEndpoint(newEndpoint)
    clearNodes()
    if (doQueries) {
      queryClasses(0, 10)
    }
  }

  /**
   * Reset the stored endpoint data
   */
  function clearNodes() {
    nodes.value = []
    edges.value = []
    renderEdges.value = []
  }

  /**
   * Get the top 10 + offset most numerous classes from the endpoint
   * @param offset Offset from most numerous class
   * @param classCount How many next k classes to get
   * @param callback optional callback that will be called once the classes query returns
   */
  function queryClasses(offset = nodes.value.length, classCount = 10, callback = () => {}) {
    const query = getClassesQuery(offset, classCount)
    const compositeCallback = (res: z.infer<typeof NodeResponse>) => {
      classQueryCallback(res)
      callback()
    }
    queryQueue.query(query, compositeCallback, NodeResponse)
  }

  /**
   * Process the classes query response into objects
   * and perform followup actions and queue followup queries
   * @param res Classes query response
   */
  function classQueryCallback(res: z.infer<typeof NodeResponse>) {
    res.results.bindings.forEach((node) => {
      const nodeObject = makeNodeObject(node)
      if (addNode(nodeObject)) {
        queryClassEdges(nodeObject)
        queryClassProperties(nodeObject)
        queryClassAttributes(nodeObject)
      }
    })
  }

  /**
   * Get the node's properties from the endpoint
   * @param newNode for whose properties to query
   */
  function queryClassProperties(newNode: StoreNode) {
    const query = getClassPropertiesQuery(newNode.id)
    const callback = (res: any) => {
      res.results?.bindings?.forEach((prop: any) => {
        if (prop?.property?.value === 'http://www.w3.org/2000/01/rdf-schema#label') {
          if (!newNode.data.labels) newNode.data.labels = []
          newNode.data.labels.push(prop)
        }
      })
    }
    queryQueue.query(query, callback)
  }

  /**
   * For a newly added node, make a query that asks by which
   * properties are two existing class nodes connected in the endpoint.
   * @param newNode that was just added to the store
   */
  function queryClassAttributes(newNode: StoreNode) {
    const query = getAttributesQuery(newNode.id)
    const minAttibuteCount = +newNode.data.node.instanceCount.value * ATTRIBUTE_MINIMUM_FACTOR

    // Create closure around the callback, binding the class data
    const callbackFunc = (res: z.infer<typeof AttributesResponse>) => {
      res.results.bindings
        .filter((binding) => +binding.instanceCount.value > minAttibuteCount)
        .forEach((binding) => {
          newNode.data.attributes.push(binding)
        })
    }
    queryQueue.query(query, callbackFunc, AttributesResponse)
  }

  /**
   * For a newly added node, make a query that asks by which
   * properties are two existing class nodes connected in the endpoint.
   * @param newNode that was just added to the store
   */
  function queryClassEdges(newNode: StoreNode) {
    nodes.value.forEach((n) => {
      if (n.id === newNode.id) return
      askEdgeExists(
        newNode.data.node.class.value,
        n.data.node.class.value,
        +newNode.data.node.instanceCount.value
      )
    })
  }

  /**
   * Ask whether there exists a property ?originClass ?property ?targetClass
   * @param sourceClass URI of origin class
   * @param targetClass URI of target class
   * @param originCount instance count of origin
   */
  function askEdgeExists(sourceClass: string, targetClass: string, originCount: number) {
    const linksQuery = getClassLinksQuery(sourceClass, targetClass)

    // Create closure around the callback, binding the class data
    const callbackFunc = (res: z.infer<typeof EdgeResponse>) => {
      res.results.bindings
        .filter((binding) => +binding.instanceCount.value > originCount * PROPERTY_MINIMUM_FACTOR)
        .forEach((edge) => {
          const edgeObject = makeEdgeObject(edge, sourceClass, targetClass)
          addEdge(edgeObject)
        })
    }
    queryQueue.query(linksQuery, callbackFunc, EdgeResponse)
  }

  function handleParsedImport(parsedImport: SchemaType) {
    changeEndpoint(new URL(parsedImport.endpoint), false)

    for (const node of parsedImport.nodes) {
      const newNodeAttributes =
        node.attributes?.map((attr) => {
          return {
            attribute: { type: 'uri', value: attr.id },
            instanceCount: {
              type: 'typed-literal',
              datatype: 'http://www.w3.org/2001/XMLSchema#integer',
              value: '' + attr.instanceCount,
            },
            type: { type: 'uri', value: attr.type },
          } as const
        }) || []

      const newNode: StoreNode = {
        position: { x: 0, y: 0 },
        id: node.id,
        type: 'custom',
        data: {
          node: {
            class: {
              type: 'uri',
              value: node.id,
            },
            instanceCount: {
              datatype: 'http://www.w3.org/2001/XMLSchema#integer',
              type: 'typed-literal',
              value: '' + node.instanceCount,
            },
          },
          labels: [],
          attributes: newNodeAttributes,
        },
      }
      addNode(newNode)
    }

    for (const edge of parsedImport.edges) {
      const newEdge: StoreEdge = {
        id: `[${edge.source}-${edge.id}-${edge.target}]`,
        source: edge.source,
        target: edge.target,
        uri: edge.id,
        markerEnd: MarkerType.ArrowClosed,
        data: {
          instanceCount: {
            type: 'typed-literal',
            datatype: 'http://www.w3.org/2001/XMLSchema#integer',
            value: '' + edge.instanceCount,
          },
          property: {
            type: 'uri',
            value: edge.id,
          },
        },
      }
      addEdge(newEdge)
    }
  }

  return {
    nodes,
    edges,
    addNode,
    addEdge,
    renderEdges,
    endpointURL,
    changeEndpoint,
    getNodeFromEdges,
    getNodeToEdges,
    queryClasses,
    handleParsedImport,
  }
})
