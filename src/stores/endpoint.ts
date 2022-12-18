import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getClassesQuery, getClassLinksQuery, queryEndpoint } from '@/components/force/sparql'

const ATTRIBUTE_MINIMUM_FACTOR = 0.01

export const useEndpointStore = defineStore('endpoint', () => {
  const nodes = ref<Array<any>>([])
  const links = ref<Array<any>>([])
  const endpointURL = ref(new URL('https://dbpedia.org/sparql'))

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
    queryEndpoint(endpointURL.value, query).then((r) => {
      r.results.bindings.forEach((node: any) => {
        nodes.value.push(makeNodeObject(node))
      })
    })
  }

  async function queryClassLinks() {
    const node0 = nodes.value[0].data
    const node1 = nodes.value[2].data

    const linksQuery = getClassLinksQuery(node0.class.value, node1.class.value)
    const linksResponse = (
      await queryEndpoint(endpointURL.value, linksQuery)
    ).results.bindings.filter(
      (binding: { instanceCount: { value: number } }) =>
        binding.instanceCount.value > +node0.instanceCount.value * ATTRIBUTE_MINIMUM_FACTOR
    )
    console.log(linksResponse)
  }

  function makeNodeObject(node: any) {
    console.log(node)
    return {
      position: { x: getRandomInt(100, 1000), y: getRandomInt(50, 400) },
      id: getNextId(),
      type: 'custom',
      data: node,
    }
  }

  function makeLinkObject(link: any) {
    console.log(link)
    return {
      id: getNextId(),
      type: 'custom',
      data: link,
    }
  }

  function changeEndpoint(newEndpoint: URL) {
    console.log(newEndpoint)
    endpointURL.value = newEndpoint
    clearNodes()
    queryClasses()
  }

  /**
   * Reset the stored endpoint nodes
   */
  function clearNodes() {
    nodes.value.splice(0, nodes.value.length)
  }

  return { nodes, fetchNode, endpointURL, changeEndpoint, queryClassLinks }
})

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}
