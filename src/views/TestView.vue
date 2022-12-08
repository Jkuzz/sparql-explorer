<script setup lang="ts">
import type { Context } from 'ldkit'
import { createLens } from 'ldkit'
import { dbo, rdfs, xsd } from 'ldkit/namespaces'

// Create a schema
const PersonSchema = {
  '@type': dbo.Person,
  name: rdfs.label,
  abstract: dbo.abstract,
  birthDate: {
    '@id': dbo.birthDate,
    '@type': xsd.date,
  },
} as const

// Create a context for query engine
const context: Context = {
  sources: ['https://dbpedia.org/sparql'], // SPARQL endpoint
  language: 'en', // Preferred language
}

// Create a resource using the data schema and context above
try {
  const Persons = createLens(PersonSchema, context)
  const adaIri = 'http://dbpedia.org/resource/Ada_Lovelace'
  // const ada = await Persons.findByIri(adaIri)

  // console.log(ada?.name) // Ada Lovelace
  // console.log(ada?.birthDate) // Date object of 1815-12-10
} catch (e) {
  console.log(e)
}

// List all persons
// const persons = await Persons.find()
// for (const person of persons) {
//   console.log(person.name) // string
//   console.log(person.birthDate) // Date
// }

// // Get total count of all persons
// const count = await Persons.count()
// console.log(count) // number

// // Get a particular person identified by IRI
// const ada = await Persons.findByIri('http://dbpedia.org/resource/Ada_Lovelace')
// console.log(ada?.name) // string "Ada Lovelace"
// console.log(ada?.birthDate) // Date object of 1815-12-10
</script>

<template>
  <div class="bg-slate-900 text-gray-200 p-8 flex flex-col items-center space-y-20">
    <h1 class="text-4xl font-semibold">Testing here :)</h1>
    <div class="p-4 bg-slate-800 rounded-lg max-w-xl">:)</div>
  </div>
</template>
