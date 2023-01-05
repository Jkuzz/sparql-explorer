<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { useEndpointStore } from '@/stores/endpoint'
import VisSidebar from '@/components/VisSidebar.vue'
import CustomNode from '@/components/CustomNode.vue'
// import { markRaw } from 'vue'

const endpointStore = useEndpointStore()
// const nodeTypes = {
//   custom: markRaw(CustomNode),
// }

const { onConnect, addEdges } = useVueFlow()
onConnect((params) => addEdges([params]))
</script>

<template>
  <div class="bg-neutral-800 text-gray-200 flex flex-row">
    <VisSidebar />

    <div class="pt-2 flex-grow flex flex-col items-center justify-items-stretch space-y-4">
      <h1 class="text-4xl font-bold">Flow 🌊</h1>
      <div class="h-screen w-full">
        <VueFlow
          v-model:nodes="endpointStore.nodes"
          v-model:edges="endpointStore.renderEdges"
          fit-view-on-init
        >
          <template #node-custom="props">
            <CustomNode :data="props" />
          </template>
        </VueFlow>
      </div>
    </div>
  </div>
</template>
