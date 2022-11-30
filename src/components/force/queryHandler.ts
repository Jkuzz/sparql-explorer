export default class QueryHandler {
  visData = {
    classes: {},
    links: [],
  }

  /**
   * Format class query response
   * @param response
   * @returns Object of processed response items
   */
  handleClassesQuery = (response: JSON) => {
    response.forEach((element) => {
      const newClass = {
        uri: element.class.value,
        id: element.class.value,
        count: element.instanceCount.value,
        label: getLabelFromURI(element.class.value),
      }
      // request links to existing classes before new one is added
      this.requestNewLinks(newClass)
      this.visData['classes'][element.class.value] = newClass
    })
    updateVisGraph(this.visData)
  }

  handleLinksQuery = (response) => {
    this.visData.links.push(...response)
    updateVisGraph(this.visData)
  }

  requestNewLinks = (newClass) => {
    const classesCopy = { ...this.visData.classes }
    for (const cls in classesCopy) {
      devQueryLink(newClass.id, cls).then((r) => this.handleLinksQuery(r))
      devQueryLink(cls, newClass.id).then((r) => this.handleLinksQuery(r))
    }
  }
}
