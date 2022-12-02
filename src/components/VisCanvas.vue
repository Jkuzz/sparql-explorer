<script setup lang="ts">
import { useEndpointStore } from '@/stores/endpoint'
import * as d3 from 'd3'
import { onMounted, ref, type Ref } from 'vue'

const endpointStore = useEndpointStore()
const nodes: Ref<Array<any>> = ref([])

endpointStore.$subscribe((mutation, state) => {
  nodes.value = JSON.parse(JSON.stringify(state.nodes))
  console.log(JSON.parse(JSON.stringify(state.nodes)))
})

onMounted(() => {
  const svg = d3.select('#visSvg')
  d3.forceSimulation(nodes.value)
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(0, 0))
    .on('tick', ticked)

  function ticked() {
    svg
      .selectAll('.node')
      .data(nodes.value)
      .attr('cx', function (d) {
        return d.x
      })
      .attr('cy', function (d) {
        return d.y
      })
  }
})
</script>

<template>
  <div
    class="bg-slate-900 p-2"
    id="canvas"
  >
    <svg
      id="visSvg"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="-500 -500 1000 1000"
    >
      <circle
        v-for="(node, i) in nodes"
        :key="i"
        class="node"
        r="20"
      >
        <text>{{ node.id }}</text>
      </circle>
    </svg>
  </div>
</template>
