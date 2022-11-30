/**
 * Get size of visualised class based on its count
 * @param {Object} cls must contain .count property
 */
function getClassRadius(cls: any) {
  if (!cls['count']) {
    return 1
  }
  return Math.max(Math.log(cls.count) / Math.log(1.2) - 15, 8)
}

/**
 * Extract usable label from URI. Takse last slice after either '/' or '#'
 * @param {URI} uri
 * @returns {String} extracted label
 */
function getLabelFromURI(uri: string) {
  const slashLast = uri.split('/').slice(-1)[0] // get last element inplace
  const hashLast = uri.split('#').slice(-1)[0]
  return slashLast.length < hashLast.length ? slashLast : hashLast
}

/**
 * From SVG transform string, move translate by (dx, dy)
 * @param {String} transform SVG element's transform
 * @param {Number} dx
 * @param {Number} dy
 * @returns {String} the modified string
 */
function moveTransformString(transform: string, dx: number, dy: string) {
  const translatePos = transform.indexOf('translate(') + 10
  const translateEnd = transform.indexOf(')', translatePos) // bind position to match correct ()
  const original = transform.substring(translatePos, translateEnd).split(',')
  const newX = Number(original[0]) + dx
  const newY = Number(original[1]) + dy
  const newTransform = transform.replace(
    transform.substring(translatePos - 10, translateEnd + 1),
    `translate(${newX}, ${newY})`
  )
  return newTransform
}

/**
 * From SVG transform string, zoom scale to new scale
 * @param {String} transform SVG element's transform
 * @param {Number} newScale
 * @returns {String} the modified string
 */
function zoomTransformString(transform: string, newScale: number) {
  const scalePos = transform.indexOf('scale(') + 6
  const scaleEnd = transform.indexOf(')', scalePos) // bind position to match correct ()
  const newTransform = transform.replace(
    transform.substring(scalePos - 6, scaleEnd + 1),
    `scale(${newScale})`
  )
  return newTransform
}

/**
 * Finds all outgoing links for the chosen node
 * @param {URI} nodeId
 * @param {Array} links
 * @returns {Array} filtered array
 */
function getNodeLinks(nodeId, links) {
  return links.filter((link) => link.source == nodeId)
}

/**
 * From two input nodes, calculates the position on their path that intersects
 * with the target node's edge.
 * @param {p5.Vector} source position of source node
 * @param {p5.Vector} target position of source node
 * @param {Number} targetRadius radius of target node
 * @returns {p5.Vector} position of target edge intersect relative to target node
 */
function calculatePathToCircleEdge(source, target, targetRadius) {
  const direction = p5.Vector.sub(source, target).setMag(targetRadius + 20) // increase radius to accommodate for the arrow
  return p5.Vector.add(target, direction)
}

/**
 * Calculate bezier curve representing path between two nodes, label-aware
 * @param {*} label data item of the link label
 * @param {*} nodes nodes of simulation to find proper source and target in
 * @returns {String} representation of svg path curve
 */
function makeLinkPath(label, nodes) {
  const sourceNode = nodes.filter((n) => n.id == label.source)[0]
  const targetNode = nodes.filter((n) => n.id == label.target)[0]

  // Create p5 vectors for easier operations
  const source = new p5.Vector(sourceNode.x, sourceNode.y)
  const target = new p5.Vector(targetNode.x, targetNode.y)
  const labelVec = new p5.Vector(label.x, label.y)
  const targetEdgeIntersect = calculatePathToCircleEdge(
    labelVec,
    target,
    getClassRadius(targetNode)
  )

  // Place the quadratic bezier midpoint so that label is on the path
  // This means it has to be twice as far from midpoint as label is from midpoint
  const midpoint = new p5.Vector(
    targetEdgeIntersect.x + source.x,
    targetEdgeIntersect.y + source.y
  ).div(2)
  const bezierPoint = midpoint.add(labelVec.sub(midpoint).mult(2))

  return `
    M ${source.x} ${source.y}
    Q ${bezierPoint.x} ${bezierPoint.y} ${targetEdgeIntersect.x} ${targetEdgeIntersect.y}`
}

/**
 * Handles clicking on visualisation objects.
 * Methods manage deselecting of previously clicked object.
 */
class NodeClickManager {
  lastClickedNode = null
  lastClickedPath = null

  clickNode = (clickedNode, links) => {
    if (this.lastClickedNode != null) {
      this.lastClickedNode.classList.remove('activeNode')
    }
    this.lastClickedNode = clickedNode
    if (clickedNode == null) {
      return // Only deselect was requested
    }
    this.clickPath(null, null, links) // deselect clicked link
    clickedNode.classList.add('activeNode')
  }

  clickPath = (event, path, allLinks) => {
    if (this.lastClickedPath != null) {
      this.lastClickedPath.classList.remove('clicked')
      this.lastClickedPath.removeAttribute('stroke-width')
      this.lastClickedPath.removeAttribute('stroke')
      this.lastClickedPath.removeAttribute('marker-end')
    }
    allLinks // Reset all links first
      .classed('highlight', false)
      .attr('stroke', null)
      .attr('marker-end', null)

    if (event == null) {
      // Only deselect
      this.lastClickedPath = null
      return
    }

    // If clicked path label, get the path first
    let target
    if (event.target.nodeName != 'path') {
      target = allLinks.filter((d) => d.id == path.id).node()
    } else {
      target = event.target
    }
    this.lastClickedPath = target

    this.clickNode(null) // deselect clicked node
    allLinks // Secondary highlight those with same URI as clicked path
      .filter((d) => d.uri == path.uri)
      .classed('highlight', true) // This is to not unclolour on mouseout
      .attr('stroke', secondaryPathColour)
      .attr('marker-end', 'url(#arrowHeadSecondary)')

    // Main highlight clicked path last
    target.classList.add('clicked')
    target.setAttribute('stroke', mainPathColour)
    target.setAttribute('stroke-width', 8)
    target.setAttribute('marker-end', 'url(#arrowHeadMain)')

    displayPathInfo(path, allLinks)
  }
}
