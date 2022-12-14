import QueryHandler from '@/components/force/queryHandler'
import { devQueryClasses } from '@/components/force/dev'

export function getClassesQuery(offset: number) {
  return `
    SELECT DISTINCT ?class (COUNT(*) AS ?instanceCount)
    WHERE {
      ?s a ?class
    }
    ORDER BY DESC(?instanceCount)
    LIMIT 10
    OFFSET ${offset}`
}

export function getAttributesQuery(classURI: string) {
  return `
    SELECT DISTINCT ?attribute (COUNT(1) AS ?instanceCount)
    WHERE {
      ?instance
          a <${classURI}> ;
        ?attribute ?targetLiteral
      FILTER isLiteral(?targetLiteral)
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

// PREFIX se: <http://test.com/>
// CONSTRUCT {
// []
//   a se:AttributeObservation ;
//   se:describedAttribute <http://dbpedia.org/ontology/abstract> ;
//   se:attributeSourceClass <http://dbpedia.org/ontology/Person> ;
//   se:targetLiteral ?targetLiteral .
// } WHERE {
//   {
//     SELECT ?targetLiteral
//     WHERE {
//       GRAPH ?g {
//         ?instance
//           a <http://dbpedia.org/ontology/Person> ;
//           <http://dbpedia.org/ontology/abstract> ?targetLiteral .
//         FILTER isLiteral(?targetLiteral) 
//       }
//     }
//   } 
// }

// export function getClassLinksQuery() {
//   return `
//     SELECT DISTINCT ?property (COUNT(*) AS ?instanceCount)
//     WHERE {
//         ?class1 a <http://www.w3.org/ns/dqv#QualityMeasurement> .
//         ?class2 a <http://www.w3.org/ns/dcat#Distribution> .
//         ?class2 ?property ?class1 .
//     }
//     `
// }

const queryHandler = new QueryHandler()
let queriedClasses = 0

export function main() {
  // const urlParams = new URLSearchParams(window.location.search)
  // const endpointURL = urlParams.get('endpoint')
  // document.getElementById('helloHeader').textContent += endpointURL

  // queryEndpoint(endpointURL, getClassesQuery(0))
  devQueryClasses(5, queriedClasses).then((response) => {
    queriedClasses += response.length
    queryHandler.handleClassesQuery(response)
  })
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

// async function updateVisGraph(visData) {
//   const copyVisData = { ...visData }
//   updateForceVis(copyVisData)
//   return visData
// }
