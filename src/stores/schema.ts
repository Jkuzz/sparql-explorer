import * as ns from 'ldkit/namespaces'
import type { StoreNode } from '@/stores/validators'

const knownNamespaces: { [key: string]: unknown } = {
  [ns.dbo.$iri]: ns.dbo,
  [ns.dc.$iri]: ns.dc,
  [ns.dcterms.$iri]: ns.dcterms,
  [ns.foaf.$iri]: ns.foaf,
  [ns.gr.$iri]: ns.gr,
  [ns.rdf.$iri]: ns.rdf,
  [ns.rdfs.$iri]: ns.rdfs,
  [ns.schema.$iri]: ns.schema,
  [ns.schema.$iri]: ns.schema,
  [ns.skos.$iri]: ns.skos,
  [ns.xsd.$iri]: ns.xsd,
}

export function makeSchema(nodes: StoreNode[]) {
  nodes.forEach((node) => {
    let nodeNamespace = findNamespace(node.id)
    if (!nodeNamespace) {
      nodeNamespace = makeNewNamespace(node.id)
    }
    console.log(`${node.id}\t:\t${nodeNamespace}`)
  })
}

/**
 * Find if the provided iri is in a known namespace
 * @param iri whose namespace object to find
 * @returns iri of the namespace to which it belongs, undefined if ns is unknown
 */
function findNamespace(iri: string) {
  for (const nameSpace in knownNamespaces) {
    if (iri.startsWith(nameSpace)) return nameSpace
    return undefined
  }
}

function makeNewNamespace(iri: string) {
  return 'http://example.org/'
}
