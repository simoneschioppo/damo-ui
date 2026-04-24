'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type SkeletonProps = HTMLAttributes<HTMLDivElement>

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden bg-surface-2 rounded-md',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:bg-gradient-to-r before:from-transparent before:via-[color-mix(in_oklab,var(--ink)_6%,transparent)] before:to-transparent',
        'before:animate-[shimmer_1.5s_infinite]',
        className,
      )}
      {...rest}
    />
  )
})
