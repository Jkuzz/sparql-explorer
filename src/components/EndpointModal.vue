<template>
  <div
    class="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex items-center justify-center"
    @click.self="onCloseModal"
  >
    <div
      :class="[
        'bg-blue-100 rounded-xl shadow-lg relative',
        'p-6 m-12 min-h-[60%] max-h-[90%] flex flex-col',
      ]"
    >
      <div
        class="absolute top-0 right-2 cursor-pointer"
        @click="onCloseModal"
      >
        X
      </div>
      <main class="flex flex-col flex-grow items-center gap-y-12 transition-all">
        <h4
          class="flex flex-col items-center"
          v-if="currentUrl"
        >
          <span class="text-lg font-bold">Current URL:</span>
          <span>
            {{ currentUrl }}
          </span>
        </h4>
        <label class="flex flex-col items-center gap-y-4">
          <h3 class="text-lg font-bold">Enter new endpoint URL</h3>
          <input
            class="rounded-md bg-slate-300 p-4 w-60 sm:w-96"
            type="url"
            v-model="newEndpoint"
            @keydown.enter="handleEndpointSave"
          />
        </label>
        <span
          v-if="errorMessage !== ''"
          class="text-red-600"
        >
          {{ errorMessage }}
        </span>
        <span class="text-center max-w-xs md:max-w-md italic">
          By changing the endpoint you lose all observed data and restart the schema extraction
          process.
        </span>
      </main>
      <aside class="pt-2 flex flex-row justify-center">
        <ButtonGeneric @click="handleEndpointSave">Extract</ButtonGeneric>
        <ButtonGeneric @click="onCloseModal">Cancel</ButtonGeneric>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import { ref } from 'vue'

const emits = defineEmits(['modal-close', 'change-endpoint'])
defineProps<{
  currentUrl?: string
}>()

const newEndpoint = ref('')
const errorMessage = ref('')

function handleEndpointSave() {
  try {
    // if the input is a valid URL
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const testURL = new URL(newEndpoint.value)
  } catch (_e) {
    // Invalid url
    showError(`<${newEndpoint.value}> is not a valid URL`)
    return
  }
  emits('change-endpoint', newEndpoint.value)
}

function showError(error: string) {
  errorMessage.value = error
  window.setTimeout(() => {
    errorMessage.value = ''
  }, 10000)
}

function onCloseModal() {
  emits('modal-close')
}
</script>
