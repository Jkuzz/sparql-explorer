import { queryEndpoint } from '@/components/force/sparql'

interface QueryRecord {
  query: string
  callback: (data: any) => void
}

export default class QueryQueue {
  private queue: Array<QueryRecord> = []
  private endpointURL

  public constructor(endpointUrl: URL) {
    this.endpointURL = endpointUrl
  }

  public query(query: string, callback: (data: any) => void) {
    if (this.queue.length > 0) {
      this.queue.push({ query, callback })
    } else {
      this.executeQuery({ query, callback })
    }
  }

  private async executeQuery(queryToExecute: QueryRecord) {
    const result = await queryEndpoint(this.endpointURL, queryToExecute.query)
    queryToExecute.callback(result)

    const next = this.queue.shift()
    if (next) {
      this.executeQuery(next)
    }
  }
}
