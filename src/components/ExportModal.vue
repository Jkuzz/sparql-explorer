<template>
  <div
    class="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex items-center justify-center"
    @click.self="onCloseModal"
  >
    <div
      :class="[
        'bg-blue-100 rounded-xl shadow-lg relative',
        'p-4 m-12 w-[80%] min-h-[60%] max-h-[90%] flex flex-col xl:flex-row',
      ]"
    >
      <div
        class="absolute top-0 right-2 cursor-pointer"
        @click="onCloseModal"
      >
        X
      </div>
      <main class="flex-grow flex justify-center">
        <pre
          v-if="exportText"
          class="rounded-md max-h-[80vh] overflow-y-auto"
        ><code :class="prismClass">{{ exportText }}</code></pre>
        <ExportOptions
          class="text-slate-300 flex flex-1 flex-col items-center"
          v-else
          :nodes="visStateStore.selectedNodes"
          :selected-attributes="visStateStore.selectedAttributes"
          :selected-edges="visStateStore.selectedEdges"
          @export="handleExport"
        />
      </main>
      <aside
        v-if="exportText"
        class="pt-2 xl:pt-0 xl:pl-2 flex flex-row xl:flex-col justify-center"
      >
        <ButtonGeneric @click="copyToClipboard(exportText)">{{ copyButtonText }}</ButtonGeneric>
        <ButtonGeneric @click="downloadFile(exportText, 'schema.ts', '')">Download</ButtonGeneric>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonGeneric from '@/components/ButtonGeneric.vue'
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
const copyButtonText = ref('Copy')

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

/**
 * Create a Blob from the provided text and download it as a file
 * https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
 * @param data file contents
 * @param filename name of the file including extension
 * @param type MIME type for Blob object
 */
function downloadFile(data: string, filename: string, type: string) {
  var file = new Blob([data], { type: type })
  var a = document.createElement('a'),
    url = URL.createObjectURL(file)
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  setTimeout(function () {
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, 0)
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  copyButtonText.value = 'Copied ✅'
  window.setTimeout(() => {
    copyButtonText.value = 'Copy'
  }, 4000)
}
</script>

<style scoped>
pre,
code {
  margin: 0;
}
</style>
