<script setup lang="ts">
import type { z } from 'zod'
import type { AttributeBinding } from '@/stores/validators'
import { ref, computed } from 'vue'
import SpinnerLoader from '@/components/SpinnerLoader.vue'
import TooltipGeneric from '@/components/TooltipGeneric.vue'

defineEmits<{
  (e: 'change', edge: string): void
}>()

defineExpose({ toggleAll })

const props = defineProps<{
  instanceCount: number
  nodeSelected: boolean
  attributes: z.infer<typeof AttributeBinding>[]
  selectedAttributes?: string[]
  searchStr: string
}>()

const filteredAttributes = computed(() => {
  return props.attributes.filter((attr) => attr.attribute.value.includes(props.searchStr))
})

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
  <div
    v-if="attributes.length > 0"
    class="flex max-h-[60vh] rounded-md overflow-y-auto"
  >
    <table class="table-auto w-full">
      <tr>
        <th>
          <div class="group relative w-min mx-auto">
            <TooltipGeneric
              horizontal-position="right"
              vertical-position="bottom"
            >
              IRI of the attribute
            </TooltipGeneric>
            <span>Attribute</span>
          </div>
        </th>
        <th>
          <div class="group relative w-min mx-auto">
            <TooltipGeneric
              horizontal-position="right"
              vertical-position="bottom"
            >
              IRI of type of the attribute
            </TooltipGeneric>
            <span>Type</span>
          </div>
        </th>
        <th>
          <div class="group relative w-min mx-auto">
            <TooltipGeneric
              horizontal-position="left"
              vertical-position="bottom"
            >
              How many instances of the attribute occur on average
            </TooltipGeneric>
            <span>Occurence</span>
          </div>
        </th>
        <th>
          <div class="group relative w-min mx-auto">
            <TooltipGeneric
              horizontal-position="left"
              vertical-position="bottom"
            >
              Include this attribute in the exported schema
            </TooltipGeneric>
            <span>Select</span>
          </div>
        </th>
      </tr>
      <tr
        v-for="(attr, i) in filteredAttributes"
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
        <td class="text-center p-1">{{ attr.type.value }}</td>
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
  <div
    class="mt-20 flex flex-col items-center"
    v-else
  >
    <SpinnerLoader />
    <span class="text-center w-[50%] p-2">
      Searching. Try closing this modal and checking later. If none appear, the endpoint might not
      contain any.
    </span>
  </div>
</template>
