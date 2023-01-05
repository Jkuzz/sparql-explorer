import {
  getClassesQuery,
  getClassLinksQuery,
  getClassPropertiesQuery,
} from '@/components/force/sparql'
import { useEndpointStore } from '@/stores/endpoint'
import type { StoreNode, StoreEdge } from '@/stores/endpoint'
import { MarkerType } from '@vue-flow/core'

const endpointStore = useEndpointStore()

const ATTRIBUTE_MINIMUM_FACTOR = 0.01

let nextId = 0
function getNextId() {
  nextId += 1
  return nextId - 1
}

/**
 * Get the top 10 + offset most numerous classes from the endpoint
 * @param offset from most numerous class
 */
export async function queryClasses(offset = 0) {
  const query = getClassesQuery(offset)
  endpointStore.query(query, classQueryCallback)
}

/**
 * Process the classes query response into objects
 * and perform followup actions and queue followup queries
 * @param res Classes query response
 */
function classQueryCallback(res: any) {
  res.results.bindings.forEach((node: any) => {
    const nodeObject = makeNodeObject(node)
    if (endpointStore.addNode(nodeObject)) {
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
  endpointStore.query(query, callback)
}

function queryClassEdges(newNode: StoreNode) {
  endpointStore.nodes.forEach((n) => {
    if (n.id === newNode.id) return
    askEdgeExists(newNode.data.class.value, n.data.class.value, newNode.data.instanceCount.value)
  })
}

/**
 * Ask whether there exists a property ?originClass ?property ?targetClass
 * @param sourceClass URI of origin class
 * @param targetClass URI of target class
 * @param originCount instance count of origin
 */
async function askEdgeExists(sourceClass: string, targetClass: string, originCount: number) {
  const linksQuery = getClassLinksQuery(sourceClass, targetClass)

  // Create closure around the callback, binding the class data
  const callbackFunc = (res: any) => {
    res.results.bindings
      .filter(
        (binding: { instanceCount: { value: number } }) =>
          binding.instanceCount.value > originCount * ATTRIBUTE_MINIMUM_FACTOR
      )
      .forEach((edge: unknown) => {
        const edgeObject = makeEdgeObject(edge, sourceClass, targetClass)
        endpointStore.addEdge(edgeObject)
      })
  }

  endpointStore.query(linksQuery, callbackFunc)
}

/**
 * Convert the repsonse to the known type
 * TODO: beter validation: zod?
 * @param node Response object
 * @returns the node converted to a known type
 */
function makeNodeObject(node: any) {
  return {
    position: { x: getRandomInt(0, 600), y: getRandomInt(0, 400) },
    id: node?.class.value || '' + getNextId(),
    type: 'custom',
    data: node,
  } satisfies StoreNode
}

function makeEdgeObject(edge: any, sourceClass: string, targetClass: string) {
  return {
    id: `e-[${sourceClass}]-[${edge?.property.value}]-[${targetClass}]`,
    source: sourceClass,
    target: targetClass,
    data: edge,
    markerEnd: MarkerType.ArrowClosed,
  } satisfies StoreEdge
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}
