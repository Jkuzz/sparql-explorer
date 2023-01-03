import { queryEndpoint } from '@/components/force/sparql'

interface QueryRecord {
  query: string
  callback: (data: any) => void
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
  public query(query: string, callback: (data: unknown) => void) {
    this.queue.push({ query, callback })
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
    const result = await queryEndpoint(this.endpointURL, queryToExecute.query)
    queryToExecute.callback(result)
  }
}
