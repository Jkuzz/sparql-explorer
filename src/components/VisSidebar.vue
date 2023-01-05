<script setup lang="ts">
import { useEndpointStore } from '@/stores/endpoint'
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import EndpointSelector from '@/components/EndpointSelector.vue'
import ShoppingCart from '@/components/ShoppingCart.vue'

const endpointStore = useEndpointStore()
</script>

<template>
  <aside
    :class="[
      'bg-neutral-800 border-r border-neutral-500 text-gray-200',
      'py-4 px-2 overflow-y-auto overflow-x-clip w-64 xl:w-80',
      'flex flex-col items-center gap-y-8',
    ]"
  >
    <EndpointSelector />
    <ButtonGeneric @click="endpointStore.fetchNode"> Add node </ButtonGeneric>
    <ShoppingCart />
  </aside>
</template>
