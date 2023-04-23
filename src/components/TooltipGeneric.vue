<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

defineProps<{
  tooltip?: string
  verticalPosition?: TooltipProps['verticalPosition']
  horizontalPosition?: TooltipProps['horizontalPosition']
}>()
</script>

<script lang="ts">
export type TooltipProps = Required<VariantProps<typeof tooltipCva>>

const tooltipCva = cva('tooltip', {
  variants: {
    verticalPosition: {
      top: '-top-8',
      bottom: '-bottom-8',
    },
    horizontalPosition: {
      left: 'right-0 origin-right',
      right: 'left-0',
    },
  },
  defaultVariants: {
    verticalPosition: 'top',
    horizontalPosition: 'right',
  },
})
</script>

<template>
  <span
    class="group-hover:opacity-100 hidden group-hover:block transition-opacity bg-slate-600 text-sm text-gray-100 rounded-md absolute opacity-0 p-1 z-50 w-max max-w-xs md:max-w-md"
    :class="tooltipCva({ verticalPosition, horizontalPosition })"
  >
    <slot></slot>
  </span>
</template>
