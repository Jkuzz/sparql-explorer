<script setup lang="ts">
import { computed } from 'vue'
import { useVisStateStore } from '@/stores/visState'
import { useEndpointStore } from '@/stores/endpoint'
import type { StoreNode } from '@/stores/validators'

const visStateStore = useVisStateStore()
const endpointStore = useEndpointStore()
const props = defineProps<{
  data: StoreNode
}>()
const selected = computed(() => visStateStore.isSelected(props.data.id))
const myNodeData = endpointStore.nodes.find((n) => n.id === props.data.id)

// For whatever reason making this computed() does not call reactive recomputes
function getClassLabel() {
  const labels = myNodeData?.data.labels
  if (!labels) return ''

  const englishLabel = labels.find((lbl: any) => lbl.value['xml:lang'] == 'en')
  if (!englishLabel) return ''

  const englishLabelValue = englishLabel.value.value
  return englishLabelValue.charAt(0).toUpperCase() + englishLabelValue.slice(1)
}
</script>

<template>
  <div class="rounded-md text-black group bg-blue-100 shadow-lg">
    <div
      :class="[
        selected ? 'bg-blue-700' : 'bg-blue-100',
        selected ? 'text-blue-100' : 'text-black',
        selected ? 'p-2' : 'p-1',
        { 'group-hover:rounded-b-none': selected },
      ]"
      class="rounded text-center transition-all"
    >
      {{ getClassLabel() || `<${data.id}>` }}
    </div>
  </div>
</template>
