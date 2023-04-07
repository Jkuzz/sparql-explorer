import Ajv from 'ajv/dist/jtd'
import { importSchema } from '@/importSchema'
import { useEndpointStore } from '@/stores/endpoint'

const ajv = new Ajv()
const parse = ajv.compileParser(importSchema)
const endpointStore = useEndpointStore()

export function parseInput(inputText: string) {
  const res = parse(inputText)
  if (!res) {
    throw new Error(`${parse.message} at position ${parse.position}`)
  }
  endpointStore.handleParsedImport(res)
}
