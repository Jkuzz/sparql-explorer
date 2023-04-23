<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

defineProps<{
  tooltip?: string
  tooltipPosition?: TooltipProps['tooltipPosition']
}>()
</script>

<script lang="ts">
export type TooltipProps = Required<VariantProps<typeof tooltipCva>>

const tooltipCva = cva('tooltip', {
  variants: {
    tooltipPosition: {
      top: '-top-8 left-0 ',
      bottom: '-bottom-8 right-0 origin-right',
    },
  },
  defaultVariants: {
    tooltipPosition: 'top',
  },
})
</script>

<template>
  <span
    class="group-hover:opacity-100 hidden group-hover:block transition-opacity bg-slate-600 text-sm text-gray-100 rounded-md absolute opacity-0 p-1 z-50 w-max max-w-xs"
    :class="tooltipCva({ tooltipPosition })"
  >
    <slot></slot>
  </span>
</template>
