<script setup lang="ts">
import VisSidebar from '@/components/VisSidebar.vue'
import VisCanvas from '@/components/VisCanvas.vue'
</script>

<template>
  <div class="flex flex-row">
    <VisSidebar />
    <VisCanvas class="flex-grow" />
  </div>
</template>
