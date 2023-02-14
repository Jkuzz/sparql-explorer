<template>
  <div
    class="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex items-center justify-center"
    @click.self="onCloseModal"
  >
    <div class="bg-blue-100 p-6 rounded-xl shadow-lg">
      <header>
        <h2 class="text-lg font-bold text-center">Header</h2>
      </header>

      <main class="overflow-y-auto">Main</main>

      <footer class="pt-4 flex justify-end">Footer</footer>
    </div>
  </div>
</template>

<script setup lang="ts">
// import ButtonGeneric from '@/components/ButtonGeneric.vue'
// import { ref, type Ref } from 'vue'

const emits = defineEmits(['modal-close'])

function onCloseModal() {
  emits('modal-close')
}
</script>
