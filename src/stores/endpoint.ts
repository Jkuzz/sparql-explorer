import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

export const useEndpointStore = defineStore('endpoint', () => {
  const nodes: Ref<Array<Object>> = ref([])

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

  return { nodes, fetchNode }
})
