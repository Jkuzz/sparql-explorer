<template>
  <div
    class="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex items-center justify-center"
    @click.self="onCloseModal"
  >
    <div
      :class="[
        'bg-blue-100 rounded-xl shadow-lg',
        'p-4 m-12 w-[80%] min-h-[80%] max-h-[90%] flex flex-col',
      ]"
    >
      <main class="flex-grow flex flex-col items-stretch">
        <h4 class="pb-2 text-lg text-center text-black font-bold">Paste import data</h4>
        <h4
          class="text-lg text-center text-red-600"
          v-if="errorText"
        >
          {{ errorText }}
        </h4>
        <textarea
          autofocus
          v-model="inputText"
          class="p-2 flex flex-1"
        />
        <div class="flex pt-2 justify-center">
          <ButtonGeneric @click="handleImpportButton">Import</ButtonGeneric>
          <ButtonGeneric>Schema</ButtonGeneric>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import { parseInput } from '@/importParser'
import { ref } from 'vue'

const emits = defineEmits(['modal-close'])
const inputText = ref('')
const errorText = ref('')

function onCloseModal() {
  emits('modal-close')
}

function handleImpportButton() {
  try {
    parseInput(inputText.value)
    errorText.value = ''
  } catch (e) {
    errorText.value = '' + e
    window.setTimeout(() => {
      errorText.value = ''
    }, 10000)
  }
}
</script>
