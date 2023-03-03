<script setup lang="ts">
import type { z } from 'zod'
import type { AttributeBinding } from '@/stores/validators'

defineEmits<{
  (e: 'change', edge: string): void
}>()

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
  return +((+attributeCount / +nodeCount) * 100).toFixed(2)
}
</script>

<template>
  <div class="flex max-h-[60vh] overflow-y-auto rounded-md">
    <table :class="['table-auto w-full']">
      <tr class="">
        <th>Attribute</th>
        <th>Occurence</th>
        <th>Select</th>
      </tr>
      <tr
        v-for="(attr, i) in attributes"
        :key="attr.attribute.value"
        class="p-2"
        :class="{ 'bg-blue-200': i % 2 == 0 }"
      >
        <td
          class="cursor-pointer hover:underline p-2"
          @click="handleAttributeClick(attr)"
        >
          {{ attr.attribute.value }}
        </td>
        <td class="text-center p-1">{{ getAttributeRatio(attr) }}%</td>
        <td class="text-center p-1">
          <input
            type="checkbox"
            @change="$emit('change', attr.attribute.value)"
            :checked="getAttributeRatio(attr) > 50 ? true : false"
          />
        </td>
      </tr>
    </table>
  </div>
</template>
