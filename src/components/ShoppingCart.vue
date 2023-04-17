<script setup lang="ts">
import { useVisStateStore } from '@/stores/visState'

const visStateStore = useVisStateStore()
</script>

<template>
  <div class="flex flex-col text-neutral-50 overflow-y-auto">
    <h4 class="text-center text-xl">Selected classes</h4>
    <ul class="flex flex-col gap-y-2">
      <li
        v-for="node in visStateStore.selectedNodes"
        :key="node.id"
        class="bg-slate-700 p-2 rounded-md"
      >
        {{ node.id }}
      </li>
      <li
        class="p-4 text-center italic"
        v-if="visStateStore.selectedNodes.length === 0"
      >
        You can select a class by clicking on its class node and activating the toggle
      </li>
    </ul>
  </div>
</template>
