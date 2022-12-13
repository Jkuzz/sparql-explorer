<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ data: any }>()

const selected = ref(false)

function handleClick() {
  selected.value = !selected.value
}
</script>

<template>
  <div
    class="p-2 rounded-lg border-2 border-black"
    :class="{ 'bg-blue-200': !selected, 'bg-purple-300': selected }"
    @click="handleClick"
  >
    <div class="text-black">{{ props.data.data.class.value }}</div>
  </div>
</template>
