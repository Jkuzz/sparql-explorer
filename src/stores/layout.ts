import { useEndpointStore } from '@/stores/endpoint'

const endpointStore = useEndpointStore()

const layoutTypes = {
  random: randomLayout,
  force: forceLayout,
}

export function layoutNodes(layout: keyof typeof layoutTypes = 'random') {
  layoutTypes[layout]()
}

function randomLayout() {
  endpointStore.nodes.forEach((n) => (n.position.x = 0))
}

function forceLayout() {
  endpointStore.nodes.forEach((n) => (n.position.x = 0))
}
