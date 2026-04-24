'use client'

import { forwardRef, type LabelHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...rest },
  ref,
) {
  return (
    <label
      ref={ref}
      className={cn(
        'text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...rest}
    />
  )
})
