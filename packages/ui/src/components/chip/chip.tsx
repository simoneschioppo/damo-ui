import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { chipVariants, type ChipVariants } from './chip.variants'

export interface ChipProps extends HTMLAttributes<HTMLSpanElement>, ChipVariants {}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { className, variant, size, ...rest },
  ref,
) {
  return <span ref={ref} className={cn(chipVariants({ variant, size }), className)} {...rest} />
})
