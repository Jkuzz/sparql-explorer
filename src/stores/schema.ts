import * as ns from 'ldkit/namespaces'
import type { StoreNode } from '@/stores/validators'
import { useEndpointStore } from '@/stores/endpoint'

const endpointStore = useEndpointStore()

const knownNamespaces: { [key: string]: string } = {
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

const defaultNamespaces = Object.keys(knownNamespaces)
const usedNamespaces = new Set<string>()
const exportedClasses: string[] = []

const ldkitExportBase = `import * as ldkit from 'ldkit'
  import * as ldkitns from 'ldkit/namespaces'

  // Schema definitions`

export function makeSchema(nodes: StoreNode[], selectedAttributes: { [key: string]: string[] }) {
  usedNamespaces.clear()
  exportedClasses.splice(0, exportedClasses.length)

  let exportText = ldkitExportBase
  nodes.forEach((node) => {
    exportText += exportNode(node.id, selectedAttributes[node.id])
  })
  exportText += exportContext()
  exportText += exportLenses()
  return exportText
}

function exportNode(nodeId: string, selectedAttributes: string[]) {
  const nodeNamespaceIri = findNamespace(nodeId)
  const nodeName = removeNamespace(nodeNamespaceIri, nodeId)

  exportedClasses.push(nodeName)
  usedNamespaces.add(knownNamespaces[nodeNamespaceIri])

  let nodeExport = `
    const ${nodeName}Schema = {
    '@type': ldkitns.${knownNamespaces[nodeNamespaceIri]}.${nodeName},`
  console.log(`${nodeId}\t:\t${nodeNamespaceIri}`)
  selectedAttributes.forEach((attr) => {
    nodeExport += exportAttr(attr, 'xsd.string')
  })

  nodeExport += `\n} as const\n`
  return nodeExport
}

function exportAttr(attrIri: string, attrType: string) {
  const attrNamespace = findNamespace(attrIri)
  const attrName = removeNamespace(attrNamespace, attrIri)
  return `
    ${attrName}: {
      '@id': ldkitns.${knownNamespaces[attrNamespace]}.${attrName},
      '@type': ldkitns.${attrType},
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

function removeNamespace(nameSpace: string, iri: string) {
  if (nameSpace === iri.substring(0, nameSpace.length)) {
    return iri.substring(nameSpace.length)
  }
  return iri
}

function exportContext() {
  return `
    // Create a context for query engine
    const context: ldkit.Context = {
      sources: ['${endpointStore.endpointURL}'], // SPARQL endpoint
      language: 'en', // Preferred language
    }`
}

function exportLenses() {
  let lensesExport = `\n\n// Create a resource using the data schema and context above\n`
  exportedClasses.forEach((cls) => {
    lensesExport += `const ${cls} = ldkit.createLens(${cls}Schema, context)\n`
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
  return iri.substring(0, Math.max(slashPos, hashPos) + 1)
}
