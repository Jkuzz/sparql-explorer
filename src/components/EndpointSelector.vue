<script setup lang="ts">
import { useEndpointStore } from '@/stores/endpoint'
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import EndpointModal from '@/components/EndpointModal.vue'
import { ref } from 'vue'

const endpointStore = useEndpointStore()
const endpointModalOpen = ref(false)

/**
 * Save the new endpoint url
 */
function handleEndpointChange(newEndpoint: string) {
  try {
    const newEndpointUrl = new URL(newEndpoint)
    if (newEndpointUrl.toString() !== endpointStore.endpointURL) {
      endpointStore.changeEndpoint(newEndpointUrl)
    }
  } catch (_e) {
    return
  }
  endpointModalOpen.value = false
}
</script>

<template>
  <div class="p-1 flex flex-row items-center gap-2">
    <div>
      {{ endpointStore.endpointURL }}
    </div>
    <ButtonGeneric
      @click="endpointModalOpen = true"
      class="transition-all"
    >
      Change
    </ButtonGeneric>
  </div>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      leave-active-class="duration-200 ease-in"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <EndpointModal
        :current-url="endpointStore.endpointURL"
        @modal-close="endpointModalOpen = false"
        @change-endpoint="handleEndpointChange"
        v-if="endpointModalOpen"
      />
    </Transition>
  </Teleport>
</template>
