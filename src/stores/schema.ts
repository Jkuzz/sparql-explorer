import * as ns from 'ldkit/namespaces'
import type { StoreNode } from '@/stores/validators'
import { useEndpointStore } from '@/stores/endpoint'

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
 * Cut the provided namespace prefix from the iri.
 * Leaves the iri unchanged if the namespace does not match the iri's prefix
 * @param nameSpace that is being removed
 * @param iri from which to cut the namespace
 * @returns the iri with the namespace iri prefix removed
 */
function removeNamespace(nameSpace: string, iri: string) {
  if (nameSpace === iri.substring(0, nameSpace.length)) {
    return iri.substring(nameSpace.length)
  }
  return iri
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

  knownNamespaces[newNs] = getAvailablePrefix(possiblePrefixes)
  newNamespaces[newNs] = []
  return newNs
}

/**
 * This loop goes through all the possible prefixes and tests if they are available
 * If none are, adds a number at the end and tests again
 * @returns an available namespace prefix
 */
function getAvailablePrefix(possiblePrefixes: string[]) {
  // This loop is limited because in testing, a whie(true) somehow inexplicably ran infinitely
  for (let iterations = 0; iterations < 10000; iterations += 1) {
    for (const prefix of possiblePrefixes) {
      const numberedPrefix = iterations > 0 ? prefix + iterations : prefix
      console.log('🚀 ~ file: schema.ts:162 ~ getAvailablePrefix ~ numberedPrefix:', numberedPrefix)
      if (!Object.values(knownNamespaces).includes(numberedPrefix)) {
        return numberedPrefix
      }
    }
  }
  return 'unknown'
}

/**
 * Guesses the prefix of the namespace based on the iri.
 * Hopes that the iri directly includes the prefix as a substring.
 * @param iri whose prefix to guess
 * @returns array of possible prefixes
 */
function tryGuessPrefix(iri: string) {
  console.log('🚀 ~ file: schema.ts:174 ~ tryGuessPrefix ~ iri:', iri)
  const prefixes = /\/[A-Za-z]{3,4}[^A-Za-z.]/.exec(iri)
  const shortPrefixes = prefixes
    ?.map((p) => p.substring(1, p.length - 1))
    .filter((p) => p !== 'www')
  console.log('🚀 ~ file: schema.ts:177 ~ tryGuessPrefix ~ shortPrefixes:', shortPrefixes)
  if (shortPrefixes && shortPrefixes?.length > 0) return shortPrefixes

  const longPrefixes = /\/[A-Za-z]+[^A-Za-z.]/
    .exec(iri)
    ?.map((p) => p.substring(1, p.length - 1))
    .filter((p) => p !== 'www')
  console.log('🚀 ~ file: schema.ts:183 ~ tryGuessPrefix ~ longPrefixes:', longPrefixes)
  return longPrefixes
}
