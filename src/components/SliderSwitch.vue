<template>
  <label class="flex items-center justify-center m-2 cursor-pointer">
    <!-- toggle -->
    <div class="relative">
      <!-- input -->
      <input
        :id="value"
        type="checkbox"
        class="sr-only"
        :value="value"
        :checked="isDefaultEnabled"
        @input="onToggle()"
      />
      <!-- line -->
      <div class="w-10 h-4 rounded-full shadow-inner bg-slate-100" />
      <!-- dot -->
      <div
        class="dot absolute w-6 h-6 rounded-full shadow-lg -left-1 -top-1 transition"
        :class="[isEnabled ? 'bg-green-500' : 'bg-gray-500']"
      />
    </div>
  </label>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  value: string
  isDefaultEnabled?: boolean
}>()

const emits = defineEmits(['update:checkbox'])
const isEnabled = ref(props.isDefaultEnabled)

function onToggle() {
  isEnabled.value = !isEnabled.value
  emits('update:checkbox', isEnabled.value, props.value)
}
</script>

<style scoped>
input:checked ~ .dot {
  transform: translateX(100%);
}
</style>
