import { describe, expect, it } from 'vitest'
import {
  tryGuessPrefix,
  removeNamespace,
  getAvailablePrefix,
  getNamespace,
} from '@/stores/iriManipulation'

describe('iriManipulation', () => {
  it('Gets namespace', () => {
    expect(getNamespace('http://www.w3.org/2004/02/skos/core#Concept')).toBe(
      'http://www.w3.org/2004/02/skos/core#'
    )
    expect(getNamespace('http://dbpedia.org/ontology/Person')).toBe('http://dbpedia.org/ontology/')
  })

  it('Removes namespace', () => {
    expect(
      removeNamespace(
        'http://www.w3.org/2004/02/skos/core#',
        'http://www.w3.org/2004/02/skos/core#Concept'
      )
    ).toBe('Concept')
    expect(
      removeNamespace('http://dbpedia.org/ontology/', 'http://dbpedia.org/ontology/Person')
    ).toBe('Person')
  })

  it('Guesses prefix', () => {
    expect(tryGuessPrefix('http://www.w3.org/2004/02/skos/core#')).toContain('skos')
    expect(tryGuessPrefix('http://dbpedia.org/class/yago/')).toContain('yago')
    expect(tryGuessPrefix('http://xmlns.com/foaf/0.1/')).toContain('foaf')
    expect(tryGuessPrefix('http://www.w3.org/2003/01/geo/wgs84_pos#')).toContain('geo')
  })

  it('Gets unique available prefixes', () => {
    const knownNamespaces = {
      'http://xmlns.com/foaf/0.1/': 'foaf',
      placeholder: 'prefix',
      placeholder1: 'prefix1',
    }
    expect(getAvailablePrefix(['skos'], knownNamespaces)).toBe('skos')
    expect(getAvailablePrefix(['foaf'], knownNamespaces)).toBe('foaf1')
    expect(getAvailablePrefix(['prefix'], knownNamespaces)).toBe('prefix2')
  })
})
