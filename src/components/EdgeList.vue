<script setup lang="ts">
import type { z } from 'zod'
import type { AttributeBinding, StoreEdge } from '@/stores/validators'

const props = defineProps<{
  instanceCount: number
  edges?: StoreEdge[]
  type: 'to' | 'from'
}>()

console.log(props.edges)

function handleUriClick(uri: string) {
  navigator.clipboard.writeText(uri)
}

function getAttributeRatio(attribute: z.infer<typeof AttributeBinding>) {
  const nodeCount = props.instanceCount
  const attributeCount = attribute.instanceCount.value
  if (!nodeCount) return 0
  return ((+attributeCount / +nodeCount) * 100).toFixed(2) + '%'
}
</script>

<template>
  <table
    :class="[
      'flex p-0 flex-col gap-y-1 max-h-96 overflow-y-auto rounded-b-md',
      'group-hover:max-w-md',
    ]"
  >
    <tr class="flex flex-row justify-between gap-x-2">
      <th>{{ type === 'to' ? 'Source' : 'Target' }}</th>
      <th>Property</th>
      <th>Occurence</th>
    </tr>
    <tr
      v-for="edge in edges"
      :key="edge.type"
      class="flex flex-row justify-between gap-x-2"
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
      <td>{{ '0%' }}</td>
    </tr>
  </table>
</template>
