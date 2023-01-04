<script setup lang="ts">
import { ref } from 'vue'
import { useVisStateStore } from '@/stores/visState'
import type { StoreNode } from '@/stores/endpoint'

const visStateStore = useVisStateStore()
const props = defineProps<{ data: any }>()
const selected = ref(false)

function handleClick() {
  if (selected.value) {
    visStateStore.deselectNode(props.data satisfies StoreNode)
  } else {
    visStateStore.selectNode(props.data satisfies StoreNode)
  }
  selected.value = !selected.value
  console.log(props.data.data)
}
</script>

<template>
  <div
    class="p-2 rounded-md border-2 border-black text-black group"
    :class="[selected ? 'bg-purple-300' : 'bg-blue-200']"
    @click="handleClick"
  >
    <div>{{ data.data.class.value }}</div>
    <ul
      class="hidden group-hover:block"
      v-if="selected"
    >
      <li>Hello</li>
      <li>World</li>
    </ul>
  </div>
</template>
