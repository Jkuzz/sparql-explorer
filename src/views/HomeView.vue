<script setup lang="ts">
const descriptionPoints = [
  {
    emoji: '🔎',
    text: 'Explore a SPARQL endpoint schema',
  },
  {
    emoji: '💡',
    text: 'Generate endpoint schema type definitions',
  },
  {
    emoji: '💻',
    text: 'Generate LDKit quickstart code',
  },
  {
    emoji: '✨',
    text: 'Start querying',
  },
]
</script>

<template>
  <main class="bg-slate-800 text-gray-200 p-8 flex flex-col items-center space-y-20">
    <h1 class="text-8xl mt-20 font-novem">Type-SPARQ✨</h1>
    <h2 class="text-4xl font-squared max-w-md text-center">
      Your type safe gateway to SPARQL endpoints
    </h2>
    <ol class="p-4 bg-slate-700 text-xl rounded-lg font-squared max-w-xl">
      <li
        v-for="(point, i) in descriptionPoints"
        :key="i"
        class="flex flex-row gap-x-2 p-1 font-xl"
      >
        <span class="w-8 text-center">{{ point.emoji }}</span>
        <span>{{ point.text }}</span>
      </li>
    </ol>
  </main>
</template>
