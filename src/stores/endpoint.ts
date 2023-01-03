import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { getClassesQuery, getClassLinksQuery } from '@/components/force/sparql'
import QueryQueue from '@/stores/queryQueue'

const ATTRIBUTE_MINIMUM_FACTOR = 0.01

export type Node = {
  position: {
    x: number
    y: number
  }
  id: string
  type: string
  data: unknown
}

export type Edge = {
  id: string
  source: string
  target: string
  data: unknown
}

export const useEndpointStore = defineStore('endpoint', () => {
  const nodes = reactive<Array<any>>([])
  const edges = reactive<Array<any>>([])
  const endpointURL = ref(new URL('https://dbpedia.org/sparql'))
  const queryQueue = new QueryQueue(endpointURL.value)

  const elements = computed(() => {
    return nodes.concat(edges)
  })

  queryClasses()

  let nextId = 0
  function getNextId() {
    nextId += 1
    return nextId - 1
  }

  function fetchNode() {
    nodes.push({
      title: 'Hello',
      id: getNextId(),
    })
  }

  async function queryClasses(offset = 0) {
    const query = getClassesQuery(offset)
    queryQueue.query(query, classQueryCallback)
  }

  function classQueryCallback(res: any) {
    res.results.bindings.forEach((node: unknown) => {
      nodes.push(makeNodeObject(node))
    })
  }

  async function queryClassEdges(node00: unknown, node10: unknown) {
    const node0 = nodes[3].data
    console.log('🚀 ~ file: endpoint.ts:52 ~ queryClassEdges ~ node0', node0)
    const node1 = nodes[1].data
    console.log('🚀 ~ file: endpoint.ts:54 ~ queryClassEdges ~ node1', node1)

    await askEdgeExists(node0.class.value, node1.class.value, node0.instanceCount.value)
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
          edges.push(makeEdgeObject(edge, sourceClass, targetClass))
        })
    }

    queryQueue.query(linksQuery, callbackFunc)
  }

  function makeNodeObject(node: any) {
    console.log(node)
    return {
      position: { x: getRandomInt(100, 1000), y: getRandomInt(50, 400) },
      id: node?.class.value || '' + getNextId(),
      type: 'custom',
      data: node,
    } satisfies Node
  }

  function makeEdgeObject(edge: any, sourceClass: string, targetClass: string) {
    console.log(edge)
    return {
      id: `e-[${sourceClass}]-[${edge?.property.value}]-[${targetClass}]`,
      source: sourceClass,
      target: targetClass,
      data: edge,
    } satisfies Edge
  }

  function changeEndpoint(newEndpoint: URL) {
    console.log(newEndpoint)
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

  return { nodes, edges, elements, fetchNode, endpointURL, changeEndpoint, queryClassEdges }
})

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}
