import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { StoreNode } from '@/stores/endpoint'
import { useEndpointStore } from '@/stores/endpoint'

const endpointStore = useEndpointStore()

export const useVisStateStore = defineStore('visState', () => {
  /**
   * The node that was most recently selected -- show info about this
   */
  const highlightedNode = ref<StoreNode>()
  /**
   * Nodes that have been highlited -- export these
   */
  const selectedNodes = reactive<StoreNode[]>([])

  function selectNode(nodeId: string) {
    if (selectedNodes.find((n: StoreNode) => n.id === nodeId)) return
    const nodeToSelect = endpointStore.nodes.find((n) => n.id === nodeId)
    if (!nodeToSelect) return

    highlightedNode.value = nodeToSelect
    selectedNodes.push(nodeToSelect)
    console.log('🚀 ~ file: visState.ts:20 ~ selectNode ~ node', nodeToSelect)
  }

  function deselectNode(nodeId: string) {
    const nodeToRemove = endpointStore.nodes.find((n) => n.id === nodeId)
    if (!nodeToRemove) return
    selectedNodes.splice(selectedNodes.indexOf(nodeToRemove), 1)
  }

  /**
   * See whether the selected nodes contain a specific one by comparing ids
   * @param node node to check
   */
  function isSelected(node: StoreNode) {
    const foundNode = selectedNodes.find((n) => n.id === node.id)
    return foundNode !== undefined
  }

  return { selectedNodes, highlightedNode, selectNode, deselectNode, isSelected }
})
