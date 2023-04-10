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
      <main class="flex-grow">
        <pre
          v-if="exportText"
          class="rounded-md max-h-[80vh] overflow-y-auto"
        ><code :class="prismClass">{{ exportText }}</code></pre>
        <div
          class="text-center text-slate-300"
          v-else
        >
          <ExportOptions
            :nodes="visStateStore.selectedNodes"
            :selected-attributes="visStateStore.selectedAttributes"
            @export="handleExport"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVisStateStore } from '@/stores/visState'
import ExportOptions from '@/components/ExportOptions.vue'
import { ref } from 'vue'
import { format } from 'prettier'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/themes/prism-tomorrow.min.css'

const visStateStore = useVisStateStore()

const emits = defineEmits(['modal-close'])

const exportText = ref('')
const prismClass = ref('')

function onCloseModal() {
  emits('modal-close')
}

function handleExport(exportedSchema: string, newPrismClass: string, prettierConfig: Object) {
  prismClass.value = newPrismClass
  // Format the schema export using prettier
  // Syntax errors will break this!!
  if (prettierConfig) {
    exportText.value = format(exportedSchema, prettierConfig)
  } else {
    exportText.value = exportedSchema
  }
  // Don't ask me why this needs a 0 timeout but it doesn't highlight otherwise
  setTimeout(Prism.highlightAll, 0)
}
</script>

<style scoped>
pre,
code {
  margin: 0;
}
</style>
