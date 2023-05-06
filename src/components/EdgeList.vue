<script setup lang="ts">
import { computed } from 'vue'
import type { StoreEdge } from '@/stores/validators'
import { useVisStateStore } from '@/stores/visState'
import { ref } from 'vue'
import SpinnerLoader from '@/components/SpinnerLoader.vue'
import TooltipGeneric from '@/components/TooltipGeneric.vue'

const visStateStore = useVisStateStore()
defineEmits<{
  (e: 'change', edge: StoreEdge): void
}>()

const props = defineProps<{
  instanceCount: number
  edges?: StoreEdge[]
  nodeSelected: boolean
  filterSelected: boolean
  searchStr: string
  selectedEdges?: StoreEdge[]
  type: 'to' | 'from'
}>()

defineExpose({ toggleAll })

const inputs = ref<HTMLInputElement[]>([])
const sortingCol = ref<'property' | 'occurence' | 'source'>('occurence')

/**
 * Filter all the edges to only show those to selected nodes
 */
const filteredEdges = computed(() => {
  return props.edges
    ?.filter((edge) => {
      if (!props.filterSelected) return true
      if (props.type == 'from') return visStateStore.isSelected(edge.target)
      return visStateStore.isSelected(edge.source)
    })
    .filter((edge) => edge.id.includes(props.searchStr))
    .sort(edgeComparator)
})

function edgeComparator(a: StoreEdge, b: StoreEdge) {
  switch (sortingCol.value) {
    case 'occurence': {
      return +b.data.instanceCount.type - +a.data.instanceCount.value
    }
    case 'property': {
      return a.uri.localeCompare(b.uri)
    }
    case 'source': {
      if (props.type == 'to') return a.source.localeCompare(b.source)
      return a.target.localeCompare(b.target)
    }
  }
  return 0
}

function handleUriClick(uri: string) {
  navigator.clipboard.writeText(uri)
}

function getEdgeRatio(edge: StoreEdge) {
  const nodeCount = props.instanceCount
  const attributeCount = edge.data.instanceCount.value
  if (!nodeCount) return 0
  return +((+attributeCount / +nodeCount) * 100).toFixed(2)
}

function toggleAll(target: boolean) {}
</script>

<template>
  <div
    class="flex max-h-[60vh] overflow-y-auto rounded-md"
    v-if="edges && edges.length > 0"
  >
    <table class="p-0 w-full rounded-b-md table-auto">
      <thead>
        <tr>
          <th scope="col">
            <div class="group relative w-min mx-auto">
              <TooltipGeneric
                horizontal-position="right"
                vertical-position="bottom"
              >
                IRI of the {{ type === 'to' ? 'source' : 'target' }} class
              </TooltipGeneric>
              <span
                class="cursor-pointer"
                @click="sortingCol = 'source'"
                >{{ type === 'to' ? 'Source' : 'Target' }}</span
              >
            </div>
          </th>
          <th scope="col">
            <div class="group relative w-min mx-auto">
              <TooltipGeneric
                horizontal-position="right"
                vertical-position="bottom"
              >
                IRI of the connecting edge
              </TooltipGeneric>
              <span
                class="cursor-pointer"
                @click="sortingCol = 'property'"
                >Property</span
              >
            </div>
          </th>
          <th scope="col">
            <div class="group relative w-min mx-auto">
              <TooltipGeneric
                horizontal-position="left"
                vertical-position="bottom"
              >
                How many instances of the attribute occur on average
              </TooltipGeneric>
              <span
                class="cursor-pointer"
                @click="sortingCol = 'occurence'"
                >Occurence</span
              >
            </div>
          </th>
          <th scope="col">
            <div
              class="group relative w-min mx-auto"
              v-if="selectedEdges"
            >
              <TooltipGeneric
                horizontal-position="left"
                vertical-position="bottom"
              >
                Include this edge in the exported schema
              </TooltipGeneric>
              <span>Select</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="">
        <tr
          v-for="(edge, i) in filteredEdges"
          :key="edge.type"
          class=""
          :class="{ 'bg-blue-200': i % 2 == 0 }"
        >
          <td
            class="cursor-pointer hover:underline p-2"
            @click="handleUriClick(edge.source)"
          >
            {{ type === 'to' ? edge.source : edge.target }}
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
            v-if="selectedEdges"
          >
            <input
              :class="{ 'cursor-not-allowed': !nodeSelected }"
              type="checkbox"
              @change="$emit('change', edge)"
              :disabled="!nodeSelected"
              :checked="selectedEdges?.includes(edge)"
              ref="inputs"
            />
          </td>
        </tr>
      </tbody>
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
