import type { MarkerType } from '@vue-flow/core'
import { z } from 'zod'

const InstanceCount = z.object({
  type: z.string(),
  datatype: z.string().url(),
  value: z.string(), // This is a numeric string :(
})

const Property = z.object({
  type: z.string(),
  value: z.string(),
})

const Class = z.object({
  type: z.string(),
  value: z.string().url(),
})

const ClassPropertyBinding = z.object({
  property: Property,
  instanceCount: InstanceCount,
})

const NodeBinding = z.object({
  class: Class,
  instanceCount: InstanceCount,
  labels: z.optional(Property.array()),
})

const EdgeBinding = z.object({
  class: Class,
  instanceCount: InstanceCount,
  labels: z.optional(Property.array()),
})

export const NodeResponse = z.object({
  // ignoring head
  results: z.object({
    bindings: NodeBinding.array(),
    distinct: z.boolean(),
    ordered: z.boolean(),
  }),
})

export const EdgeResponse = z.object({
  // ignoring head
  results: z.object({
    bindings: EdgeBinding.array(),
    distinct: z.boolean(),
    ordered: z.boolean(),
  }),
})

export type StoreNode = {
  position: {
    x: number
    y: number
  }
  id: string
  type: string
  data: z.infer<typeof NodeBinding>
}

export type StoreEdge = {
  id: string
  source: string
  target: string
  data: unknown
  type?: string
  markerEnd?: MarkerType
}
