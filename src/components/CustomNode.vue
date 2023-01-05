<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVisStateStore } from '@/stores/visState'
import type { StoreNode } from '@/stores/endpoint'

const visStateStore = useVisStateStore()
const props = defineProps<{
  data: any
}>()
const selected = ref(visStateStore.isSelected(props.data satisfies StoreNode))

const getClassLabel = computed(() => {
  const labels = props.data.data.labels
  if (!labels) return undefined

  const englishLabel = labels.find((lbl: any) => lbl.value['xml:lang'] == 'en')
  if (!englishLabel) return undefined

  const englishLabelValue = englishLabel.value.value
  return englishLabelValue.charAt(0).toUpperCase() + englishLabelValue.slice(1)
})

function handleClick() {
  if (selected.value) {
    visStateStore.deselectNode(props.data.id)
  } else {
    visStateStore.selectNode(props.data.id)
  }
  selected.value = !selected.value
  console.log(props.data)
}
</script>

<template>
  <div
    class="rounded-md text-black group bg-blue-100 shadow-lg transition-all"
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
      {{ getClassLabel || `<${data.id}>` }}
    </div>
    <ul
      class="hidden group-hover:block px-2"
      v-if="selected"
    >
      <li>[{{ getClassLabel }}]</li>
      <!-- <li>- {{ data.data }}</li> -->
    </ul>
  </div>
</template>
