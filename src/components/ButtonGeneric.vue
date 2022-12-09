<template>
  <button
    class="p-2 cursor-pointer bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg"
    @click="emits('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const emits = defineEmits(['click'])
</script>
