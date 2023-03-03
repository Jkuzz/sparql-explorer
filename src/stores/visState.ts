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

  /**
   * Attributes of selected nodes that are to be included in the schema
   * Dictionary of
   * IRI => attributes[]
   */
  const selectedAttributes = reactive<{ [key: string]: string[] }>({})

  function toggleNodeSelection(nodeId: string) {
    const nodeToToggle = selectedNodes.find((n) => n.id === nodeId)

    if (nodeToToggle) {
      // Exists: remove it
      selectedNodes.splice(selectedNodes.indexOf(nodeToToggle), 1)
      delete selectedAttributes[nodeId]
    } else {
      // Doesn't exist: select it
      const newNode = endpointStore.nodes.find((n) => n.id === nodeId)
      if (newNode) {
        selectedNodes.push(newNode)
        selectedAttributes[nodeId] = []
      }
    }
  }

  function toggleAttributeSelection(nodeId: string, attribute: string) {
    console.log('Attribute', nodeId, attribute)
    const selected = selectedAttributes[nodeId]

    const selectedIndex = selected.indexOf(attribute)
    if (selectedIndex > -1) {
      selected.splice(selectedIndex, 1)
    } else {
      selected.push(attribute)
    }
    console.log(selected)
  }

  function toggleEdgeSelection(nodeId: string, edgeId: string) {
    console.log('Edge', nodeId, edgeId)
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
    toggleNodeSelection,
    isSelected,
    toggleAttributeSelection,
    toggleEdgeSelection,
  }
})
