<script setup lang="ts">
import { useEndpointStore } from '@/stores/endpoint'
import VisSidebar from '@/components/VisSidebar.vue'
import VisCanvas from '@/components/VisCanvas.vue'

const endpointStore = useEndpointStore()
</script>

<template>
  <div class="flex flex-row">
    <VisSidebar />
    <VisCanvas class="flex-grow" />
  </div>
</template>
