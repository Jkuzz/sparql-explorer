import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StoreNode } from '@/stores/endpoint'

export const usevisStateStore = defineStore('visState', () => {
  const selectedNode = ref<StoreNode>()
  return { selectedNode }
})
