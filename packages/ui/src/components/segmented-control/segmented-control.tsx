'use client'

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../../lib/cn'

type ToggleGroupSingleRootProps = Extract<
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
  { type: 'single' }
>

export interface SegmentedControlProps extends Omit<
  ToggleGroupSingleRootProps,
  'type' | 'orientation'
> {
  orientation?: 'horizontal' | 'vertical'
}

export const SegmentedControl = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Root>,
  SegmentedControlProps
>(function SegmentedControl({ className, orientation = 'horizontal', ...rest }, ref) {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      type="single"
      orientation={orientation}
      className={cn(
        'inline-flex border-2 border-memphis rounded-none bg-card',
        'data-[orientation=vertical]:flex-col',
        className,
      )}
      {...rest}
    />
  )
})

export const SegmentedControlItem = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(function SegmentedControlItem({ className, ...rest }, ref) {
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold',
        'cursor-pointer text-muted-foreground',
        'transition-colors duration-fast',
        'hover:bg-muted hover:text-foreground',
        'data-[state=on]:bg-foreground data-[state=on]:text-background',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
        'disabled:opacity-50 disabled:pointer-events-none',
        'not-first:border-l-2 not-first:border-l-memphis',
        'data-[orientation=vertical]:not-first:border-l-0 data-[orientation=vertical]:not-first:border-t-2 data-[orientation=vertical]:not-first:border-t-memphis',
        className,
      )}
      {...rest}
    />
  )
})
