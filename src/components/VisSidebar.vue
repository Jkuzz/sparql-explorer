<script setup lang="ts">
import { useEndpointStore } from '@/stores/endpoint'
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import EndpointSelector from '@/components/EndpointSelector.vue'

const endpointStore = useEndpointStore()
</script>

<template>
  <aside
    class="bg-blue-700 p-4 overflow-y-auto w-64 space-y-20 text-gray-200 flex flex-col items-center"
  >
    <EndpointSelector />
    <ButtonGeneric @click="endpointStore.fetchNode"> Add node </ButtonGeneric>
  </aside>
</template>
