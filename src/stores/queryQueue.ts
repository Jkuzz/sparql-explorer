import { queryEndpoint } from '@/components/force/sparql'
import type { StoreNode, StoreEdge } from '@/stores/validators'
import { MarkerType } from '@vue-flow/core'
import type { z } from 'zod'

interface QueryRecord {
  query: string
  callback: (data: any) => void
  validator?: z.AnyZodObject
}

export default class QueryQueue {
  private queue: Array<QueryRecord> = []
  private endpointURL
  private queriesRunning = false

  public constructor(endpointUrl: URL) {
    this.endpointURL = endpointUrl
  }

  /**
   * Performs the query and calls the provided callback function with the
   * query return data. If there are already queries being executed,
   * adds this one to the queue instead.
   * @param query SPARQL query to perform
   * @param callback to be called with the query data on completion
   */
  public query(query: string, callback: (data: any) => void, validator?: z.AnyZodObject) {
    this.queue.push({ query, callback, validator })
    this.lockedQueryLoop()
  }

  private async lockedQueryLoop() {
    if (this.queriesRunning) return

    this.queriesRunning = true
    let next = this.queue.shift()
    while (next) {
      this.executeQuery(next)
      next = this.queue.shift()
    }
    this.queriesRunning = false
  }

  /**
   * Wipe the query queue and set the new endpoint
   * TODO: might have to handle the current query if there is one
   * @param endpointUrl new endpoint url
   */
  public changeEndpoint(endpointUrl: URL) {
    this.queue.splice(0, this.queue.length)
    this.endpointURL = endpointUrl
  }

  private async executeQuery(queryToExecute: QueryRecord) {
    const response = await queryEndpoint(this.endpointURL, queryToExecute.query)
    console.log('🚀 ~ file: queryQueue.ts:57 ~ QueryQueue ~ executeQuery ~ response', response)
    if (queryToExecute.validator) {
      queryToExecute.callback(queryToExecute.validator.parse(response))
    } else {
      queryToExecute.callback(response)
    }
  }
}

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
