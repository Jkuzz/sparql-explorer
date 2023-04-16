<template>
  <div
    class="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex items-center justify-center"
    @click.self="onCloseModal"
  >
    <div
      :class="[
        'bg-blue-100 rounded-xl shadow-lg relative',
        'p-4 m-12 w-[80%] min-h-[80%] max-h-[90%] flex flex-col',
      ]"
    >
      <div
        class="absolute top-2 right-4 cursor-pointer"
        @click="onCloseModal"
      >
        X
      </div>
      <main class="flex-grow flex flex-col items-stretch">
        <h4 class="pb-2 text-lg text-center text-black font-bold">{{ headerText }}</h4>
        <h4
          class="text-lg text-center"
          :class="popupClass"
          v-if="popupText"
        >
          {{ popupText }}
        </h4>
        <textarea
          v-if="displayMode === 'input'"
          autofocus
          v-model="inputText"
          class="p-2 flex flex-1 rounded-md"
        />
        <div
          v-if="displayMode === 'options'"
          class="flex flex-1 items-start justify-center"
        >
          <button
            v-for="(option, i) in Object.keys(importOptions)"
            :key="i"
            class="rounded-md bg-orange-500 transition-all py-0 px-8 m-2 hover:py-2 hover:m-0 hover:px-10 flex"
            @click="handleImportSchemaClick(importOptions[option])"
          >
            <span class="p-12 font-bold text-xl text-white">{{ option }}</span>
          </button>
        </div>
        <div
          v-if="displayMode === 'schema'"
          class="flex flex-1 bg-gray-300 p-2 m-1 rounded-md"
        >
          {{ schemaText }}
        </div>
        <div class="flex pt-2 justify-between">
          <ButtonGeneric @click="toggleSchemaDisplay">Schema</ButtonGeneric>
          <div v-if="displayMode === 'input'">
            <ButtonGeneric
              v-for="parserName in Object.keys(importOptions)"
              :key="parserName"
              @click="handleImportButton(importOptions[parserName].parser)"
              >Import {{ parserName }}</ButtonGeneric
            >
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import * as jsonImport from '@/importParser'
import { importSchema } from '@/importSchema'
import { ref, computed } from 'vue'

const emits = defineEmits(['modal-close'])
const inputText = ref('')
const popupText = ref('')
const popupClass = ref('')
const schemaText = ref('')
const displayMode = ref<'input' | 'options' | 'schema'>('input')
const headerText = computed(() => {
  if (displayMode.value === 'options') return 'Select input format'
  if (displayMode.value === 'schema') return "This is the selected import format's schema"
  return 'Paste import data'
})

function onCloseModal() {
  emits('modal-close')
}

type InputParser = (input: string) => void
type ImportDef = { parser: InputParser; schema: string }

/**
 * Contains import parser options.
 * Object keys are used as labels on buttons
 */
const importOptions: { [key: string]: ImportDef } = {
  JSON: { parser: jsonImport.parseInput, schema: JSON.stringify(importSchema) },
} as const

function toggleSchemaDisplay() {
  if (displayMode.value === 'input') {
    displayMode.value = 'options'
  } else {
    displayMode.value = 'input'
  }
}

function handleImportSchemaClick(importDef: ImportDef) {
  schemaText.value = importDef.schema
  displayMode.value = 'schema'
}

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
