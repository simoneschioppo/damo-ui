'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { badgeVariants, type BadgeVariants } from './badge.variants'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, BadgeVariants {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, ...rest },
  ref,
) {
  return <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...rest} />
})
