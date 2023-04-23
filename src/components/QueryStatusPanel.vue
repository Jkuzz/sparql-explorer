<script setup lang="ts">
import TooltipGeneric from '@/components/TooltipGeneric.vue'
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
    class="bg-slate-700 p-2 w-[60%] rounded-md mx-auto flex flex-col items-center group relative"
  >
    <TooltipGeneric>Number of pending queries</TooltipGeneric>
    <div>
      <div class="flex flex-row">
        <div
          class="select-none"
          :class="{ 'animate-bounce': totalQueries > finishedQueries + failedQueries }"
        >
          ✨
        </div>
        <span>Pending: {{ totalQueries - (finishedQueries + failedQueries) }} </span>
      </div>
      <div class="flex flex-row">
        <div class="select-none">✔</div>
        <span>Finished: {{ finishedQueries }}</span>
      </div>
      <div class="flex flex-row">
        <div class="select-none">❌</div>
        <span>Failed: {{ failedQueries }}</span>
      </div>
    </div>
  </div>
</template>
