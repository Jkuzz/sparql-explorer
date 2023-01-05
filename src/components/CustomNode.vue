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
    class="rounded-md text-black group bg-blue-100 shadow-lg"
    @click="handleClick"
  >
    <div
      :class="[
        selected ? 'bg-blue-700' : 'bg-blue-100',
        selected ? 'text-blue-100' : 'text-black',
        { 'group-hover:rounded-b-none': selected },
      ]"
      class="p-1 rounded"
    >
      {{ data.data.class.value }}
    </div>
    <ul
      class="hidden group-hover:block px-2"
      :class="{}"
      v-if="selected"
    >
      <li>- Hello</li>
      <li>- World</li>
    </ul>
  </div>
</template>
