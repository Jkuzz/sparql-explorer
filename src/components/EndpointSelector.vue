<script setup lang="ts">
import { useEndpointStore } from '@/stores/endpoint'
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import { ref } from 'vue'

const endpointStore = useEndpointStore()
const newEndpoint = ref('')
const changing = ref(false)

function handleChangeButtonClick() {
  if (changing.value) {
    try {
      const newEndpointUrl = new URL(newEndpoint.value)
      endpointStore.changeEndpoint(newEndpointUrl)
    } catch (_e) {
      return
    }
  } else {
    newEndpoint.value = endpointStore.endpointURL.toString()
  }
  changing.value = !changing.value
}
</script>

<template>
  <div class="flex flex-col items-center space-y-4">
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
