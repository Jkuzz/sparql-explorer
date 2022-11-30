import * as d3 from 'd3'

const svg = d3.select('#visSvg')

const width = svg.style('width').slice(0, -2) // remove 'px' from the end
const height = svg.style('height').slice(0, -2)

const svgWrapper = svg
  .append('g')
  .classed('wrapper', true)
  .attr('transform', 'translate(0, 0) scale(1)')

const link = svgWrapper
  .append('g')
  .attr('id', 'linkContainer')
  .attr('stroke-opacity', 1)
  .attr('stroke', 'black')
  .attr('stroke-width', 5)
  .attr('marker-end', 'url(#arrowHead)')
  .attr('fill', 'none')
  .selectAll('path')

const node = svgWrapper
  .append('g')
  .attr('id', 'nodeContainer')
  .attr('stroke', '#449')
  .attr('stroke-width', 1.5)
  .attr('fill', '#77b')
  .selectAll('.node')

const linkLabel = svgWrapper
  .append('g')
  .attr('id', 'linkLabelContainer')
  .attr('stroke', '#999')
  .attr('fill', 'DeepSkyBlue')
  .selectAll('rect')

const simulation = d3
  .forceSimulation()
  .force('charge', d3.forceManyBody().strength(-800))
  .force(
    'collide',
    d3.forceCollide().radius((d) => getClassRadius(d))
  )
  .force(
    'link',
    d3
      .forceLink()
      .id((d) => d.id)
      .distance(200)
      .strength(0.2)
  )
  .force('x', d3.forceX(width / 2).strength(0.02))
  .force('y', d3.forceY(height / 2).strength(0.02))
  .on('tick', ticked)

function ticked() {
  node.attr('transform', (d) => `translate(${d.x}, ${d.y})`)

  linkLabel.attr('transform', (d) => `translate(${d.x}, ${d.y})`)

  link.attr('d', (d) => makeLinkPath(d, node.data()))
}

svg.call(drag(simulation))
svg.call(
  d3.zoom().on('zoom', (event) => {
    const originalTransform = svgWrapper.attr('transform')
    svgWrapper.attr('transform', zoomTransformString(originalTransform, event.transform.k))
  })
)

const mainPathColour = 'hsl(336, 100%, 55%)'
const secondaryPathColour = 'hsl(336, 100%, 75%)'
document.querySelector('#arrowHeadMain').setAttribute('fill', mainPathColour)
document.querySelector('#arrowHeadSecondary').setAttribute('fill', secondaryPathColour)

const nodeClickManager = new NodeClickManager()

function updateForceVis(visData) {
  const linksData = 'links' in visData ? Object.values(visData.links) : []
  const classesData = 'classes' in visData ? Object.values(visData.classes) : []

  // Make a shallow copy to protect against mutation, while
  // recycling old nodes to preserve position and velocity.
  const oldNodes = new Map(node.data().map((d) => [d.id, d]))
  classesData = classesData.map((d) => Object.assign(oldNodes.get(d.id) || {}, d))
  const oldLinks = [...link.data()]
  linksData.forEach((l) => {
    if (oldLinks.indexOf(l) === -1) {
      oldLinks.push(l)
    }
  })
  linksData = oldLinks

  node = node.data(classesData).join((enter) => {
    const nodeContainer = enter
      .append('g')
      .classed('node', true)
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
    nodeContainer
      .append('circle')
      .attr('r', (d) => getClassRadius(d))
      .call(drag(simulation))
      .on('click', (event, node) => {
        nodeClickManager.clickNode(event.target.parentNode, link)
        displayNodeInfo(node, getNodeLinks(node.id, link.data()))
      })
    nodeContainer
      .append('text')
      .text((d) => d.label)
      .classed('nodeLabel', true)
      .attr('text-anchor', 'middle')
      .attr('stroke-width', '1')
      .attr('stroke', '#000')
      .attr('fill', '#000')
      .attr('pointer-events', 'none')
    return nodeContainer
  })

  const clickedLink = d3.select('#linkContainer path.clicked').data()

  linkLabel = linkLabel.data(linksData).join((enter) => {
    if (enter.empty()) return
    const linkContainer = enter
      .append('g')
      .classed('linkLabel', true)
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    const text = linkContainer
      .append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('stroke-width', '1')
      .attr('stroke', '#000')
      .attr('fill', '#000')
      .attr('pointer-events', 'none')
      .attr('y', '0')
    const textBBox = text.node().getBBox()

    linkContainer
      .insert('rect', 'text') // Insert before text!
      .attr('width', textBBox.width + 10)
      .attr('height', textBBox.height + 10)
      .attr('x', (textBBox.width + 10) / -2)
      .attr('y', (textBBox.height + 10) / -2)
      .call(drag(simulation))
      .on('click', (event, path) => {
        nodeClickManager.clickPath(event, path, link)
      })

    return linkContainer
  })

  link = link.data(linksData).join((enter) =>
    enter
      .append('path')
      .on('click', (event, path) => {
        nodeClickManager.clickPath(event, path, link)
      })
      .on('mouseover', (event, path) => {
        if (!event.target.classList.contains('clicked')) {
          event.target.setAttribute('stroke', secondaryPathColour)
          event.target.setAttribute('marker-end', 'url(#arrowHeadSecondary)')
        }
      })
      .on('mouseout', (event, path) => {
        if (
          !event.target.classList.contains('clicked') &&
          !event.target.classList.contains('highlight')
        ) {
          event.target.setAttribute('stroke', 'black')
          event.target.setAttribute('marker-end', 'url(#arrowHead)')
        }
      })
      .attr('stroke', (d) => {
        if (clickedLink.length > 0 && d.uri == clickedLink[0].uri) {
          return 'hsl(336, 100%, 75%)'
        }
        return 'black'
      })
      .attr('marker-end', (d) => {
        if (clickedLink.length > 0 && d.uri == clickedLink[0].uri) {
          return 'url(#arrowHeadSecondary)'
        }
        return ''
      })
      .classed('highlight', (d) => {
        return clickedLink.length > 0 && d.uri == clickedLink[0].uri
      })
  )

  const simulationNodes = [...classesData].concat([...linksData])
  simulation.nodes(simulationNodes)

  // Split semantic links into two simulation links for proper label behaviour
  const processedLinks = linksData.flatMap((l) => [
    { source: l.source, target: l.id },
    { source: l.id, target: l.target },
  ])

  simulation.force('link').links(processedLinks)
  simulation.alpha(1).restart().tick()
  ticked() // render now!
}

let draggingBackground = false // To prevent stuttering

function drag(simulation) {
  function dragstarted(event) {
    draggingBackground = 'id' in event.sourceEvent.target && event.sourceEvent.target.id == 'visSvg'

    if (!event.active) simulation.alphaTarget(0.3).restart()
    event.sourceEvent.stopPropagation()
    event.subject.fx = event.subject.x
    event.subject.fy = event.subject.y
  }

  function dragged(event) {
    event.sourceEvent.stopPropagation()
    if (draggingBackground) {
      const newTransform = moveTransformString(svgWrapper.attr('transform'), event.dx, event.dy)
      svgWrapper.attr('transform', newTransform)
    } else {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0)
    event.subject.fx = null
    event.subject.fy = null
  }

  return d3
    .drag()
    .container((g) => g) // To drag the <g> element
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}
