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
            @click="handleImportOptionClick(importOptions[option])"
          >
            <span class="p-12 font-bold text-xl text-white">{{ option }}</span>
          </button>
        </div>
        <div
          v-if="displayMode === 'options'"
          class="text-black pt-10 max-w-lg mx-auto italic text-center"
        >
          Not enough import formats? You can help us by implementing a new import format at this
          project's
          <a
            class="text-blue-900"
            href="https://github.com/Jkuzz/sparql-explorer"
            >GitHub page</a
          >
        </div>
        <div
          v-if="displayMode === 'schema'"
          class="flex flex-1 bg-gray-300 p-2 m-1 rounded-md"
        >
          {{ schemaText }}
        </div>
        <div class="flex pt-2 justify-between">
          <div>
            <ButtonGeneric @click="handleBackButton">Back</ButtonGeneric>
            <ButtonGeneric
              v-if="displayMode === 'input'"
              @click="toggleSchemaDisplay"
            >
              Schema
            </ButtonGeneric>
          </div>
          <div v-if="displayMode === 'input'">
            <ButtonGeneric @click="handleImportButton()">Import</ButtonGeneric>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import * as jsonImport from '@/importParser'
import { importSchema, type SchemaType } from '@/importSchema'
import { ref, computed } from 'vue'
import { useEndpointStore } from '@/stores/endpoint'

const endpointStore = useEndpointStore()
const emits = defineEmits(['modal-close'])
const inputText = ref('')
const popupText = ref('')
const popupClass = ref('')
const schemaText = ref('')
const selectedImport = ref<ImportDef | undefined>(undefined)
const displayMode = ref<'input' | 'options' | 'schema'>('options')
const headerText = computed(() => {
  if (displayMode.value === 'options') return 'Select input format'
  if (displayMode.value === 'schema') return "This is the selected import format's schema"
  return 'Paste import data'
})

function onCloseModal() {
  emits('modal-close')
}

type InputParser = (input: string) => SchemaType
type ImportDef = { parser: InputParser; schema: string }

/**
 * Contains import parser options.
 * Object keys are used as labels on buttons
 */
const importOptions: { [key: string]: ImportDef } = {
  JSON: { parser: jsonImport.parseInput, schema: JSON.stringify(importSchema) },
} as const

function toggleSchemaDisplay() {
  displayMode.value = 'schema'
}

function handleBackButton() {
  if (displayMode.value === 'schema') {
    displayMode.value = 'input'
  } else if (displayMode.value === 'input') {
    displayMode.value = 'options'
  } else {
    onCloseModal()
  }
}

function handleImportOptionClick(importDef: ImportDef) {
  schemaText.value = importDef.schema
  selectedImport.value = importDef
  displayMode.value = 'input'
}

function handleImportButton() {
  if (!selectedImport.value) return
  try {
    const parser = selectedImport.value?.parser
    const parsedSchema = parser(inputText.value)
    endpointStore.handleParsedImport(parsedSchema)

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
