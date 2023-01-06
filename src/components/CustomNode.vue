<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVisStateStore } from '@/stores/visState'
import { useEndpointStore } from '@/stores/endpoint'
import type { StoreNode } from '@/stores/endpoint'

const visStateStore = useVisStateStore()
const endpointStore = useEndpointStore()
const props = defineProps<{
  data: any
}>()
const selected = ref(visStateStore.isSelected(props.data satisfies StoreNode))
const myNodeData = endpointStore.nodes.find((n) => n.id === props.data.id)

const classLabel = computed(() => {
  const labels = myNodeData?.data.labels
  if (!labels) return ''

  const englishLabel = labels.find((lbl: any) => lbl.value['xml:lang'] == 'en')
  if (!englishLabel) return ''

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
      {{ classLabel || `<${data.id}>` }}
    </div>
    <ul
      class="hidden group-hover:block px-2"
      v-if="selected"
    >
      <li>[{{ classLabel }}]</li>
      <li>[{{ myNodeData }}]</li>
    </ul>
  </div>
</template>
