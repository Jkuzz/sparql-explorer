<script setup lang="ts">
// import { useEndpointStore } from '@/stores/endpoint'
import { useVisStateStore } from '@/stores/visState'
// import ButtonGeneric from '@/components/ButtonGeneric.vue'

// const endpointStore = useEndpointStore()
const visStateStore = useVisStateStore()
</script>

<template>
  <div class="flex flex-col gap-y-4 text-neutral-50">
    <h4 class="text-center">Selected classes</h4>
    <div class="overflow-y-auto px-1">
      <div
        v-for="node in visStateStore.selectedNodes"
        :key="node.id"
      >
        {{ node.id }}
      </div>
    </div>
  </div>
</template>
