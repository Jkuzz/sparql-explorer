<template>
  <div
    class="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex items-center justify-center"
    @click.self="onCloseModal"
  >
    <div :class="['bg-blue-100 rounded-xl shadow-lg', 'p-6 m-12 max-h-screen overflow-clip']">
      <header>
        <h2 class="text-lg font-bold text-center">{{ node?.id }}</h2>
      </header>

      <main class="overflow-y-auto">
        <div class="cursor-pointer hover:underline text-center mb-2">
          {{ `<${node?.id}>` }}
        </div>
        <AttributesList
          :attributes="node?.data.attributes || []"
          :instance-count="+(node?.data.node.instanceCount.value || 0)"
        />
      </main>

      <footer class="pt-4 flex justify-end">Footer</footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import AttributesList from '@/components/AttributesList.vue'
// import { ref } from 'vue'
import type { StoreNode } from '@/stores/validators'

const emits = defineEmits(['modal-close'])
const props = defineProps<{
  node?: StoreNode
}>()

function onCloseModal() {
  emits('modal-close')
}

function handleUriClick() {
  if (props.node?.id) {
    navigator.clipboard.writeText(props.node?.id)
  }
}
</script>
