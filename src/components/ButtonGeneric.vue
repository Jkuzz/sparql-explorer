<template>
  <button
    class="p-2 cursor-pointer bg-blue-600 hover:bg-blue-500 rounded-lg"
    @click="emits('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const emits = defineEmits(['click'])
</script>
