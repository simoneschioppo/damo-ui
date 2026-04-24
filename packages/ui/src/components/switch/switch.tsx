'use client'

import * as SwitchPrimitive from '@radix-ui/react-switch'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../../lib/cn'

/**
 * Switch — minimalist Memphis toggle.
 *
 * OFF: square plum knob on the left (dark), ivory track.
 * ON:  ivory square knob on the right, gold track.
 *
 * Matches the Damo UI design system spec: no pill track, thick black border,
 * knob is a square (not a circle) with a physical-click feel.
 */
export const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(function Switch({ className, ...rest }, ref) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        'relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center',
        'border-2 border-border-memphis rounded-none bg-surface',
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
          'pointer-events-none block h-5 w-5',
          'rounded-none bg-plum-900',
          'border-2 border-border-memphis',
          'data-[state=checked]:bg-paper-50',
          'translate-x-0.5 transition-transform duration-fast',
          // Checked distance scales with --spacing so thumb lands flush
          // against the right inner edge at every density (compact/normal/comfy).
          // Track inner width (w-14 minus 2×2px border) minus thumb (w-5) minus
          // 2×unchecked offset (0.5*spacing) equals (8.5 * spacing − 4px).
          'data-[state=checked]:translate-x-[calc(var(--spacing)*8.5-4px)]',
        )}
      />
    </SwitchPrimitive.Root>
  )
})
