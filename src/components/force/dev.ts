async function devQueryClasses(number, offset) {
  await sleep(800)
  return fetch('testresult.json')
    .then((data) => data.json())
    .then((r) => r.results.bindings.slice(offset, offset + number))
}

async function devQueryLink(sourceURI, targetURI) {
  if (Math.random() > 0.3) return []
  await sleep(getRandomInt(500, 30000))

  if (Math.random() > 0.3) {
    return [
      {
        source: sourceURI,
        target: targetURI,
        uri: 'http://www.example.com/testProperty',
        id: sourceURI + 'http://www.example.com/testProperty' + targetURI,
        label: 'testProperty',
        count: getRandomInt(1000, 20000),
      },
    ]
  } else {
    return [
      {
        source: sourceURI,
        target: targetURI,
        uri: 'http://www.example.com/exampleProperty',
        id: sourceURI + 'http://www.example.com/exampleProperty' + targetURI,
        label: 'exampleProperty',
        count: getRandomInt(1000, 20000),
      },
    ]
  }
}

async function devQueryClass(classURI) {
  await sleep(2000)
  if (classURI != 'http://www.example.com/testClass') return []
  return [
    {
      class: {
        type: 'uri',
        value: 'http://www.example.com/testClass',
      },
      instanceCount: {
        type: 'typed-literal',
        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
        value: '1234',
      },
    },
  ]
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  //The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min)
}
