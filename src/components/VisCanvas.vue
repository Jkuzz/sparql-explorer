<script setup lang="ts">
import { useEndpointStore } from '@/stores/endpoint'
import * as d3 from 'd3'
import { onMounted, reactive, watch } from 'vue'
import { useArrayFilter } from '@vueuse/core'
import type { StoreNode } from '@/stores/validators'

const endpointStore = useEndpointStore()
const nodes = reactive<Array<StoreNode>>([])

let svg = d3.select('#visSvg')
let nodeSelect = svg.selectAll('.node')

const simulation = d3
  .forceSimulation()
  .force('charge', d3.forceManyBody().strength(-5))
  .force('collide', d3.forceCollide().radius(35))
  .force('center', d3.forceCenter(0, 0))

/**
 * Hack Pinia modeling by manually updating changes to the store.
 * Changes are mirrored into `nodes`.
 * Only triggers when the number of nodes in the store changed.
 */
let lastNodesLength = 0
watch(endpointStore.nodes, (state) => {
  if (lastNodesLength == state.length) return
  lastNodesLength = state.length
  updateNodes(state)
})

function ticked() {
  svg
    .selectAll('.node')
    .data(nodes)
    .attr('transform', (d) => `translate(${d.position.x}, ${d.position.y})`)
}

function updateNodes(newNodes: Array<StoreNode>) {
  for (let node of newNodes) {
    // Only add nodes with a unique class URI
    if (!nodes.find((n) => n.data.node.class?.value == node.data.node.class?.value)) {
      nodes.push(node)
      console.log('🚀 ~ file: VisCanvas.vue:27 ~ endpointStore.$subscribe ~ node', node)
    }
  }
  useArrayFilter(nodes, (node) =>
    Boolean(
      newNodes.find((newNode) => node.data.node.class?.value == newNode.data.node.class?.value)
    )
  )
  updateForceVis(nodes)
}

onMounted(() => {
  svg = d3.select('#visSvg').attr('transform', 'translate(0, 0)')
  nodeSelect = svg.selectAll('.node')
  simulation.on('tick', ticked)
  svg.call(drag(simulation))
  updateNodes(JSON.parse(JSON.stringify(endpointStore.nodes)))
})

/**
 * Update the force visualisation modeled data
 * @param visData data to base the nodes off
 */
function updateForceVis(visData: Array<StoreNode>) {
  let classesData = [...visData]

  // Make a shallow copy to protect against mutation, while
  // recycling old nodes to preserve position and velocity.
  // const oldNodes = new Map(nodeSelect.data().map((d: any) => [d.id, d]))
  // classesData = classesData.map((d: any) => Object.assign(oldNodes.get(d.id) || {}, d))

  nodeSelect = nodeSelect.data(classesData as any[]).join((enter) => {
    const nodeContainer = enter
      .append('g')
      .classed('node', true)
      .attr('transform', `translate(0, 0)`)
    nodeContainer.append('circle').attr('r', 30).attr('stroke', 'white').attr('fill', 'transparent')
    nodeContainer
      .append('text')
      .text((d) => getLabelFromURI(d.data.node.class.value))
      .attr('text-anchor', 'middle')
      .attr('stroke', 'white')
      .classed('select-none', true)
    nodeContainer.call(drag(simulation))
    return nodeContainer
  })

  const simulationNodes = classesData.map((n) => n.position)
  simulation.nodes(simulationNodes)
  simulation.alpha(1).restart().tick()
  ticked() // render now!
}

let draggingBackground = false // To prevent stuttering

function drag(simulation: any) {
  function dragstarted(event: any) {
    draggingBackground = 'id' in event.sourceEvent.target && event.sourceEvent.target.id == 'visSvg'
    if (!event.subject || !event.subject.position) return
    if (!event.active) simulation.alphaTarget(0.3).restart()
    event.sourceEvent.stopPropagation()
    event.subject.position.fx = event.subject.position.x
    event.subject.position.fy = event.subject.position.y
  }

  function dragged(event: any) {
    event.sourceEvent.stopPropagation()
    if (draggingBackground) {
      const newTransform = moveTransformString(svg.attr('transform'), event.dx, event.dy)
      svg.attr('transform', newTransform)
    } else {
      event.subject.position.fx = event.x
      event.subject.position.fy = event.y
    }
  }

  function dragended(event: any) {
    if (!event.subject || !event.subject.position) return
    if (!event.active) simulation.alphaTarget(0)
    event.subject.position.fx = null
    event.subject.position.fy = null
  }

  return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
}

function getLabelFromURI(uri: string) {
  if (!uri) return ''
  const slashLast = uri.split('/').slice(-1)[0] // get last element inplace
  const hashLast = uri.split('#').slice(-1)[0]
  return slashLast.length < hashLast.length ? slashLast : hashLast
}

function moveTransformString(transform: string, dx: number, dy: string) {
  const translatePos = transform.indexOf('translate(') + 10
  const translateEnd = transform.indexOf(')', translatePos) // bind position to match correct ()
  const original = transform.substring(translatePos, translateEnd).split(',')
  const newTransform = transform.replace(
    transform.substring(translatePos - 10, translateEnd + 1),
    `translate(${+original[0] + dx}, ${+original[1] + dy})`
  )
  return newTransform
}
</script>

<template>
  <div
    class="bg-slate-800 p-2"
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
