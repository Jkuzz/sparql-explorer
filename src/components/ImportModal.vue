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
          class="text-lg text-center"
          :class="popupClass"
          v-if="popupText"
        >
          {{ popupText }}
        </h4>
        <textarea
          autofocus
          v-model="inputText"
          class="p-2 flex flex-1"
        />
        <div class="flex pt-2 justify-center">
          <ButtonGeneric
            v-for="parserName in Object.keys(importOptions)"
            :key="parserName"
            @click="handleImportButton(importOptions[parserName])"
            >Import {{ parserName }}</ButtonGeneric
          >
          <ButtonGeneric>Schema</ButtonGeneric>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import * as jsonImport from '@/importParser'
import { ref } from 'vue'

const emits = defineEmits(['modal-close'])
const inputText = ref('')
const popupText = ref('')
const popupClass = ref('')

function onCloseModal() {
  emits('modal-close')
}

type InputParser = (input: string) => void

/**
 * Contains import parser options.
 * Object keys are used as labels on buttons
 */
const importOptions: { [key: string]: InputParser } = {
  JSON: jsonImport.parseInput,
} as const

function handleImportButton(parse: InputParser) {
  try {
    parse(inputText.value)
    popupClass.value = 'text-green-600'
    popupText.value = 'Imported ✅'
    window.setTimeout(() => {
      popupText.value = ''
    }, 5000)
  } catch (e) {
    popupText.value = '' + e
    popupClass.value = 'text-red-600'
    window.setTimeout(() => {
      popupText.value = ''
    }, 10000)
  }
}
</script>
