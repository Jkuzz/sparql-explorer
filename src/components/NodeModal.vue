<template>
  <div
    class="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex items-center justify-center"
    @click.self="onCloseModal"
    v-if="node"
  >
    <div :class="['bg-blue-100 rounded-xl shadow-lg', 'p-6 m-12 w-[90%] overflow-clip']">
      <header>
        <h2 class="text-lg font-bold text-center">{{ node.id }}</h2>
        <div class="cursor-pointer hover:underline text-center mb-2">
          {{ `<${node.id}>` }}
        </div>
      </header>

      <main class="overflow-y-auto">
        <div class="flex justify-between">
          <ButtonGeneric @click="displayMode = 'outgoing'">Outgoing edges</ButtonGeneric>
          <ButtonGeneric @click="displayMode = 'incoming'">Incoming edges</ButtonGeneric>
          <ButtonGeneric @click="displayMode = 'attributes'">Attributes edges</ButtonGeneric>
        </div>
        <AttributesList
          v-if="displayMode === 'attributes'"
          :attributes="node.data.attributes"
          :instance-count="+(node.data.node.instanceCount.value || 0)"
        />
        <EdgeList
          v-if="displayMode === 'outgoing'"
          :edges="endpointStore.getNodeFromEdges(node.id).sort(edgesSort)"
          type="from"
          :instance-count="+(node.data.node.instanceCount.value || 0)"
        />
        <EdgeList
          v-if="displayMode === 'incoming'"
          :edges="endpointStore.getNodeToEdges(node.id).sort(edgesSort)"
          type="to"
          :instance-count="+(node.data.node.instanceCount.value || 0)"
        />
      </main>

      <footer class="pt-4 flex justify-end">Footer</footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import AttributesList from '@/components/AttributesList.vue'
import ButtonGeneric from '@/components/ButtonGeneric.vue'
import EdgeList from '@/components/EdgeList.vue'
import { ref } from 'vue'
import type { StoreNode, StoreEdge } from '@/stores/validators'
import { useEndpointStore } from '@/stores/endpoint'

const emits = defineEmits(['modal-close'])
defineProps<{
  node?: StoreNode
}>()
const endpointStore = useEndpointStore()

type displayModeType = '' | 'incoming' | 'outgoing' | 'attributes'
const displayMode = ref<displayModeType>('')

function onCloseModal() {
  emits('modal-close')
}

const edgesSort = (a: StoreEdge, b: StoreEdge) => {
  return +a.data.instanceCount.value - +b.data.instanceCount.value
}
// function handleUriClick() {
//   if (props.node?.id) {
//     navigator.clipboard.writeText(props.node?.id)
//   }
// }
</script>
