import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../../lib/cn'
import { CheckIcon } from '../../icons'

export const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(function Checkbox({ className, ...rest }, ref) {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center shrink-0',
        'h-5 w-5 border-base border-border-memphis bg-surface',
        'transition-colors duration-fast cursor-pointer',
        'hover:bg-surface-2',
        'data-[state=checked]:bg-plum-900 data-[state=checked]:text-paper-50',
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
})
