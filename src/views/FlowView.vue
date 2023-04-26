<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { useEndpointStore } from '@/stores/endpoint'
import VisSidebar from '@/components/VisSidebar.vue'
import CustomNode from '@/components/CustomNode.vue'
import NodeModal from '@/components/NodeModal.vue'
import { layoutNodes, availableLayouts, layoutTypes } from '@/stores/layout'
import { ref } from 'vue'
import type { StoreNode } from '@/stores/validators'
import ButtonGeneric from '@/components/ButtonGeneric.vue'

const endpointStore = useEndpointStore()

const isLayoutExtended = ref(false)
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

    <div class="flex-grow flex flex-row relative overflow-clip">
      <div class="h-screen w-full">
        <VueFlow
          v-if="endpointStore.endpointURL !== ''"
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
        <div
          v-else
          class="flex items-center justify-center h-screen w-full"
        >
          <span class="text-center max-w-sm italic">
            Select an endpoint in the sidebar to start extracting the schema.
          </span>
        </div>
      </div>
      <div
        class="p-1 flex flex-row items-center rounded-bl-md absolute bg-slate-700 cursor-pointer right-0"
        @click.self="isLayoutExtended = !isLayoutExtended"
      >
        <span
          @click.self="isLayoutExtended = !isLayoutExtended"
          class="pl-1 select-none"
        >
          Layout
        </span>
        <div
          class="transition-all whitespace-nowrap ease-in-out duration-300"
          :class="{ 'max-w-0': !isLayoutExtended, 'max-w-xs': isLayoutExtended }"
        >
          <ButtonGeneric
            v-for="(layout, i) in availableLayouts"
            :key="i"
            @click="layoutNodes(layout)"
            :tooltip="layoutTypes[layout].tooltip"
            tooltip-vertical="bottom"
            tooltip-horizontal="left"
          >
            {{ layoutTypes[layout].label }}
          </ButtonGeneric>
        </div>
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
          v-if="isModalOpen && modalNode"
          :node="modalNode"
          @modal-close="isModalOpen = false"
        >
        </NodeModal>
      </Transition>
    </Teleport>
  </div>
</template>
