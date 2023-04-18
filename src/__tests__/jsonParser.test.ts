import { describe, expect, it } from 'vitest'
import { parseInput } from '@/importParser'

const correctInput = `{
  "endpoint": "https://dbpedia.org/sparql",
  "nodes": [
    {
      "id": "http://www.w3.org/2002/07/owl#Thing",
      "instanceCount": 1234
    },
    {
      "id": "http://dbpedia.org/ontology/Person",
      "instanceCount": 4321,
      "attributes": [
        {
          "id": "http://www.w3.org/2000/01/rdf-schema#label",
          "type": "http://www.w3.org/2001/XMLSchema#string",
          "instanceCount": 321
        }
      ]
    }
  ],
  "edges": [
    {
      "source": "http://dbpedia.org/ontology/Person",
      "target": "http://www.w3.org/2002/07/owl#Thing",
      "id": "http://dbpedia.org/ontology/Person",
      "instanceCount": 1111
    }
  ]
}`

describe('JSON parser', () => {
  it('Throws on incorrect input', () => {
    expect(() => parseInput('')).toThrowError()
    expect(() => parseInput('{}')).toThrowError()
    expect(() => parseInput('{asdf}')).toThrowError()
    expect(() => parseInput('{test: }')).toThrowError()
    expect(() => parseInput(correctInput.substring(1))).toThrowError()
    expect(() => parseInput(correctInput.replace('1111', ''))).toThrowError()
  })

  it('Correctly parses input', () => {
    const parsed = parseInput(correctInput)
    expect(parsed.endpoint).toBe('https://dbpedia.org/sparql')
    expect(parsed.nodes.length).toBe(2)
    expect(parsed.edges.length).toBe(1)
    expect(parsed.nodes[0].id).toBe('http://www.w3.org/2002/07/owl#Thing')
    expect(parsed.nodes[0].instanceCount).toBe(1234)
    expect(parsed.edges[0].instanceCount).toBe(1111)
  })
})
