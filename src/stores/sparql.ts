export function getClassesQuery(offset: number, count: number) {
  return `
    SELECT DISTINCT ?class (COUNT(*) AS ?instanceCount)
    WHERE {
      ?s a ?class
    }
    ORDER BY DESC(?instanceCount)
    LIMIT ${count}
    OFFSET ${offset}`
}

export function getAttributesQuery(classURI: string) {
  return `
    SELECT DISTINCT ?attribute ?type (COUNT(1) AS ?instanceCount)
    WHERE {
      ?instance
          a <${classURI}> ;
        ?attribute ?targetLiteral
      FILTER isLiteral(?targetLiteral)
      BIND(datatype(?targetLiteral) AS ?type)
    }
    ORDER BY DESC(?instanceCount)
    `
}

export function getClassPropertiesQuery(classURI: string) {
  return `
    SELECT DISTINCT ?property ?value
    WHERE {
      <${classURI}> ?property ?value 
    }
    LIMIT 20
  `
}

export function getClassLinksQuery(class1URI: string, class2URI: string) {
  return `
    SELECT DISTINCT ?property (COUNT(*) AS ?instanceCount)
    WHERE {
      ?class1 a <${class1URI}> .
      ?class2 a <${class2URI}> .
      ?class1 ?property ?class2 .
    }
  `
}

/**
 * Query the SPARQL endpoint with the given query and handle results
 * @param endpoint
 * @param query
 * @returns JSON response content promise
 */
export async function queryEndpoint(endpoint: URL, query: string) {
  let queryURL = endpoint + '?query=' + encodeURIComponent(query)
  queryURL += '&format=application%2Fsparql-results%2Bjson'

  return fetch(queryURL).then((data) => data.json())
}
