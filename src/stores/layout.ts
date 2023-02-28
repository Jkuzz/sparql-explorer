import { useEndpointStore } from '@/stores/endpoint'
import { getRandomInt } from '@/stores/random'

const endpointStore = useEndpointStore()

const layoutTypes = {
  random: randomLayout,
  force: forceLayout,
}

export function layoutNodes(layout: keyof typeof layoutTypes = 'random') {
  layoutTypes[layout]()
}

function randomLayout() {
  endpointStore.nodes.forEach((n) => {
    n.position.x = getRandomInt(0, 800)
    n.position.y = getRandomInt(0, 600)
  })
}

function forceLayout() {
  endpointStore.nodes.forEach((n) => (n.position.x = 0))
}
