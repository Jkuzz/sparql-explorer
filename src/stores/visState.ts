import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StoreNode } from '@/stores/endpoint'

export const useVisStateStore = defineStore('visState', () => {
  /**
   * The node that was most recently selected -- show info about this
   */
  const highlightedNode = ref<StoreNode>()
  /**
   * Nodes that have been highlited -- export these
   */
  const selectedNodes = ref<StoreNode[]>([])

  function selectNode(node: StoreNode) {
    console.log('🚀 ~ file: visState.ts:16 ~ selectNode ~ node', node)
    highlightedNode.value = node
    if (!selectedNodes.value.find((n) => n.id === node.id)) {
      selectedNodes.value.push(node)
    }
  }

  function deselectNode(node: StoreNode) {
    console.log('🚀 ~ file: visState.ts:24 ~ deselectNode ~ node', node)
    selectedNodes.value.splice(selectedNodes.value.indexOf(node), 1)
  }

  return { selectedNodes, highlightedNode, selectNode, deselectNode }
})
