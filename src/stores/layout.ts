import { useEndpointStore } from '@/stores/endpoint'
import { getRandomInt } from '@/stores/random'
import * as d3 from 'd3'

const endpointStore = useEndpointStore()
const CENTER = {
  x: 400,
  y: 300,
}

/**
 * Dictionary holds the layout types and their creation handlers
 */
const layoutTypes = {
  random: randomLayout,
  force: forceLayout,
}

type edgeT = {
  source: string
  target: string
}

/**
 * Layout the nodes present in the endpointStore. Mutates the store.
 * @param layout Type of layout to use, lists all available as types
 */
export function layoutNodes(layout: keyof typeof layoutTypes = 'random') {
  layoutTypes[layout]()
}

/**
 * Random positions :)
 */
function randomLayout() {
  endpointStore.nodes.forEach((n) => {
    n.position.x = getRandomInt(0, CENTER.x * 2)
    n.position.y = getRandomInt(0, CENTER.y * 2)
  })
}

/**
 * Uses d3 force layout. Performs a simulation and assigns the finished
 * simulated positions to the store's nodes.
 */
function forceLayout() {
  const nodes = endpointStore.nodes.map((node) => {
    return {
      id: node.id,
      x: getRandomInt(0, 100),
      y: getRandomInt(0, 100),
    }
  })
  console.log('🚀 ~ file: layout.ts:49 ~ nodes ~ nodes:', nodes)

  const edges = endpointStore.edges
    .map((edge) => {
      if (edge.source !== edge.target)
        return {
          source: edge.source,
          target: edge.target,
        }
    })
    .filter((edge): edge is edgeT => !edge) // Filter out undefineds

  const simulation = d3
    .forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(CENTER.x, CENTER.y))
    .force('links', d3.forceLink(edges).strength(10000))
    .force('collide', d3.forceCollide().radius(25)) // Reduce overlap
    .force(
      'gravity',
      d3.forceY(CENTER.y * 4).strength((node: any) => {
        // overriding the type here because we have the id field(defined above in `nodes`)
        const edgeCount = clamp(countNodeEdges(node.id), -20, 20)
        const nodeEdgeDelta = invlerp(-20, 20, edgeCount)
        // console.log(`${edgeCount}\t${nodeEdgeDelta}\t${node.id}`)
        return nodeEdgeDelta
      })
    )

  // Run the simulation until it freezes
  while (simulation.alpha() > simulation.alphaMin()) {
    simulation.tick()
  }

  endpointStore.nodes.forEach((node) => {
    const nextNode = nodes.pop()
    // If there's one that didn't get one generated, give it a default one
    // The node was probably created after the simulation was started
    node.position = nextNode ? { x: nextNode.x, y: nextNode.y } : { x: 0, y: 0 }
  })
}

function countNodeEdges(nodeId: string) {
  return endpointStore.renderEdges.reduce((accumulator, currentValue) => {
    let delta = 0
    if (currentValue.target === nodeId) delta -= 1
    if (currentValue.source === nodeId) delta += 1
    return accumulator + delta
  }, 0)
}

const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a))
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x))
