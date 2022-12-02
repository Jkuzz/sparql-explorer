<script setup lang="ts">
import { useEndpointStore } from '@/stores/endpoint'
import ButtonGeneric from './ButtonGeneric.vue'

const endpointStore = useEndpointStore()
</script>

<template>
  <aside class="bg-slate-800 p-4 overflow-y-auto w-64 text-gray-200 flex flex-col items-center">
    <div class="">Sidebar</div>
    <ButtonGeneric @click="endpointStore.fetchNode"> Add node </ButtonGeneric>
  </aside>
</template>
