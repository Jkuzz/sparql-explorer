<script setup lang="ts">
import type { EmittedEvents, QueryProvider } from '@/stores/queryQueue'
import { ref } from 'vue'

const props = defineProps<{
  queryQueue: QueryProvider
}>()

props.queryQueue.subscribe(['Failed', 'Finished', 'Query', 'Reset'], queryEventCallback)

const finishedQueries = ref(0)
const totalQueries = ref(0)
const failedQueries = ref(0)

function queryEventCallback(type: EmittedEvents, count: number) {
  switch (type) {
    case 'Query': {
      totalQueries.value = count
      break
    }
    case 'Finished': {
      finishedQueries.value = count
      break
    }
    case 'Failed': {
      failedQueries.value = count
      break
    }
    case 'Reset': {
      totalQueries.value = 0
      failedQueries.value = 0
      finishedQueries.value = 0
      break
    }
  }
}
</script>

<template>
  <div
    class="bg-slate-600 p-2 w-[60%] rounded-md mx-auto flex flex-col items-center group relative"
  >
    <span
      class="group-hover:opacity-100 transition-opacity bg-gray-600 text-sm text-gray-100 rounded-md absolute opacity-0 p-1 -top-8 left-0 z-50 w-max max-w-xs"
    >
      Number of pending queries
    </span>
    <div>
      <div class="flex flex-row">
        <div
          class="select-none"
          :class="{ 'animate-bounce': totalQueries > finishedQueries + failedQueries }"
        >
          ✨
        </div>
        <span> Pending: {{ totalQueries - (finishedQueries + failedQueries) }} </span>
      </div>
      <div class="flex flex-row select-none">
        <div>✔</div>
        <span>Finished: {{ finishedQueries }}</span>
      </div>
      <div class="flex flex-row select-none">
        <div>❌</div>
        <span>Failed: {{ failedQueries }}</span>
      </div>
    </div>
  </div>
</template>
