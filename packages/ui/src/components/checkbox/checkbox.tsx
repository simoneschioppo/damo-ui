'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../../lib/cn'
import { CheckIcon } from '../../icons'

export type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>

export const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  function Checkbox({ className, ...rest }, ref) {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center shrink-0',
          'h-5 w-5 border-2 border-memphis rounded-none bg-card',
          'transition-colors duration-fast cursor-pointer',
          'hover:bg-muted',
          'data-[state=checked]:bg-foreground data-[state=checked]:text-background',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:opacity-50 disabled:pointer-events-none',
          className,
        )}
        {...rest}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
          <CheckIcon size={14} strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )
  },
)
