import * as SwitchPrimitive from '@radix-ui/react-switch'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../../lib/cn'

export const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(function Switch({ className, ...rest }, ref) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center',
        'border-base border-border-memphis bg-surface',
        'transition-colors duration-fast',
        'data-[state=checked]:bg-gold-500',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:opacity-50 disabled:pointer-events-none',
        className,
      )}
      {...rest}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block h-4 w-4',
          'bg-plum-900 border-0',
          'data-[state=checked]:bg-paper-50',
          'translate-x-0.5 transition-transform duration-fast',
          'data-[state=checked]:translate-x-[22px]',
        )}
      />
    </SwitchPrimitive.Root>
  )
})
