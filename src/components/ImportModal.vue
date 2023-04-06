<template>
  <div
    class="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex items-center justify-center"
    @click.self="onCloseModal"
  >
    <div
      :class="[
        'bg-blue-100 rounded-xl shadow-lg',
        'p-4 m-12 w-[80%] min-h-[60%] max-h-[90%] flex flex-col',
      ]"
    >
      <main class="flex-grow flex flex-col items-stretch">
        <h4 class="pb-2 text-lg text-center text-black font-bold">Paste import data</h4>
        <textarea
          autofocus
          class="p-2 flex flex-1"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref } from 'vue'

const emits = defineEmits(['modal-close'])

function onCloseModal() {
  emits('modal-close')
}
</script>
