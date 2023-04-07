import type { JTDDataType } from 'ajv/dist/jtd'

export const importSchema = {
  properties: {
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
