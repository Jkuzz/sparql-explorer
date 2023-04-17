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
    <div class="flex flex-col items-center bg-slate-800 pb-32">
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
      <div
        class="p-4 bg-slate-700 rounded-md max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl space-y-4"
      >
        <p>
          TypeSPARQ is a dynamic and user-friendly service that simplifies the process of exploring
          and extracting data from SPARQL endpoints. With TypeSPARQ, you can easily navigate and
          understand the schema of a SPARQL endpoint, thanks to its graphical interface that
          provides a visual representation of the endpoint's schema.
        </p>

        <p>
          TypeSPARQ integrates with
          <a
            class="text-blue-400 font-semibold"
            href="https://ldkit.io/"
            >LDKit</a
          >
          to provide type-safe access to SPARQL endpoints, enabling you to quickly and easily query
          RDF data without worrying about manual parsing of SPARQL responses. TypeSPARQ makes it
          easy to integrate SPARQL schema exploration and extraction into your TypeScript codebase.
          Try TypeSPARQ today and see how it can take your TypeScript development to the next level!
        </p>
      </div>
    </div>
  </main>
</template>
