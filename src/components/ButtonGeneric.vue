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
    <TooltipGeneric
      v-if="tooltip"
      :tooltip-position="tooltipPosition"
    >
      {{ tooltip }}
    </TooltipGeneric>
  </button>
</template>

<script setup lang="ts">
import TooltipGeneric from '@/components/TooltipGeneric.vue'
import type { TooltipProps } from '@/components/TooltipGeneric.vue'
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
