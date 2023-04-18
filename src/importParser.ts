import Ajv from 'ajv/dist/jtd'
import { importSchema } from '@/importSchema'

const ajv = new Ajv()
const parse = ajv.compileParser(importSchema)

export function parseInput(inputText: string) {
  const res = parse(inputText)
  if (!res) {
    throw new Error(`${parse.message} at position ${parse.position}`)
  }
  return res
}
