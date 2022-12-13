import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { getClassesQuery, queryEndpoint } from '@/components/force/sparql'

export const useEndpointStore = defineStore('endpoint', () => {
  const nodes: Ref<Array<any>> = ref([])
  const endpointURL = ref(new URL('https://dbpedia.org/sparql'))

  const query = getClassesQuery(0)
  fetchInitNodes()

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

  function fetchInitNodes() {
    queryEndpoint(endpointURL.value, query).then((r) => {
      r.results.bindings.forEach((node: any) => {
        nodes.value.push(makeNodeObject(node))
      })
      console.log(nodes.value)
    })
  }

  function makeNodeObject(node: any) {
    return {
      position: { x: getRandomInt(100, 1000), y: getRandomInt(50, 400) },
      id: getNextId(),
      ...node,
    }
  }

  function changeEndpoint(newEndpoint: URL) {
    console.log(newEndpoint)
    endpointURL.value = newEndpoint
    clearNodes()
    fetchInitNodes()
  }

  /**
   * Reset the stored endpoint nodes
   */
  function clearNodes() {
    nodes.value.splice(0, nodes.value.length)
  }

  return { nodes, fetchNode, endpointURL, changeEndpoint }
})

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}
