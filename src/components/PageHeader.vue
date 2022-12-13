<script setup lang="ts">
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
    to: '/vis',
    title: 'Visualisation',
  },
  {
    to: '/flow',
    title: 'Flow',
  },
]
</script>

<template>
  <header>
    <nav class="bg-blue-900 text-gray-200 p-3 space-x-10 flex flex-row justify-end">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="transition-all hover:font-bold"
      >
        {{ link.title }}
      </RouterLink>
    </nav>
  </header>
</template>
