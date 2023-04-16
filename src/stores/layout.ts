import { useEndpointStore } from '@/stores/endpoint'
import { getRandomInt } from '@/stores/random'
import * as d3 from 'd3'
import { keysIn, shuffle } from 'lodash'

const endpointStore = useEndpointStore()
const CENTER = {
  x: 400,
  y: 300,
}

/**
 * Dictionary holds the layout types and their creation handlers
 * The key is used as a button label in the flow view.
 */
export const layoutTypes = {
  Random: randomLayout,
  Force: forceLayout,
  Grid: gridLayout,
} as const

export const availableLayouts = Object.keys(layoutTypes) as (keyof typeof layoutTypes)[]

type edgeT = {
  source: string
  target: string
}

/**
 * Layout the nodes present in the endpointStore. Mutates the store.
 * @param layout Type of layout to use, lists all available as types
 */
export function layoutNodes(layout: keyof typeof layoutTypes = 'Random') {
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
 * Layout the nodes in a square-ish grid
 */
function gridLayout() {
  const numNodes = endpointStore.nodes.length
  // Last row will be intentionally non-empty
  const rowSize = Math.ceil(Math.sqrt(numNodes))

  let row = 0
  let col = 0

  shuffle(endpointStore.nodes).forEach((n) => {
    n.position.x = col * 300
    // Offset every even by a bit vertically to maintain legibility
    n.position.y = row * 200 + +(col % 2 == 0) * 40

    col += 1
    if (col >= rowSize) {
      col = 0
      row += 1
    }
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
    .force('charge', d3.forceManyBody().strength(-2000))
    .force('x', d3.forceX(CENTER.x).strength(0.05))
    .force('y', d3.forceY(0).strength(0.05))
    .force('links', d3.forceLink(edges).strength(100))
    .force('collide', d3.forceCollide().radius(30)) // Reduce overlap
    .force(
      'gravity',
      d3.forceY(CENTER.y * 2).strength((node: any) => {
        // overriding the type here because we have the id field(defined above in `nodes`)
        const edgeCount = clamp(countNodeEdges(node.id), -10, 10)
        const nodeEdgeDelta = invlerp(-10, 10, edgeCount) / 5
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
