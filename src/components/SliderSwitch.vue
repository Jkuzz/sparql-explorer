<template>
  <label
    class="flex items-center justify-center m-2"
    :class="[isRequired ? 'cursor-not-allowed' : 'cursor-pointer']"
  >
    <!-- toggle -->
    <div class="relative">
      <!-- input -->
      <input
        :id="value"
        type="checkbox"
        class="sr-only"
        :value="value"
        :disabled="isRequired"
        :checked="isRequired || isDefaultEnabled"
        @input="onToggle()"
      />
      <!-- line -->
      <div
        class="w-10 h-4 rounded-full shadow-inner"
        :class="[isRequired ? 'bg-secondary' : 'bg-slate-100']"
      />
      <!-- dot -->
      <div
        class="dot absolute w-6 h-6 rounded-full shadow-lg -left-1 -top-1 transition"
        :class="[isRequired ? 'bg-gray-600' : isEnabled ? 'bg-green-500' : 'bg-gray-500']"
      />
    </div>
  </label>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emits = defineEmits(['update:checkbox'])
const isEnabled = ref(false)

function onToggle() {
  isEnabled.value = !isEnabled.value
  emits('update:checkbox', props.value, isEnabled.value)
}

const props = defineProps<{
  value: string
  isRequired?: boolean
  isDefaultEnabled?: boolean
}>()

onMounted(() => {
  if (props.isRequired || props.isDefaultEnabled) {
    isEnabled.value = true
    emits('update:checkbox', props.value, true)
  }
})
</script>

<style scoped>
input:checked ~ .dot {
  transform: translateX(100%);
}
</style>
