<script setup lang="ts">
import { useEndpointStore } from '@/stores/endpoint'
import * as d3 from 'd3'
import { onMounted, ref, type Ref } from 'vue'

const endpointStore = useEndpointStore()
// const nodes = endpointStore.nodes
const nodes: Ref<Array<any>> = ref([])

const simulation = d3
  .forceSimulation()
  .force('charge', d3.forceManyBody().strength(-50))
  .force('collide', d3.forceCollide().radius(20))
  .force('center', d3.forceCenter(0, 0))

endpointStore.$subscribe((mutation, state) => {
  // nodes.value = JSON.parse(JSON.stringify(state.nodes))
  // nodes.value.push({ index: nodes.value.length })
  nodes.value.push({ id: nodes.value.length })
  updateForceVis(nodes.value)
})

let svg = d3.select('#visSvg')
let nodeSelect = svg.selectAll('.node')

function ticked() {
  svg
    .selectAll('.node')
    .data(nodes.value)
    .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
}

onMounted(() => {
  svg = d3.select('#visSvg')
  nodeSelect = svg.selectAll('.node')
  simulation.on('tick', ticked)
  updateForceVis(nodes.value)
})

function updateForceVis(visData: any) {
  // let classesData = 'classes' in visData ? Object.values(visData.classes) : []
  let classesData = JSON.parse(JSON.stringify(visData))
  console.log('🚀 ~ file: VisCanvas.vue:43 ~ updateForceVis ~ visData', classesData)

  // Make a shallow copy to protect against mutation, while
  // recycling old nodes to preserve position and velocity.
  const oldNodes = new Map(nodeSelect.data().map((d: any) => [d.id, d]))
  console.log('🚀 ~ file: VisCanvas.vue:48 ~ updateForceVis ~ oldNodes', oldNodes)
  classesData = classesData.map((d: any) => Object.assign(oldNodes.get(d.id) || {}, d))
  console.log(classesData)

  nodeSelect = nodeSelect.data(classesData).join((enter) => {
    const nodeContainer = enter
      .append('g')
      .classed('node', true)
      .attr('transform', `translate(0, 0)`)
    nodeContainer.append('circle').attr('r', 20)
    return nodeContainer
  })

  const simulationNodes = [...classesData]
  simulation.nodes(simulationNodes)
  simulation.alpha(1).restart().tick()
  ticked() // render now!
}
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
      <!-- <g
        class="node"
        v-for="(node, i) in nodes"
        :key="i"
      >
        <circle
          r="20"
        ></circle>
      </g> -->
    </svg>
  </div>
</template>
