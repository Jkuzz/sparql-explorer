<template>
  <div
    class="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex items-center justify-center"
    @click.self="onCloseModal"
    v-if="node"
  >
    <div
      :class="[
        'bg-blue-100 rounded-xl shadow-lg relative',
        'p-6 m-12 w-[90%] min-h-[60%] max-h-[90%] flex flex-col',
      ]"
    >
      <div
        class="absolute top-2 right-4 cursor-pointer"
        @click="onCloseModal"
      >
        X
      </div>
      <header class="flex flex-row justify-center items-center relative pb-2">
        <div class="flex flex-row group items-center bg-slate-700 p-1 rounded-md left-0 absolute">
          <span class="text-white pl-1">Selected</span>
          <SliderSwitch
            :isDefaultEnabled="isSelected"
            @update:checkbox="onToggleSelection"
            value="selected"
          />
          <TooltipGeneric
            vertical-position="bottom"
            horizontal-position="right"
          >
            Include this class in the exported schema
          </TooltipGeneric>
        </div>
        <h2
          class="text-lg font-bold text-center hover:underline cursor-pointer"
          @click="copyToClipboard(node.id)"
        >
          {{ node.id }}
        </h2>
        <div class="px-2">
          [{{ (+node.data.node.instanceCount.value).toLocaleString(undefined, {}) }}×]
        </div>
        <div
          class="flex flex-row group items-center bg-slate-700 p-1 rounded-md m-1 absolute right-0"
          v-if="['incoming', 'outgoing'].includes(displayMode)"
        >
          <span class="text-white pl-1">Filter selected</span>
          <SliderSwitch
            :isDefaultEnabled="false"
            @update:checkbox="filterSelected = !filterSelected"
            value="filterSelected"
          />
          <TooltipGeneric
            vertical-position="bottom"
            horizontal-position="left"
          >
            Only include the edges that lead
            {{ displayMode === 'incoming' ? 'from' : 'to' }} selected classes
          </TooltipGeneric>
        </div>
      </header>

      <main class="flex-grow">
        <div class="flex flex-row items-center justify-between relative">
          <label
            >Search
            <input
              class="border border-slate-600 rounded-md p-1"
              type="text"
              v-model="searchStr"
            />
          </label>
          <div>
            <ButtonGeneric
              :active="displayMode === 'attributes'"
              :expand="false"
              intent="tab"
              @click="displayMode = 'attributes'"
            >
              Attributes ({{ node.data.attributes.length }})</ButtonGeneric
            >
            <ButtonGeneric
              :active="displayMode === 'outgoing'"
              :expand="false"
              intent="tab"
              class="m-0"
              @click="displayMode = 'outgoing'"
            >
              Outgoing edges ({{ endpointStore.getNodeFromEdges(node.id).length }})</ButtonGeneric
            >
            <ButtonGeneric
              :active="displayMode === 'incoming'"
              :expand="false"
              intent="tab"
              @click="displayMode = 'incoming'"
            >
              Incoming edges ({{ endpointStore.getNodeToEdges(node.id).length }})</ButtonGeneric
            >
          </div>
          <!-- <div
            class="absolute right-2"
            v-if="['attributes', 'outgoing'].includes(displayMode)"
          >
            <label class="flex flex-col"
              >Select all
              <input
                type="checkbox"
                :disabled="!isSelected"
                @change="handleSelectAllToggle"
              />
            </label>
          </div> -->
        </div>
        <AttributesList
          v-if="displayMode === 'attributes'"
          :attributes="node.data.attributes"
          :instance-count="+node.data.node.instanceCount.value"
          @change="handleAttributeSelection"
          :node-selected="isSelected"
          :selected-attributes="visStateStore.selectedAttributes[node.id]"
          :search-str="searchStr"
          ref="attributesList"
        />
        <EdgeList
          v-if="displayMode === 'outgoing'"
          :edges="endpointStore.getNodeFromEdges(node.id).sort(edgesSort)"
          type="from"
          :instance-count="+node.data.node.instanceCount.value"
          @change="handleEdgeSelection"
          :node-selected="isSelected"
          :filter-selected="filterSelected"
          :selected-edges="visStateStore.selectedEdges"
          :search-str="searchStr"
          ref="outEdgeList"
        />
        <EdgeList
          v-if="displayMode === 'incoming'"
          :edges="endpointStore.getNodeToEdges(node.id).sort(edgesSort)"
          type="to"
          :instance-count="+node.data.node.instanceCount.value"
          :node-selected="isSelected"
          :filter-selected="filterSelected"
          :search-str="searchStr"
        />
      </main>

      <footer class="pt-4 flex justify-center relative"></footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import AttributesList from '@/components/AttributesList.vue'
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import EdgeList from '@/components/EdgeList.vue'
import SliderSwitch from '@/components/SliderSwitch.vue'
import TooltipGeneric from '@/components/TooltipGeneric.vue'
import { ref } from 'vue'
import type { StoreNode, StoreEdge } from '@/stores/validators'
import { useEndpointStore } from '@/stores/endpoint'
import { useVisStateStore } from '@/stores/visState'

const emits = defineEmits(['modal-close'])
const props = defineProps<{
  node: StoreNode
}>()
const endpointStore = useEndpointStore()
const visStateStore = useVisStateStore()

const outEdgeList = ref<InstanceType<typeof EdgeList> | null>(null)
const attributesList = ref<InstanceType<typeof AttributesList> | null>(null)

const isSelected = ref(visStateStore.isSelected(props.node.id))
const filterSelected = ref(false)

type displayModeType = 'incoming' | 'outgoing' | 'attributes'
const displayMode = ref<displayModeType>('attributes')
const searchStr = ref('')

function onCloseModal() {
  emits('modal-close')
}

function onToggleSelection(newSelectionState: boolean) {
  visStateStore.toggleNodeSelection(props.node.id)
  isSelected.value = newSelectionState
}

function handleAttributeSelection(attribute: string) {
  visStateStore.toggleAttributeSelection(props.node.id, attribute)
}

function handleEdgeSelection(edge: StoreEdge) {
  visStateStore.toggleEdgeSelection(edge)
}

// function handleSelectAllToggle() {
//   if (displayMode.value === 'attributes') {
//     attributesList.value?.toggleAll(true)
//   } else if (displayMode.value === 'outgoing') {
//     outEdgeList.value?.toggleAll(true)
//   }
// }

const edgesSort = (a: StoreEdge, b: StoreEdge) => {
  return +b.data.instanceCount.value - +a.data.instanceCount.value
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}
</script>
