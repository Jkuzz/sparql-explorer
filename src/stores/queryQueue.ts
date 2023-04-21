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

export interface QueryProvider {
  changeEndpoint: (endpoint: URL) => void
  subscribe: (
    events: EmittedEvents[],
    eventCallback: (event: EmittedEvents, count: number) => void
  ) => void
  query: (query: string, callback: (data: any) => void, validator?: z.AnyZodObject) => void
}

export type EmittedEvents = 'Query' | 'Finished' | 'Failed' | 'Reset'

export default class QueryQueue implements QueryProvider {
  private queue: Array<QueryRecord> = []
  private endpointURL: URL | undefined = undefined
  private queriesRunning = false
  /**
   * Index of the url on which the query was initiated.
   * If the endpoint is changed, discard query results from previous endpoints.
   */
  private endpointIndex = 0

  private queryCounts = {
    totalQueries: 0,
    finishedQueries: 0,
    failedQueries: 0,
  }

  private countsToEventsDict: { [key: string]: EmittedEvents } = {
    totalQueries: 'Query',
    finishedQueries: 'Finished',
    failedQueries: 'Failed',
  }

  private resetQueryCounts() {
    let query: keyof typeof this.queryCounts
    for (query in this.queryCounts) {
      this.queryCounts[query] = 0
    }
    this.signalSubscribers('Reset', 0)
  }

  private updateQueryCounts(kind: keyof typeof this.queryCounts, delta: number) {
    this.queryCounts[kind] += delta
    this.signalSubscribers(this.countsToEventsDict[kind], this.queryCounts[kind])
  }

  private signalSubscribers(event: EmittedEvents, count: number) {
    this.subscribers
      .filter((sub) => sub.event === event)
      .forEach((sub) => {
        sub.callback(event, count)
      })
  }

  /**
   * Listeners subscribed to this event publisher.
   * Leaving it as an array, there won't be many of these.
   */
  private subscribers: {
    event: EmittedEvents
    callback: (event: EmittedEvents, count: number) => void
  }[] = []

  /**
   * Subscribe to the queryQueue to be notified of certain events.
   * Supported events deal with changes to the number of running/finished/failed queries
   * @param events Which events to listen to
   * @param eventCallback Will be called when the event occurs
   */
  public subscribe(
    events: EmittedEvents[],
    eventCallback: (event: EmittedEvents, count: number) => void
  ) {
    events.forEach((e) => {
      this.subscribers.push({
        event: e,
        callback: eventCallback,
      })
    })
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
    this.updateQueryCounts('totalQueries', 1)
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
    this.resetQueryCounts()
  }

  private async executeQuery(queryToExecute: QueryRecord) {
    if (!this.endpointURL) return
    let response: any
    try {
      response = await queryEndpoint(this.endpointURL, queryToExecute.query)
    } catch (_e) {
      this.updateQueryCounts('failedQueries', 1)
      return
    }

    // The query ran while the endpoint was changed, discard the response
    if (queryToExecute.endpointIndex != this.endpointIndex) return

    if (queryToExecute.validator) {
      queryToExecute.callback(queryToExecute.validator.parse(response))
    } else {
      queryToExecute.callback(response)
    }
    this.updateQueryCounts('finishedQueries', 1)
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
    id: `[${sourceClass}]-[${edge.property.value}]-[${targetClass}]`,
    source: sourceClass,
    target: targetClass,
    uri: edge.property.value,
    data: edge,
    markerEnd: MarkerType.ArrowClosed,
  } satisfies StoreEdge
}
