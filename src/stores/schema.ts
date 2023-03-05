import * as ns from 'ldkit/namespaces'
import type { StoreNode } from '@/stores/validators'
import { useEndpointStore } from '@/stores/endpoint'
import { tryGuessPrefix, removeNamespace, getAvailablePrefix } from '@/stores/iriManipulation'

const endpointStore = useEndpointStore()

const defaultNamespaces: { [key: string]: string } = {
  [ns.dbo.$iri]: ns.dbo.$prefix.slice(0, -1),
  [ns.dc.$iri]: ns.dc.$prefix.slice(0, -1),
  [ns.dcterms.$iri]: ns.dcterms.$prefix.slice(0, -1),
  [ns.foaf.$iri]: ns.foaf.$prefix.slice(0, -1),
  [ns.gr.$iri]: ns.gr.$prefix.slice(0, -1),
  [ns.rdf.$iri]: ns.rdf.$prefix.slice(0, -1),
  [ns.rdfs.$iri]: ns.rdfs.$prefix.slice(0, -1),
  [ns.schema.$iri]: ns.schema.$prefix.slice(0, -1),
  [ns.schema.$iri]: ns.schema.$prefix.slice(0, -1),
  [ns.skos.$iri]: ns.skos.$prefix.slice(0, -1),
  [ns.xsd.$iri]: ns.xsd.$prefix.slice(0, -1),
}

// Copy the defaultNamespaces object
let knownNamespaces = Object.assign({}, defaultNamespaces)
let newNamespaces: { [key: string]: string[] } = {}
const exportedClasses: string[] = []

const ldkitExportBase = `import * as ldkit from 'ldkit'
  import * as ldkitns from 'ldkit/namespaces'

  // Schema definitions`

/**
 * Export the provided entities as an LDKit schema definition code
 * Not formated correctly, do that externally.
 * @param nodes selected nodes to export
 * @param selectedAttributes attributes of the selected nodes to export
 * @returns string containing the exported schema definition
 */
export function makeSchema(nodes: StoreNode[], selectedAttributes: { [key: string]: string[] }) {
  // Clear these to default in case of previous export
  newNamespaces = {}
  knownNamespaces = Object.assign({}, defaultNamespaces)
  exportedClasses.splice(0, exportedClasses.length)

  let exportText = ldkitExportBase
  nodes.forEach((node) => {
    exportText += exportNode(node.id, selectedAttributes[node.id])
  })
  exportText += exportContext()
  exportText += exportLenses()
  return exportText
}

/**
 * Export the selected node into an LDKit schema definition
 * @param nodeId iri of the node
 * @param selectedAttributes attributes of the node that were selected for export
 * @returns string containing the LDKit schema definition code
 */
function exportNode(nodeId: string, selectedAttributes: string[]) {
  const nodeNamespaceIri = findNamespace(nodeId)
  const nodeName = removeNamespace(nodeNamespaceIri, nodeId)

  exportedClasses.push(nodeName)

  // The namespace will be in `ldkitns.` only if it is a default ns
  const nsCodePrefix = newNamespaces[nodeNamespaceIri] ? '' : 'ldkitns.'

  let nodeExport = `
    const ${nodeName}Schema = {
    '@type': ${nsCodePrefix}${knownNamespaces[nodeNamespaceIri]}.${nodeName},`
  console.log(`${nodeId}\t:\t${nodeNamespaceIri}`)
  selectedAttributes.forEach((attr) => {
    nodeExport += exportAttr(attr, 'xsd.string')
  })

  return nodeExport + `\n} as const\n`
}

function exportAttr(attrIri: string, attrType: string) {
  const attrNamespace = findNamespace(attrIri)
  const attrName = removeNamespace(attrNamespace, attrIri)
  const nsCodePrefix = newNamespaces[attrNamespace] ? '' : 'ldkitns.'
  return `
    ${attrName}: {
      '@id': ${nsCodePrefix}${knownNamespaces[attrNamespace]}.${attrName},
      '@type': ${nsCodePrefix}${attrType},
      '@optional': true,
    },`
}

/**
 * Find if the provided iri is in a known namespace
 * @param iri whose namespace object to find
 * @returns iri of the namespace to which it belongs, undefined if ns is unknown
 */
function findNamespace(iri: string) {
  for (const nameSpace in knownNamespaces) {
    if (iri.startsWith(nameSpace)) return nameSpace
  }
  return makeNewNamespace(iri)
}

/**
 * Create the export string of the LDKit context
 * @returns the export code string
 */
function exportContext() {
  return `
    // Create a context for query engine
    const context: ldkit.Context = {
      sources: ['${endpointStore.endpointURL}'], // SPARQL endpoint
      language: 'en', // Preferred language
    }`
}

/**
 * Create the exportable code defining the LDKit lenses
 * Creates one lens for each class schema
 * @returns the export code string
 */
function exportLenses() {
  let lensesExport = `\n\n// Create a resource using the data schema and context above\n`
  exportedClasses.forEach((cls) => {
    lensesExport += `const ${cls}Lens = ldkit.createLens(${cls}Schema, context)\n`
  })
  return lensesExport
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
  const newNs = iri.substring(0, Math.max(slashPos, hashPos) + 1)
  let possiblePrefixes = tryGuessPrefix(newNs)
  console.log('🚀 ~ file: schema.ts:143 ~ makeNewNamespace ~ possiblePrefixes:', possiblePrefixes)
  if (!possiblePrefixes || possiblePrefixes.length === 0) {
    possiblePrefixes = ['prefix']
  }
  console.log('🚀 ~ file: schema.ts:147 ~ makeNewNamespace ~ nsPrefix:', possiblePrefixes)

  knownNamespaces[newNs] = getAvailablePrefix(possiblePrefixes, knownNamespaces)
  newNamespaces[newNs] = []
  return newNs
}
