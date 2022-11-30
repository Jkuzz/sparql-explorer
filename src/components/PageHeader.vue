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
]
</script>

<template>
  <header>
    <nav class="bg-fuchsia-800 text-gray-200 space-x-6 p-3">
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
