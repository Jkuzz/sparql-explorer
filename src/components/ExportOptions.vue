<script setup lang="ts">
import type { StoreNode } from '@/stores/validators'
import exportSchema from '@/stores/schema'
import parserTypescript from 'prettier/parser-typescript.js'

const emit = defineEmits<{
  (event: 'export', exportedSchema: string, prismClass: string, prettierConfig: Object): void
}>()

const props = defineProps<{
  nodes: StoreNode[]
  selectedAttributes: { [key: string]: string[] }
}>()

interface Exporter {
  (nodes: StoreNode[], selectedAttributes: { [key: string]: string[] }): string
}

type ExportDef = {
  label: string
  exporter: Exporter
  prismClass: string
  prettierConfig: Object
}

const registeredExports: ExportDef[] = [
  {
    label: 'LDKit',
    exporter: exportSchema satisfies Exporter,
    prismClass: 'language-ts',
    prettierConfig: {
      semi: false,
      parser: 'typescript',
      plugins: [parserTypescript],
    },
  },
]

function handleExportClick(exp: ExportDef) {
  const exportSchema = exp.exporter(props.nodes, props.selectedAttributes)
  emit('export', exportSchema, exp.prismClass, exp.prettierConfig)
}
</script>

<template>
  <div>
    <div class="pb-4 text-lg text-black font-bold">Choose your export format</div>
    <div class="flex flex-row flex-wrap max-h-[60vh] overflow-auto items-center justify-center">
      <button
        v-for="(exp, i) in registeredExports"
        :key="i"
        class="rounded-md bg-orange-500 transition-all py-0 px-8 m-2 hover:py-2 hover:m-0 hover:px-10 flex"
        @click="handleExportClick(exp)"
      >
        <span class="p-12 font-bold text-xl">{{ exp.label }}</span>
      </button>
    </div>
  </div>
</template>
