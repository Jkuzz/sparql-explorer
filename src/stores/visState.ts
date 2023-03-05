import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { StoreNode, StoreEdge } from '@/stores/validators'
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

  /**
   * Attributes of selected nodes that are to be included in the schema
   * Dictionary of
   * IRI => attributes[]
   */
  const selectedEdges = reactive<StoreEdge[]>([])

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
    // console.log('Attribute', nodeId, attribute)
    const selected = selectedAttributes[nodeId]

    const selectedIndex = selected.indexOf(attribute)
    if (selectedIndex > -1) {
      selected.splice(selectedIndex, 1)
    } else {
      selected.push(attribute)
    }
  }

  function toggleEdgeSelection(edge: StoreEdge) {
    console.log('Edge', edge.source, edge.target)

    const selectedIndex = selectedEdges.indexOf(edge)
    if (selectedIndex > -1) {
      selectedEdges.splice(selectedIndex, 1)
    } else {
      selectedEdges.push(edge)
    }
  }

  /**
   * See whether the selected nodes contain a specific one by comparing ids
   * @param nodeId node to check
   */
  function isSelected(nodeId: StoreNode['id']) {
    const foundNode = selectedNodes.find((n) => n.id === nodeId)
    return foundNode !== undefined
  }

  /**
   * See whether the selected nodes attribute is selected
   * (the node must therefore also be selected)
   * @param nodeId whose attribute you are inspecting
   * @param attribute to check
   */
  function isAttributeSelected(nodeId: StoreNode['id'], attribute: string) {
    const foundNode = selectedAttributes[nodeId]
    if (!foundNode) return false
    return foundNode.includes(attribute)
  }

  return {
    selectedNodes,
    selectedAttributes,
    toggleNodeSelection,
    isSelected,
    toggleAttributeSelection,
    toggleEdgeSelection,
  }
})
