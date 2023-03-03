<script setup lang="ts">
import type { StoreEdge } from '@/stores/validators'

defineEmits<{
  (e: 'change', edge: string): void
}>()

const props = defineProps<{
  instanceCount: number
  edges?: StoreEdge[]
  nodeSelected: boolean
  type: 'to' | 'from'
}>()

function handleUriClick(uri: string) {
  navigator.clipboard.writeText(uri)
}

function getEdgeRatio(edge: StoreEdge) {
  const nodeCount = props.instanceCount
  const attributeCount = edge.data.instanceCount.value
  if (!nodeCount) return 0
  return +((+attributeCount / +nodeCount) * 100).toFixed(2)
}
</script>

<template>
  <div class="flex max-h-[60vh] overflow-y-auto rounded-md">
    <table class="p-0 w-full rounded-b-md table-auto">
      <thead class="">
        <tr class="">
          <th scope="col">{{ type === 'to' ? 'Source' : 'Target' }}</th>
          <th scope="col">Property</th>
          <th scope="col">Occurence</th>
          <th
            scope="col"
            v-if="type === 'from'"
          >
            Select
          </th>
        </tr>
      </thead>
      <tbody class="">
        <tr
          v-for="(edge, i) in edges"
          :key="edge.type"
          class=""
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
          <td class="p-2 text-center">{{ getEdgeRatio(edge) }}%</td>
          <td
            class="text-center p-1"
            v-if="type === 'from'"
          >
            <input
              :class="{ 'cursor-not-allowed': !nodeSelected }"
              type="checkbox"
              @change="$emit('change', edge.id)"
              :disabled="!nodeSelected"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
