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
      <!-- <header>
        <h2 class="text-lg font-bold text-center">Export</h2>
      </header> -->

      <main class="flex-grow">
        <pre
          v-if="exportText"
          class="rounded-md max-h-[80vh] overflow-y-auto"
        ><code class="language-ts">{{ exportText }}</code></pre>
        <div
          class="text-center text-slate-300"
          v-else
        >
          Export to see :)
        </div>
      </main>

      <footer class="flex items-center justify-center pt-3">
        <ButtonGeneric
          class="text-xl font-bold"
          @click="doExport"
          >Export</ButtonGeneric
        >
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import { useVisStateStore } from '@/stores/visState'
import { makeSchema } from '@/stores/schema'
import { ref } from 'vue'
import { format } from 'prettier'
import parserTypescript from 'prettier/parser-typescript.js'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/themes/prism-tomorrow.min.css'

const visStateStore = useVisStateStore()

const emits = defineEmits(['modal-close'])

const exportText = ref('')

function onCloseModal() {
  emits('modal-close')
}

function doExport() {
  // Format the schema export using prettier
  // Syntax errors will break this!!
  exportText.value = format(
    makeSchema(visStateStore.selectedNodes, visStateStore.selectedAttributes),
    { semi: false, parser: 'typescript', plugins: [parserTypescript] }
  )
  // Don't ask me why this needs a 0 timeout but it doesn't highlight otherwise
  setTimeout(Prism.highlightAll, 0)
}

doExport()
</script>

<style scoped>
pre,
code {
  margin: 0;
}
</style>
