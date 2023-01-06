import type { StoreNode, StoreEdge } from '@/stores/endpoint'
import { MarkerType } from '@vue-flow/core'

let nextId = 0
function getNextId() {
  nextId += 1
  return nextId - 1
}

/**
 * Convert the repsonse to the known type
 * TODO: beter validation: zod?
 * @param node Response object
 * @returns the node converted to a known type
 */
export function makeNodeObject(node: any) {
  return {
    position: { x: getRandomInt(0, 600), y: getRandomInt(0, 400) },
    id: node?.class.value || '' + getNextId(),
    type: 'custom',
    data: node,
  } satisfies StoreNode
}

export function makeEdgeObject(edge: any, sourceClass: string, targetClass: string) {
  return {
    id: `e-[${sourceClass}]-[${edge?.property.value}]-[${targetClass}]`,
    source: sourceClass,
    target: targetClass,
    data: edge,
    markerEnd: MarkerType.ArrowClosed,
  } satisfies StoreEdge
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}
