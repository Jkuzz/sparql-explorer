import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

export const useEndpointStore = defineStore('endpoint', () => {
  const nodes: Ref<Array<Object>> = ref([])

  function fetchNode() {
    nodes.value.push({
      title: 'Hello',
      id: nodes.value.length,
    })
  }

  return { nodes, fetchNode }
})
