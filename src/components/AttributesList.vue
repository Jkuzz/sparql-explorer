<script setup lang="ts">
import type { z } from 'zod'
import type { AttributeBinding } from '@/stores/validators'
import { ref } from 'vue'

defineEmits<{
  (e: 'change', edge: string): void
}>()

defineExpose({ toggleAll })

const props = defineProps<{
  instanceCount: number
  nodeSelected: boolean
  attributes: z.infer<typeof AttributeBinding>[]
  selectedAttributes?: string[]
}>()

const inputs = ref<HTMLInputElement[]>([])

function handleAttributeClick(attr: z.infer<typeof AttributeBinding>) {
  navigator.clipboard.writeText(attr.attribute.value)
}

function getAttributeRatio(attribute: z.infer<typeof AttributeBinding>) {
  const nodeCount = props.instanceCount
  const attributeCount = attribute.instanceCount.value
  if (!nodeCount) return 0
  return +((+attributeCount / +nodeCount) * 100).toFixed(2)
}

function toggleAll(target: boolean) {}
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
            :class="{ 'cursor-not-allowed': !nodeSelected }"
            type="checkbox"
            @change="$emit('change', attr.attribute.value)"
            :disabled="!nodeSelected"
            :checked="selectedAttributes?.includes(attr.attribute.value)"
            ref="inputs"
          />
        </td>
      </tr>
    </table>
  </div>
</template>
