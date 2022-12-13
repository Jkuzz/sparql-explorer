<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
// import { ref } from 'vue'
import { useEndpointStore } from '@/stores/endpoint'

const endpointStore = useEndpointStore()
console.log(endpointStore.nodes)

const { onConnect, addEdges } = useVueFlow()
onConnect((params) => addEdges([params]))
</script>

<template>
  <div
    class="bg-blue-900 text-gray-200 p-8 flex flex-col items-center justify-items-stretch space-y-20"
  >
    <h1 class="text-4xl font-semibold">Testing here :)</h1>
    <div class="h-screen w-full border">
      <VueFlow v-model="endpointStore.nodes"> </VueFlow>
    </div>
  </div>
</template>
