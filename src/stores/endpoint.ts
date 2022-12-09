import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { getClassesQuery, queryEndpoint } from '@/components/force/sparql'

export const useEndpointStore = defineStore('endpoint', () => {
  const nodes: Ref<Array<Object>> = ref([])
  const endpointURL = ref('https://dbpedia.org/sparql')

  const query = getClassesQuery(0)
  const res = queryEndpoint(new URL(endpointURL.value), query)
  res.then((r) => {
    r.results.bindings.forEach((node: any) => {
      nodes.value.push({ id: getNextId(), node: node })
    })
    console.log(nodes.value)
  })

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

  function changeEndpoint(newEndpoint: URL) {
    console.log(newEndpoint)
    clearNodes()
  }

  /**
   * Reset the stored endpoint nodes
   */
  function clearNodes() {
    nodes.value.splice(0, nodes.value.length)
  }

  return { nodes, fetchNode, endpointURL, changeEndpoint }
})
