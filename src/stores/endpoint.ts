import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

import QueryQueue from '@/stores/queryQueue'
import { queryClasses } from '@/stores/queryHandler'
import type { MarkerType } from '@vue-flow/core'

export type StoreNode = {
  position: {
    x: number
    y: number
  }
  id: string
  type: string
  data: any
}

export type StoreEdge = {
  id: string
  source: string
  target: string
  data: unknown
  type?: string
  markerEnd?: MarkerType
}

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

  function query(queryToPerform: string, callback: (data: unknown) => void) {
    queryQueue.query(queryToPerform, callback)
  }

  return {
    nodes,
    edges,
    addNode,
    addEdge,
    query,
    renderEdges,
    endpointURL,
    changeEndpoint,
  }
})
