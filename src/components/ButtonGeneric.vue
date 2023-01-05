<template>
  <button
    :class="[
      'p-2 m-1 hover:m-0 hover:p-3 transition-all cursor-pointer ',
      'text-white rounded-md bg-amber-600 hover:bg-amber-700',
    ]"
    @click="emits('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const emits = defineEmits(['click'])
</script>
