<script setup lang="ts">
import EndpointSelector from '@/components/EndpointSelector.vue'
import ShoppingCart from '@/components/ShoppingCart.vue'

</script>

<template>
  <aside
    :class="[
      'bg-neutral-800 border-r border-neutral-500 text-gray-200',
      'py-4 px-2 overflow-y-auto overflow-x-clip w-64 xl:w-80',
      'flex flex-col items-center gap-y-8',
    ]"
  >
    <EndpointSelector />
    <ShoppingCart />
  </aside>
</template>
