import { queryEndpoint } from '@/stores/sparql'
import type { StoreNode, StoreEdge, EdgeBinding } from '@/stores/validators'
import { MarkerType } from '@vue-flow/core'
import type { z } from 'zod'
import { getRandomInt } from '@/stores/random'

interface QueryRecord {
  query: string
  callback: (data: any) => void
  validator?: z.AnyZodObject
  endpointIndex: number
}

export default class QueryQueue {
  private queue: Array<QueryRecord> = []
  private endpointURL
  private queriesRunning = false
  /**
   * Index of the url on which the query was initiated.
   * If the endpoint is changed, discard query results from previous endpoints.
   */
  private endpointIndex = 0

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
    this.queue.push({ query, callback, validator, endpointIndex: this.endpointIndex })
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
   * @param endpointUrl new endpoint url
   */
  public changeEndpoint(endpointUrl: URL) {
    this.queue.splice(0, this.queue.length)
    this.endpointIndex += 1
    this.endpointURL = endpointUrl
  }

  private async executeQuery(queryToExecute: QueryRecord) {
    const response = await queryEndpoint(this.endpointURL, queryToExecute.query)

    // The query ran while the endpoint was changed, discard the response
    if (queryToExecute.endpointIndex != this.endpointIndex) return

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
    position: { x: getRandomInt(0, 600), y: getRandomInt(0, 400), vx: 0, vy: 0 },
    id: node?.class.value || '' + getNextId(),
    type: 'custom',
    data: { node, labels: [], attributes: [] },
  } satisfies StoreNode
}

export function makeEdgeObject(
  edge: z.infer<typeof EdgeBinding>,
  sourceClass: string,
  targetClass: string
) {
  return {
    id: `e-[${sourceClass}]-[${edge.property.value}]-[${targetClass}]`,
    source: sourceClass,
    target: targetClass,
    uri: edge.property.value,
    data: edge,
    markerEnd: MarkerType.ArrowClosed,
  } satisfies StoreEdge
}
