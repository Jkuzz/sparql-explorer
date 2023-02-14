<template>
  <div
    class="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex items-center justify-center"
    @click.self="onCloseModal"
  >
    <div class="bg-blue-100 p-6 m-12 max-h-screen rounded-xl shadow-lg overflow-y-auto">
      <header>
        <h2 class="text-lg font-bold text-center">{{ node?.id }}</h2>
      </header>

      <main class="overflow-y-auto">{{ node }}</main>

      <footer class="pt-4 flex justify-end">Footer</footer>
    </div>
  </div>
</template>

<script setup lang="ts">
// import ButtonGeneric from '@/components/ButtonGeneric.vue'
// import { ref } from 'vue'
import type { StoreNode } from '@/stores/validators'

const emits = defineEmits(['modal-close'])
defineProps<{
  node?: StoreNode
}>()

function onCloseModal() {
  emits('modal-close')
}
</script>
