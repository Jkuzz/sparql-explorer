<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { useEndpointStore } from '@/stores/endpoint'
import VisSidebar from '@/components/VisSidebar.vue'
import CustomNode from '@/components/CustomNode.vue'

const endpointStore = useEndpointStore()

const { onConnect, addEdges } = useVueFlow()
onConnect((params) => addEdges([params]))
</script>

<template>
  <div class="bg-blue-900 text-gray-200 flex flex-row">
    <VisSidebar />

    <div class="p-8 flex-grow flex flex-col items-center justify-items-stretch space-y-10">
      <h1 class="text-4xl font-semibold">Testing flow view</h1>
      <div class="h-screen w-full border">
        <VueFlow v-model="endpointStore.nodes">
          <template #node-custom="props">
            <CustomNode :data="props"></CustomNode>
          </template>
        </VueFlow>
      </div>
    </div>
  </div>
</template>