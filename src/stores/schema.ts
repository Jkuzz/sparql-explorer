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

const ldkitExportBase = `
import * as ldkitns from 'ldkit/namespaces'

// Schema definitions`

export function makeSchema(nodes: StoreNode[], selectedAttributes: { [key: string]: string[] }) {
  let exportText = ldkitExportBase
  nodes.forEach((node) => {
    let nodeNamespace = findNamespace(node.id)
    if (!nodeNamespace) {
      nodeNamespace = makeNewNamespace(node.id)
    }
    exportText += `
const test = {
  '@id': ${node.id},
}`
    console.log(`${node.id}\t:\t${nodeNamespace}`)
    selectedAttributes[node.id].forEach(console.log)
  })
  console.log('🚀 ~ file: schema.ts:31 ~ makeSchema ~ exportText:', exportText)
  return exportText
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

/**
 * Extracts the namespace
 * optimistically hopes the namespace is separated by `/` or `#` from the object
 * // TODO: add the namespace definition to the export
 * @param iri class whose namespace to create
 * @returns url of the namespace
 */
function makeNewNamespace(iri: string) {
  const slashPos = iri.lastIndexOf('/')
  const hashPos = iri.lastIndexOf('#')
  return iri.substring(0, Math.max(slashPos, hashPos) + 1)
}
