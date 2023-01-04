import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Node } from '@/stores/endpoint'

export const usevisStateStore = defineStore('visState', () => {
  const selectedNode = ref<Node>()
  return { selectedNode }
})
