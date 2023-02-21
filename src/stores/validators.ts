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

const Label = z.object({
  type: z.string(),
  'xml:lang': z.string(),
  value: z.string(),
})

const Labels = z.array(
  z.object({
    property: Property,
    value: Label,
  })
)

const ClassPropertyBinding = z.object({
  property: Property,
  instanceCount: InstanceCount,
})

const NodeBinding = z.object({
  class: Class,
  instanceCount: InstanceCount,
})

export const EdgeBinding = z.object({
  property: Property,
  instanceCount: InstanceCount,
})

export const AttributeBinding = z.object({
  attribute: Property,
  instanceCount: InstanceCount,
})

// This is defined separately to allow z.infer-ence
const AttributeBindingArr = AttributeBinding.array()

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

export const AttributesResponse = z.object({
  // ignoring head
  results: z.object({
    bindings: AttributeBindingArr,
    distinct: z.boolean(),
    ordered: z.boolean(),
  }),
})

export type StoreNode = {
  position: {
    x: number
    y: number
    fx?: number
    fy?: number
    vx?: number
    vy?: number
  }
  id: string
  type: string
  data: {
    node: z.infer<typeof NodeBinding>
    labels: z.infer<typeof Labels>
    attributes: z.infer<typeof AttributeBindingArr>
  }
}

export type StoreEdge = {
  id: string
  source: string
  target: string
  uri: string
  data: z.infer<typeof EdgeBinding>
  type?: string
  markerEnd?: MarkerType
}
