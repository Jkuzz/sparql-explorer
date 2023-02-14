<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { useEndpointStore } from '@/stores/endpoint'
import VisSidebar from '@/components/VisSidebar.vue'
import CustomNode from '@/components/CustomNode.vue'
import NodeModal from '@/components/NodeModal.vue'
import { ref } from 'vue'
import type { StoreNode } from '@/stores/validators'

const endpointStore = useEndpointStore()

const isModalOpen = ref(false)
const modalNode = ref<StoreNode | undefined>(undefined)

const { onConnect, addEdges } = useVueFlow()
onConnect((params) => addEdges([params]))

function showNodeModal(node: StoreNode) {
  isModalOpen.value = true
  modalNode.value = node
}
</script>

<template>
  <div class="bg-slate-800 text-gray-200 flex flex-row">
    <VisSidebar />

    <div class="pt-2 flex-grow flex flex-col items-center justify-items-stretch space-y-4">
      <h1 class="text-4xl font-novem">Flow 🌊</h1>
      <div class="h-screen w-full">
        <VueFlow
          v-model:nodes="endpointStore.nodes"
          v-model:edges="endpointStore.renderEdges"
          fit-view-on-init
        >
          <template #node-custom="props">
            <CustomNode
              :data="props"
              @click="showNodeModal(props)"
            />
          </template>
        </VueFlow>
      </div>
    </div>

    <!-- teleports contents inside another element https://vuejs.org/guide/built-ins/teleport.html -->
    <Teleport to="body">
      <Transition
        enter-active-class="duration-300 ease-out"
        leave-active-class="duration-200 ease-in"
        enter-from-class="-translate-y-2 opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="-translate-y-2 opacity-0"
      >
        <NodeModal
          v-if="isModalOpen"
          :node="modalNode"
          @modal-close="isModalOpen = false"
        >
        </NodeModal>
      </Transition>
    </Teleport>
  </div>
</template>
