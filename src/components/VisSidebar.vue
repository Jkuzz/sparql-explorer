<script setup lang="ts">
import EndpointSelector from '@/components/EndpointSelector.vue'
import ShoppingCart from '@/components/ShoppingCart.vue'
import SidebarControls from '@/components/SidebarControls.vue'
import QueryStatusPanel from '@/components/QueryStatusPanel.vue'
import { useEndpointStore } from '@/stores/endpoint'

const endpointStore = useEndpointStore()
</script>

<template>
  <aside
    :class="[
      'bg-slate-800 border-r border-slate-500 text-gray-200',
      'py-4 px-2 overflow-clip w-80',
      'flex flex-col items-center justify-between gap-y-6',
    ]"
  >
    <div class="flex flex-col overflow-y-auto gap-y-4">
      <EndpointSelector />
      <QueryStatusPanel :queryQueue="endpointStore.queryQueue" />
      <ShoppingCart />
    </div>
    <SidebarControls />
  </aside>
</template>
