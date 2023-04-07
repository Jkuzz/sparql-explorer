import Ajv from 'ajv/dist/jtd'

const ajv = new Ajv()

const schema = {
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

const parse = ajv.compileParser(schema)

export function parseInput(inputText: string) {
  const res = parse(inputText)
  console.log('🚀 ~ file: importParser.ts:25 ~ parseInput ~ res:', res)
  if (!res) {
    throw new Error(`${parse.message} at position ${parse.position}`)
  }
}
