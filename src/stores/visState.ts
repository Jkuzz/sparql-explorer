import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { StoreNode } from '@/stores/validators'
import { useEndpointStore } from '@/stores/endpoint'

const endpointStore = useEndpointStore()

export const useVisStateStore = defineStore('visState', () => {
  /**
   * Nodes that have been highlited -- export these
   */
  const selectedNodes = reactive<StoreNode[]>([])

  function selectNode(nodeId: string) {
    if (selectedNodes.find((n: StoreNode) => n.id === nodeId)) return
    const nodeToSelect = endpointStore.nodes.find((n) => n.id === nodeId)
    if (!nodeToSelect) return

    selectedNodes.push(nodeToSelect)
  }

  function deselectNode(nodeId: string) {
    const nodeToRemove = endpointStore.nodes.find((n) => n.id === nodeId)
    if (!nodeToRemove) return
    selectedNodes.splice(selectedNodes.indexOf(nodeToRemove), 1)
  }

  function toggleAttributeSelection(nodeId: string, attribute: string) {
    console.log(nodeId, attribute)
  }

  function toggleEdgeSelection(nodeId: string, edgeId: string) {
    console.log(nodeId, edgeId)
  }

  /**
   * See whether the selected nodes contain a specific one by comparing ids
   * @param nodeId node to check
   */
  function isSelected(nodeId: StoreNode['id']) {
    const foundNode = selectedNodes.find((n) => n.id === nodeId)
    return foundNode !== undefined
  }

  return {
    selectedNodes,
    selectNode,
    deselectNode,
    isSelected,
    toggleAttributeSelection,
    toggleEdgeSelection,
  }
})
