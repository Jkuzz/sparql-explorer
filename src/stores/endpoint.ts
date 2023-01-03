import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getClassesQuery, getClassLinksQuery, queryEndpoint } from '@/components/force/sparql'
import QueryQueue from '@/stores/queryQueue'

const ATTRIBUTE_MINIMUM_FACTOR = 0.01

export type node = {
  position: {
    x: number
    y: number
  }
  id: number
  type: string
  data: unknown
}

export const useEndpointStore = defineStore('endpoint', () => {
  const nodes = ref<Array<any>>([])
  const edges = ref<Array<any>>([])
  const endpointURL = ref(new URL('https://dbpedia.org/sparql'))
  const queryQueue = new QueryQueue(endpointURL.value)

  queryClasses()

  let nextId = 0
  function getNextId() {
    nextId += 1
    return nextId - 1
  }

  function fetchNode() {
    nodes.value.push({
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
      nodes.value.push(makeNodeObject(node))
    })
  }

  async function queryClassEdges() {
    const node0 = nodes.value[1].data
    const node1 = nodes.value[3].data

    const linksQuery = getClassLinksQuery(node0.class.value, node1.class.value)
    const linksResponse = (
      await queryEndpoint(endpointURL.value, linksQuery)
    ).results.bindings.filter(
      (binding: { instanceCount: { value: number } }) =>
        binding.instanceCount.value > +node0.instanceCount.value * ATTRIBUTE_MINIMUM_FACTOR
    )
    console.log(linksResponse)
  }

  // function edgeQueryCallback(res: any) {
  //   res.results.bindings.filter(
  //     (binding: { instanceCount: { value: number } }) =>
  //       binding.instanceCount.value > +node0.instanceCount.value * ATTRIBUTE_MINIMUM_FACTOR
  //   )
  // }

  function makeNodeObject(node: any) {
    console.log(node)
    return {
      position: { x: getRandomInt(100, 1000), y: getRandomInt(50, 400) },
      id: getNextId(),
      type: 'custom',
      data: node,
    }
  }

  function makeEdgeObject(edge: any) {
    console.log(edge)
    return {
      id: getNextId(),
      type: 'custom',
      data: edge,
    }
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
    nodes.value.splice(0, nodes.value.length)
    edges.value.splice(0, edges.value.length)
  }

  return { nodes, fetchNode, endpointURL, changeEndpoint, queryClassEdges }
})

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}
