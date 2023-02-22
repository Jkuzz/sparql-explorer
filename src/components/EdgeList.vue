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
      'p-0 max-h-96 w-full overflow-y-auto rounded-b-md',
      'group-hover:max-w-md  flex flex-col',
    ]"
  >
    <thead class="">
      <tr class="flex flex-row justify-between">
        <th scope="col">{{ type === 'to' ? 'Source' : 'Target' }}</th>
        <th scope="col">Property</th>
        <th scope="col">Occurence</th>
      </tr>
    </thead>
    <tbody class="">
      <tr
        v-for="(edge, i) in edges"
        :key="edge.type"
        class="border-b border-gray-300 flex flex-row justify-between"
        :class="{ 'bg-blue-200': i % 2 == 0 }"
      >
        <td
          class="cursor-pointer hover:underline p-2"
          @click="handleUriClick(edge.source)"
        >
          {{ edge.target }}
        </td>
        <td
          class="cursor-pointer hover:underline p-2"
          scope="row"
          @click="handleUriClick(edge.source)"
        >
          {{ edge.uri }}
        </td>
        <td class="p-2">{{ getEdgeRatio(edge) }}</td>
      </tr>
    </tbody>
  </table>
</template>
