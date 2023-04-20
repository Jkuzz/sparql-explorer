<script setup lang="ts">
import { useEndpointStore } from '@/stores/endpoint'
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import { ref } from 'vue'

const endpointStore = useEndpointStore()
const newEndpoint = ref('')
const changing = ref(false)

function handleChangeButtonClick() {
  // Save the new endpoint url
  if (changing.value) {
    try {
      const newEndpointUrl = new URL(newEndpoint.value)
      console.log(newEndpointUrl.toString())
      console.log(endpointStore.endpointURL)
      if (newEndpointUrl.toString() !== endpointStore.endpointURL) {
        endpointStore.changeEndpoint(newEndpointUrl)
      }
    } catch (_e) {
      return
    }
  } else {
    // Enter the existing url into the input
    newEndpoint.value = endpointStore.endpointURL.toString()
  }
  changing.value = !changing.value
}
</script>

<template>
  <div class="flex flex-col items-center gap-y-2">
    <div>
      {{ endpointStore.endpointURL }}
    </div>
    <Transition
      enter-from-class="opacity-0 translate-y-[-30%]"
      enter-active-class="transition duration-300 ease-out"
      leave-to-class="opacity-0 translate-y-[-30%]"
      leave-active-class="transition duration-300 ease-out"
    >
      <input
        class="text-black rounded p-2"
        type="text"
        v-model="newEndpoint"
        v-if="changing"
        @keydown.enter="handleChangeButtonClick"
      />
    </Transition>
    <ButtonGeneric
      @click="handleChangeButtonClick"
      class="transition-all"
    >
      {{ changing ? 'Save' : 'Change Endpoint' }}
    </ButtonGeneric>
  </div>
</template>
