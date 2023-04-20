<template>
  <button
    :class="[
      'p-2 m-1 transition-all cursor-pointer group relative overflow-visible',
      'text-white',
      button({ expand, active, intent }),
    ]"
    @click="emits('click')"
  >
    <slot></slot>
    <span
      v-if="tooltip"
      class="group-hover:opacity-100 hidden group-hover:block transition-opacity bg-gray-600 text-sm text-gray-100 rounded-md absolute opacity-0 p-1 z-50 w-max max-w-xs"
      :class="tooltipCva({ tooltipPosition })"
    >
      {{ tooltip }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const emits = defineEmits(['click'])

defineProps<{
  tooltip?: string
  intent?: ButtonProps['intent']
  expand?: ButtonProps['expand']
  active?: ButtonProps['active']
  tooltipPosition?: TooltipProps['tooltipPosition']
}>()

type ButtonProps = Required<VariantProps<typeof button>>
type TooltipProps = Required<VariantProps<typeof tooltipCva>>

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

const button = cva('button', {
  variants: {
    intent: {
      primary: 'rounded-md',
      tab: 'rounded-t-md',
    },
    expand: {
      true: 'hover:m-0 hover:p-3',
      false: '',
    },
    active: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { intent: 'primary', active: true, class: 'bg-amber-700' },
    { intent: 'primary', active: false, class: 'bg-amber-600 hover:bg-amber-700' },
    { intent: 'tab', active: true, class: 'bg-amber-700' },
    { intent: 'tab', active: false, class: 'bg-slate-500 hover:bg-slate-700' },
  ],
  defaultVariants: {
    intent: 'primary',
    expand: true,
    active: false,
  },
})
</script>
