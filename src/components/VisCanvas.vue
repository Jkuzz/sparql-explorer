<script setup lang="ts">
import { useEndpointStore } from '@/stores/endpoint'
import * as d3 from 'd3'
import { onMounted, ref, type Ref } from 'vue'

const endpointStore = useEndpointStore()
// const nodes = endpointStore.nodes
const nodes: Ref<Array<any>> = ref([])

const simulation = d3
  .forceSimulation()
  .force('charge', d3.forceManyBody().strength(-10))
  .force('collide', d3.forceCollide().radius(20))
  .force('center', d3.forceCenter(0, 0))

/**
 * Hack Pinia modeling by manually updating changes to the store.
 * Changes are mirrored into `nodes`
 * currently only additions are handled
 */
endpointStore.$subscribe((mutation, state) => {
  // Copy the state stored nodes
  const newState = JSON.parse(JSON.stringify(state.nodes))
  for (let node of newState) {
    if (!nodes.value.find((n) => n.id === node.id)) {
      nodes.value.push(node)
      console.log('🚀 ~ file: VisCanvas.vue:27 ~ endpointStore.$subscribe ~ node', node)
    }
  }
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

/**
 * Update the force visualisation modeled data
 * @param visData data to base the nodes off
 */
function updateForceVis(visData: any) {
  let classesData = [...visData]

  // Make a shallow copy to protect against mutation, while
  // recycling old nodes to preserve position and velocity.
  // const oldNodes = new Map(nodeSelect.data().map((d: any) => [d.id, d]))
  // classesData = classesData.map((d: any) => Object.assign(oldNodes.get(d.id) || {}, d))

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
    ></svg>
  </div>
</template>
