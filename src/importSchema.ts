import type { JTDDataType, JTDSchemaType } from 'ajv/dist/jtd'

export interface SchemaType {
  endpoint: string
  nodes: {
    id: string
    instanceCount: number
    attributes?: {
      id: string
      type: string
      instanceCount: number
    }[]
  }[]
  edges: {
    source: string
    target: string
    id: string
    instanceCount: number
  }[]
}

export const importSchema: JTDSchemaType<SchemaType> = {
  properties: {
    endpoint: { type: 'string' },
    nodes: {
      elements: {
        properties: {
          id: { type: 'string' },
          instanceCount: { type: 'uint32' },
        },
        optionalProperties: {
          attributes: {
            elements: {
              properties: {
                id: { type: 'string' },
                type: { type: 'string' },
                instanceCount: { type: 'uint32' },
              },
            },
          },
        },
      },
    },
    edges: {
      elements: {
        properties: {
          source: { type: 'string' },
          target: { type: 'string' },
          id: { type: 'string' },
          instanceCount: { type: 'uint32' },
        },
      },
    },
  },
}

export type ImportSchema = JTDDataType<typeof importSchema>
