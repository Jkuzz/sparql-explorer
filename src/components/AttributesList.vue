<script setup lang="ts">
import type { z } from 'zod'
import type { AttributeBinding } from '@/stores/validators'

const props = defineProps<{
  instanceCount: number
  attributes: z.infer<typeof AttributeBinding>[]
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
  <ul
    :class="[
      'flex p-0 flex-col gap-y-1 max-h-96 overflow-y-auto rounded-b-md',
      'group-hover:max-w-md',
    ]"
  >
    <li
      v-for="attr in attributes"
      :key="attr.attribute.value"
      class="flex flex-row justify-between gap-x-2"
    >
      <span
        class="cursor-pointer hover:underline"
        @click="handleAttributeClick(attr)"
      >
        {{ attr.attribute.value }}:
      </span>
      <span>{{ getAttributeRatio(attr) }}</span>
    </li>
  </ul>
</template>
