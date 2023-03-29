<script setup lang="ts">
import EndpointSelector from '@/components/EndpointSelector.vue'
import ShoppingCart from '@/components/ShoppingCart.vue'
import SidebarControls from '@/components/SidebarControls.vue'
</script>

<template>
  <aside
    :class="[
      'bg-slate-800 border-r border-slate-500 text-gray-200',
      'py-4 px-2 overflow-y-auto overflow-x-clip w-64 xl:w-80',
      'flex flex-col items-center justify-between gap-y-8',
    ]"
  >
    <div class="flex flex-col gap-y-4">
      <EndpointSelector />
      <ShoppingCart />
    </div>
    <SidebarControls />
  </aside>
</template>
