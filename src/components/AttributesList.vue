<script setup lang="ts">
import type { z } from 'zod'
import type { AttributeBinding } from '@/stores/validators'

const props = defineProps<{
  instanceCount: number
  attributes?: z.infer<typeof AttributeBinding>[]
}>()

function handleAttributeClick(attr: z.infer<typeof AttributeBinding>) {
  navigator.clipboard.writeText(attr.attribute.value)
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
      <th>Property</th>
      <th>Occurence</th>
    </tr>
    <tr
      v-for="(attr, i) in attributes"
      :key="attr.attribute.value"
      class="flex flex-row justify-between p-2"
      :class="{ 'bg-blue-200': i % 2 == 0 }"
    >
      <td
        class="cursor-pointer hover:underline"
        @click="handleAttributeClick(attr)"
      >
        {{ attr.attribute.value }}:
      </td>
      <td>{{ getAttributeRatio(attr) }}</td>
    </tr>
  </table>
</template>
