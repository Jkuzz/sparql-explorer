<script setup lang="ts">
import type { StoreEdge } from '@/stores/validators'

const props = defineProps<{
  instanceCount: number
  edges?: StoreEdge[]
  type: 'to' | 'from'
}>()

function handleUriClick(uri: string) {
  navigator.clipboard.writeText(uri)
}

function getEdgeRatio(edge: StoreEdge) {
  const nodeCount = props.instanceCount
  const attributeCount = edge.data.instanceCount.value
  if (!nodeCount) return 0
  return ((+attributeCount / +nodeCount) * 100).toFixed(2) + '%'
}
</script>

<template>
  <table
    :class="[
      'p-0 max-h-96 overflow-y-auto rounded-b-md',
      'group-hover:max-w-md table-auto border-spacing-2',
    ]"
  >
    <thead>
      <tr>
        <th>{{ type === 'to' ? 'Source' : 'Target' }}</th>
        <th>Property</th>
        <th>Occurence</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="edge in edges"
        :key="edge.type"
        class=""
      >
        <td
          class="cursor-pointer hover:underline"
          @click="handleUriClick(edge.source)"
        >
          {{ edge.target }}
        </td>
        <td
          class="cursor-pointer hover:underline"
          @click="handleUriClick(edge.source)"
        >
          {{ edge.uri }}
        </td>
        <td>{{ getEdgeRatio(edge) }}</td>
      </tr>
    </tbody>
  </table>
</template>
