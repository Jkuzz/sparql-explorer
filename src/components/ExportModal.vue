<template>
  <div
    class="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex items-center justify-center"
    @click.self="onCloseModal"
  >
    <div
      :class="[
        'bg-blue-100 rounded-xl shadow-lg',
        'p-6 m-12 w-[90%] min-h-[60%] max-h-[90%] flex flex-col',
      ]"
    >
      <header>
        <h2 class="text-lg font-bold text-center">Export</h2>
      </header>

      <main class="flex-grow">Main</main>

      <footer class="pt-4 flex items-center justify-center">
        <ButtonGeneric @click="doExport">Export</ButtonGeneric>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import { useVisStateStore } from '@/stores/visState'

const visStateStore = useVisStateStore()

const emits = defineEmits(['modal-close'])

function onCloseModal() {
  emits('modal-close')
}

function doExport() {
  visStateStore.selectedNodes.forEach((n) => console.log(n))
}
</script>