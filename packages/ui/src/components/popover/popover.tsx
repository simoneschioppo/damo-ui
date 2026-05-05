'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../../lib/cn'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverAnchor = PopoverPrimitive.Anchor
export const PopoverClose = PopoverPrimitive.Close

export const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(function PopoverContent(
  { className, align = 'center', sideOffset = 6, forceMount, ...rest },
  ref,
) {
  // When the consumer asks for `forceMount`, push it onto BOTH the Portal and
  // the Content. Without the Portal flag, Radix unmounts the Portal subtree on
  // close — which means children (e.g. an AttrToggleGroup whose persistence
  // hook needs to run on first paint) never mount until the popover opens.
  const portalForceMount = forceMount ? { forceMount: true as const } : null
  return (
    <PopoverPrimitive.Portal {...portalForceMount}>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        forceMount={forceMount}
        className={cn(
          'z-dropdown bg-card text-foreground',
          // Memphis chrome — same border + offset shadow language as
          // DropdownMenu / Dialog so popovers feel consistent. Consumers can
          // override per-instance via className.
          'border-2 border-memphis shadow-memphis rounded-none',
          'p-3 outline-none',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className,
        )}
        {...rest}
      />
    </PopoverPrimitive.Portal>
  )
})
