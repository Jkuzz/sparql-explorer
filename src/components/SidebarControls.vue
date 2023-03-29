<script setup lang="ts">
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import SpinnerLoader from './SpinnerLoader.vue'
import ExportModal from '@/components/ExportModal.vue'
import { useEndpointStore } from '@/stores/endpoint'
import { ref } from 'vue'

const endpointStore = useEndpointStore()

const exportModalOpen = ref(false)
const classesQueryOpen = ref(false)
const classesQueryNumber = ref(10)
const classesQueryRunning = ref(false)

function showExportModal() {
  exportModalOpen.value = true
}

function handleQueryClasses() {
  classesQueryOpen.value = false
  classesQueryRunning.value = true
  endpointStore.queryClasses(
    endpointStore.nodes.length,
    classesQueryNumber.value,
    classesQueryCallback
  )
}

function classesQueryCallback() {
  classesQueryRunning.value = false
}
</script>

<template>
  <div class="flex flex-col items-center overflow-clip">
    <div class="flex flex-row">
      <ButtonGeneric @click="showExportModal">Export</ButtonGeneric>
      <ButtonGeneric @click="classesQueryOpen = !classesQueryOpen">{{
        classesQueryOpen ? 'Close' : 'More classes'
      }}</ButtonGeneric>
    </div>
    <Transition
      enter-active-class="duration-300 ease-out"
      leave-active-class="duration-200 ease-in"
      enter-from-class="max-h-0"
      enter-to-class="max-h-32"
      leave-from-class="max-h-32"
      leave-to-class="max-h-0"
    >
      <div
        class="flex flex-col transition-all"
        v-if="classesQueryOpen"
      >
        <div
          class="flex flex-row justify-center"
          v-if="!classesQueryRunning"
        >
          <input
            v-model="classesQueryNumber"
            type="number"
            min="1"
            max="30"
            class="w-20 rounded-md m-1 text-black px-1"
          />
          <ButtonGeneric @click="handleQueryClasses">Query</ButtonGeneric>
        </div>
        <SpinnerLoader v-else />
        <span
          class="text-center p-2"
          v-if="!classesQueryRunning"
        >
          Select number of additional classes to query
        </span>
        <span
          class="text-center p-2"
          v-else
        >
          Last query still in progress
        </span>
      </div>
    </Transition>
  </div>
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
