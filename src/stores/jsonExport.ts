import type { StoreNode, StoreEdge } from '@/stores/validators'
import { useEndpointStore } from '@/stores/endpoint'

const endpointStore = useEndpointStore()

// Copy the defaultNamespaces object
const exportedClasses: string[] = []

/**
 * Export the provided entities as an LDKit schema definition code
 * Not formated correctly, do that externally.
 * @param nodes selected nodes to export
 * @param selectedAttributes attributes of the selected nodes to export
 * @param selectedAttributes edges selected for export
 * @returns string containing the exported schema definition
 */
export default function exportSchema(
  nodes: StoreNode[],
  selectedAttributes: { [key: string]: string[] },
  selectedEdges: StoreEdge[]
) {
  // Clear these to default in case of previous export
  exportedClasses.splice(0, exportedClasses.length)

  let exportText = `{
    "endpoint": "${endpointStore.endpointURL}",
    "nodes": [
  `

  exportText += nodes.map((node) => exportNode(node, selectedAttributes[node.id])).join(',')
  exportText += '],\n"edges": ['
  exportText += selectedEdges.map((edge) => exportEdge(edge)).join(',')

  return exportText + ']}'
}

/**
 * Export the selected node into an LDKit schema definition
 * @param node The store node object to export
 * @param selectedAttributes attributes of the node that were selected for export
 * @returns string containing the LDKit schema definition code
 */
function exportNode(node: StoreNode, selectedAttributes: string[]) {
  let nodeExport = `{
    "id": "${node.id}",
    "instanceCount": ${+node.data.node.instanceCount.value}`

  if (selectedAttributes.length > 0) {
    nodeExport += ',\n"attributes": ['
    nodeExport += selectedAttributes.map((attr) => exportAttr(attr, node)).join(',')
    nodeExport += ']'
  }
  return nodeExport + '}'
}

/**
 * Create an export object for the exported attribute
 * @param attrIri iri of the exported attribute (predicate)
 * @returns the json object for the attribute
 */
function exportAttr(attrIri: string, node: StoreNode) {
  const nodeAttr = node.data.attributes.find((attr) => attr.attribute.value === attrIri)
  if (!nodeAttr) return // shouldn't happen!
  return `{
    "id": "${attrIri}",
    "type": "${nodeAttr.type.value}",
    "instanceCount": ${nodeAttr.instanceCount.value}
  }`
}

/**
 * Create an export object for the edge.
 * @param edge the edge to export
 * @returns the edge export json string
 */
function exportEdge(edge: StoreEdge) {
  return `{
    "source": "${edge.source}",
    "target": "${edge.target}",
    "id": "${edge.uri}",
    "instanceCount": ${edge.data.instanceCount.value}
  }`
}
