<template>
  <button
    :class="[
      'p-2 m-1 hover:m-0 hover:p-3 transition-all cursor-pointer group relative overflow-visible',
      'text-white rounded-md bg-amber-600 hover:bg-amber-700',
    ]"
    @click="emits('click')"
  >
    <slot></slot>
    <span
      v-if="tooltip"
      class="group-hover:opacity-100 transition-opacity bg-gray-600 text-sm text-gray-100 rounded-md absolute opacity-0 p-1 -top-8 left-0 z-50 w-max max-w-xs"
    >
      {{ tooltip }}
    </span>
  </button>
</template>

<script setup lang="ts">
const emits = defineEmits(['click'])

defineProps<{
  tooltip?: string
}>()
</script>
