<script setup lang="ts">
import { ref } from 'vue'
import { useVisStateStore } from '@/stores/visState'
import { useEndpointStore } from '@/stores/endpoint'
import type { StoreNode, AttributeBinding } from '@/stores/validators'
import type { z } from 'zod'

const visStateStore = useVisStateStore()
const endpointStore = useEndpointStore()
const props = defineProps<{
  data: StoreNode
}>()
const selected = ref(visStateStore.isSelected(props.data satisfies StoreNode))
const myNodeData = endpointStore.nodes.find((n) => n.id === props.data.id)

// For whatever reason making this computed() does not call reactive recomputes
function getClassLabel() {
  const labels = myNodeData?.data.labels
  if (!labels) return ''

  const englishLabel = labels.find((lbl: any) => lbl.value['xml:lang'] == 'en')
  if (!englishLabel) return ''

  // return englishLabel.value
  const englishLabelValue = englishLabel.value.value
  return englishLabelValue.charAt(0).toUpperCase() + englishLabelValue.slice(1)
}

function handleClick() {
  if (selected.value) {
    visStateStore.deselectNode(props.data.id)
  } else {
    visStateStore.selectNode(props.data.id)
  }
  selected.value = !selected.value
  console.log(props.data)
}

function handleUriClick() {
  if (myNodeData?.id) {
    navigator.clipboard.writeText(myNodeData.id)
  }
}

function getAttributeRatio(attribute: z.infer<typeof AttributeBinding>) {
  const nodeCount = myNodeData?.data.node.instanceCount.value
  const attributeCount = attribute.instanceCount.value
  if (!nodeCount) return 0
  return ((+attributeCount / +nodeCount) * 100).toFixed(2) + '%'
}
</script>

<template>
  <div class="rounded-md text-black group bg-blue-100 shadow-lg transition-all">
    <div
      :class="[
        selected ? 'bg-blue-700' : 'bg-blue-100',
        selected ? 'text-blue-100' : 'text-black',
        { 'group-hover:rounded-b-none': selected },
      ]"
      class="p-1 rounded text-center"
      @click="handleClick"
    >
      {{ getClassLabel() || `<${data.id}>` }}
    </div>
    <ul
      class="hidden group-hover:flex p-2 max-h-96 overflow-auto flex-col gap-y-1"
      :class="[{ nowheel: selected }]"
      v-if="selected"
    >
      <li
        class="cursor-pointer hover:underline text-center mb-2"
        @click="handleUriClick"
      >
        {{ `<${data.id}>` }}
      </li>
      <li
        v-for="attr in data.data.attributes"
        :key="attr.attribute.value"
        class="flex flex-row justify-between gap-x-2"
      >
        <span> {{ attr.attribute.value }}: </span>
        <span>{{ getAttributeRatio(attr) }}</span>
      </li>
      <!-- <li>[{{ myNodeData }}]</li> -->
    </ul>
  </div>
</template>
