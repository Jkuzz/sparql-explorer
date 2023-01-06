import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { z } from 'zod'
import { makeNodeObject, makeEdgeObject } from '@/stores/queryQueue'
import type { StoreNode, StoreEdge } from '@/stores/validators'
import { NodeResponse, EdgeResponse } from '@/stores/validators'

import QueryQueue from '@/stores/queryQueue'
import {
  getClassesQuery,
  getClassLinksQuery,
  getClassPropertiesQuery,
} from '@/components/force/sparql'

const ATTRIBUTE_MINIMUM_FACTOR = 0.01

export const useEndpointStore = defineStore('endpoint', () => {
  const nodes = reactive<Array<StoreNode>>([])
  const edges = reactive<Array<any>>([])
  const renderEdges = ref<Array<any>>([])
  const endpointURL = ref(new URL('https://dbpedia.org/sparql'))
  const queryQueue = new QueryQueue(endpointURL.value)

  queryClasses()

  function addNode(node: StoreNode) {
    if (nodes.find((n) => n.id == node.id)) return undefined
    nodes.push(node)
    return true
  }

  function addEdge(edge: StoreEdge) {
    if (edges.find((n) => n.id == edge.id)) return undefined
    edges.push(edge)
    addRenderEdge(edge)
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

  function changeEndpoint(newEndpoint: URL) {
    endpointURL.value = newEndpoint
    clearNodes()
    queryClasses()
  }

  /**
   * Reset the stored endpoint data
   */
  function clearNodes() {
    nodes.splice(0, nodes.length)
    edges.splice(0, edges.length)
  }

  /**
   * Get the top 10 + offset most numerous classes from the endpoint
   * @param offset from most numerous class
   */
  function queryClasses(offset = 0) {
    const query = getClassesQuery(offset)
    queryQueue.query(query, classQueryCallback, NodeResponse)
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

  function queryClassEdges(newNode: StoreNode) {
    nodes.forEach((n) => {
      if (n.id === newNode.id) return
      askEdgeExists(newNode.data.class.value, n.data.class.value, +newNode.data.instanceCount.value)
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
        .filter((binding) => +binding.instanceCount.value > originCount * ATTRIBUTE_MINIMUM_FACTOR)
        .forEach((edge) => {
          const edgeObject = makeEdgeObject(edge, sourceClass, targetClass)
          addEdge(edgeObject)
        })
    }

    queryQueue.query(linksQuery, callbackFunc, EdgeResponse)
  }

  return {
    nodes,
    edges,
    addNode,
    addEdge,
    renderEdges,
    endpointURL,
    changeEndpoint,
  }
})
