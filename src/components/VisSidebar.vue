<script setup lang="ts">
import EndpointSelector from '@/components/EndpointSelector.vue'
import ShoppingCart from '@/components/ShoppingCart.vue'
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import ExportModal from '@/components/ExportModal.vue'
import { ref } from 'vue'

const exportModalOpen = ref(false)

function showExportModal() {
  exportModalOpen.value = true
}
</script>

<template>
  <aside
    :class="[
      'bg-slate-800 border-r border-slate-500 text-gray-200',
      'py-4 px-2 overflow-y-auto overflow-x-clip w-64 xl:w-80',
      'flex flex-col items-center justify-between gap-y-8',
    ]"
  >
    <div class="flex flex-col gap-y-4">
      <EndpointSelector />
      <ShoppingCart />
    </div>
    <ButtonGeneric @click="showExportModal">Export</ButtonGeneric>
  </aside>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      leave-active-class="duration-200 ease-in"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <ExportModal
        v-if="exportModalOpen"
        @modal-close="exportModalOpen = false"
      >
      </ExportModal>
    </Transition>
  </Teleport>
</template>
