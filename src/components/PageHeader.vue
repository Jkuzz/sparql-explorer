<script setup lang="ts">
import router from '@/router'
const links = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/about',
    title: 'About',
  },
  {
    to: '/force',
    title: 'Force',
  },
  {
    to: '/flow',
    title: 'Flow',
  },
]
</script>

<template>
  <header>
    <nav
      class="bg-blue-700 text-neutral-300 py-4 px-6 space-x-10 flex flex-row justify-end items-center"
    >
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="transition-all font-semibold hover:text-neutral-50 group"
      >
        {{ link.title }}
        <div
          :class="[link.to == router.currentRoute.value.path ? 'w-full' : 'w-0']"
          class="bg-blue-300 py-[1px] group-hover:w-full transition-all duration-300 ease-out"
        />
      </RouterLink>
    </nav>
  </header>
</template>
