<script setup lang="ts">
import type { StoreNode, StoreEdge } from '@/stores/validators'
import exportSchema from '@/stores/ldkitExport'
import parserTypescript from 'prettier/parser-typescript.js'

const emit = defineEmits<{
  (event: 'export', exportedSchema: string, prismClass: string, prettierConfig: Object): void
}>()

const props = defineProps<{
  nodes: StoreNode[]
  selectedAttributes: { [key: string]: string[] }
  selectedEdges: StoreEdge[]
}>()

interface Exporter {
  (
    nodes: StoreNode[],
    selectedAttributes: { [key: string]: string[] },
    selectedEdges: StoreEdge[]
  ): string
}

type ExportDef = {
  /**
   * The label that will be shown to the user
   */
  label: string
  /**
   * This function will be handed the store's contents and is expected to
   * return the export format, which will be shown to the user
   */
  exporter: Exporter
  /**
   * Class that is assigned to the PrismJS code block, into
   * which the export text will be placed.
   * Refer to https://prismjs.com/#supported-languages
   * for a list of valid options or use empty string for no syntax highlighting.
   */
  prismClass: string
  /**
   * Configuration object that is passed to the prettier formatter.
   * Use a falsy value to not perform formatting.
   */
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
  const exportSchema = exp.exporter(props.nodes, props.selectedAttributes, props.selectedEdges)
  emit('export', exportSchema, exp.prismClass, exp.prettierConfig)
}
</script>

<template>
  <div>
    <h4 class="pb-4 text-lg text-black font-bold">Choose your export format</h4>
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
    <div class="text-black pt-10 max-w-lg mx-auto italic">
      Not enough export formats? You can help by implementing a new export format at this project's
      <a
        class="text-blue-900"
        href="https://github.com/Jkuzz/sparql-explorer"
        >GitHub page</a
      >
    </div>
  </div>
</template>
