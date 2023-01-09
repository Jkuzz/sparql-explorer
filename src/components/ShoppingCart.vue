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
    <ul
      class="flex flex-col gap-y-2"
      v-auto-animate
    >
      <li
        v-for="node in visStateStore.selectedNodes"
        :key="node.id"
        class="bg-neutral-700 p-2 rounded-md"
      >
        {{ node.id }}
      </li>
    </ul>
  </div>
</template>
