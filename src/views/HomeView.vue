<script setup lang="ts">
const descriptionPoints = [
  {
    emoji: '🔎',
    text: "Explore SPARQL endpoints' schemata",
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
    emoji: '📦',
    text: 'Export the generated schema into various formats.',
  },
  {
    emoji: '✨',
    text: 'Enjoy type-safe access to SPARQL endpoints.',
  },
]
</script>

<template>
  <main class="text-gray-200 flex flex-col items-stretch overflow-x-clip">
    <div class="bg-slate-900 flex flex-col items-center pt-20 pb-40 gap-y-20">
      <h1 class="text-8xl font-novem tracking-widest flex flex-wrap justify-center">
        <span> Type </span>
        <span> SPARQ✨ </span>
      </h1>
      <h2 class="text-4xl font-squared max-w-md text-center">
        Your type safe gateway to SPARQL endpoints
      </h2>
    </div>
    <div class="flex flex-col items-center bg-slate-800">
      <ol class="p-4 bg-slate-700 text-xl rounded-md font-squared max-w-xl relative -top-20">
        <li
          v-for="(point, i) in descriptionPoints"
          :key="i"
          class="flex flex-row gap-x-2 p-1 font-xl"
        >
          <span class="w-8 text-center">{{ point.emoji }}</span>
          <span>{{ point.text }}</span>
        </li>
      </ol>
    </div>
    <div class="flex flex-col items-center bg-slate-800 gap-y-10 pb-20">
      <div class="p-4 bg-slate-700 rounded-md max-w-xl">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </div>
  </main>
</template>
