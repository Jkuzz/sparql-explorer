<template>
  <div
    class="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex items-center justify-center"
    @click.self="onCloseModal"
    v-if="node"
  >
    <div :class="['bg-blue-100 rounded-xl shadow-lg', 'p-6 m-12 max-h-screen overflow-clip']">
      <header>
        <h2 class="text-lg font-bold text-center">{{ node.id }}</h2>
      </header>

      <main class="overflow-y-auto">
        <div class="cursor-pointer hover:underline text-center mb-2">
          {{ `<${node.id}>` }}
        </div>
        <!-- <AttributesList
          :attributes="node.data.attributes"
          :instance-count="+(node.data.node.instanceCount.value || 0)"
        /> -->
        <EdgeList
          :edges="endpointStore.getNodeFromEdges(node.id)"
          type="from"
          :instance-count="+(node.data.node.instanceCount.value || 0)"
        />
        <EdgeList
          :edges="endpointStore.getNodeToEdges(node.id)"
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
import EdgeList from '@/components/EdgeList.vue'
import type { StoreNode } from '@/stores/validators'
import { useEndpointStore } from '@/stores/endpoint'

const emits = defineEmits(['modal-close'])
const props = defineProps<{
  node?: StoreNode
}>()
const endpointStore = useEndpointStore()

function onCloseModal() {
  emits('modal-close')
}

// function handleUriClick() {
//   if (props.node?.id) {
//     navigator.clipboard.writeText(props.node?.id)
//   }
// }
</script>
