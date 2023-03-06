<template>
  <div
    class="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex items-center justify-center"
    @click.self="onCloseModal"
    v-if="node"
  >
    <div
      :class="[
        'bg-blue-100 rounded-xl shadow-lg',
        'p-6 m-12 w-[90%] min-h-[60%] max-h-[90%] flex flex-col',
      ]"
    >
      <header>
        <h2 class="text-lg font-bold text-center">{{ node.id }}</h2>
        <div class="cursor-pointer hover:underline text-center mb-2">
          {{ `<${node.id}>` }}
        </div>
        <div class="flex flex-row justify-center items-center relative">
          <ButtonGeneric @click="displayMode = 'attributes'">Attributes</ButtonGeneric>
          <ButtonGeneric @click="displayMode = 'outgoing'">Outgoing edges</ButtonGeneric>
          <ButtonGeneric @click="displayMode = 'incoming'">Incoming edges</ButtonGeneric>
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
      </header>

      <main class="flex-grow">
        <AttributesList
          v-if="displayMode === 'attributes'"
          :attributes="node.data.attributes"
          :instance-count="+node.data.node.instanceCount.value"
          @change="handleAttributeSelection"
          :node-selected="isSelected"
          :selected-attributes="visStateStore.selectedAttributes[node.id]"
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
          ref="outEdgeList"
        />
        <EdgeList
          v-if="displayMode === 'incoming'"
          :edges="endpointStore.getNodeToEdges(node.id).sort(edgesSort)"
          type="to"
          :instance-count="+node.data.node.instanceCount.value"
          :node-selected="isSelected"
          :filter-selected="filterSelected"
        />
      </main>

      <footer class="pt-4 flex justify-center relative">
        <div class="flex flex-row items-center bg-slate-800 p-2 rounded-md">
          <span class="text-white">Selected</span>
          <SliderSwitch
            :isDefaultEnabled="isSelected"
            @update:checkbox="onToggleSelection"
            value="selected"
          />
        </div>
        <div
          class="flex flex-row items-center bg-slate-800 p-2 rounded-md absolute right-0"
          v-if="['incoming', 'outgoing'].includes(displayMode)"
        >
          <span class="text-white">Only selected</span>
          <SliderSwitch
            :isDefaultEnabled="false"
            @update:checkbox="filterSelected = !filterSelected"
            value="filterSelected"
          />
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import AttributesList from '@/components/AttributesList.vue'
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import EdgeList from '@/components/EdgeList.vue'
import SliderSwitch from './SliderSwitch.vue'
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

function handleSelectAllToggle() {
  if (displayMode.value === 'attributes') {
    attributesList.value?.toggleAll(true)
  } else if (displayMode.value === 'outgoing') {
    outEdgeList.value?.toggleAll(true)
  }
}

const edgesSort = (a: StoreEdge, b: StoreEdge) => {
  return +b.data.instanceCount.value - +a.data.instanceCount.value
}
</script>
