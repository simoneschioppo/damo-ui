'use client'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from 'react'
import { cn } from '../../lib/cn'
import { selectionChromeClasses } from '../../lib/selection-chrome'
import { CheckIcon, ChevronRightIcon } from '../../icons'

// Selection chrome shared with NavItem (`aria-current="page"`). Mirrors the
// same recipe so persistent selection reads consistently across the library
// (sidebar entries, settings menus, etc.). Bar inset is `1` (not `-2px` like
// NavItem) because Content has `overflow-hidden` and a bleeding bar would
// be clipped. Source of truth: `packages/ui/src/lib/selection-chrome.ts`.
const radioItemSelectionChrome = selectionChromeClasses({
  gate: 'data-[state=checked]',
  radiusToken: 'rounded-selection',
  gradientFrom: 'var(--primary)',
  gradientFromMix: 18,
  gradientTo: 'var(--secondary)',
  gradientToMix: 10,
  outlineToken: 'var(--primary)',
  outlineMix: 30,
  barColor: 'bg-primary',
  barInset: '1',
  barTop: '1.5',
  barBottom: '1.5',
})

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuGroup = DropdownMenuPrimitive.Group
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal
export const DropdownMenuSub = DropdownMenuPrimitive.Sub
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(function DropdownMenuContent({ className, sideOffset = 6, ...rest }, ref) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-dropdown min-w-[10rem] overflow-hidden bg-popover text-popover-foreground',
          'border-2 border-memphis rounded-none shadow-memphis',
          'p-2',
          className,
        )}
        {...rest}
      />
    </DropdownMenuPortal>
  )
})

const itemBaseClass = cn(
  'relative flex select-none items-center gap-2',
  'px-2.5 py-1.5 text-[13px] font-body font-medium rounded-none outline-none cursor-pointer',
  'transition-colors duration-snap ease-memphis',
  // Hover/focus highlight: a soft tint instead of the previous solid
  // bg-secondary slab. The slab fought visually with the new outlined
  // selection chrome on radio items, and read as too aggressive even on
  // plain Items where it was originally intended for keyboard a11y only.
  'focus:bg-foreground/5 focus:text-foreground',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
)

export const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }
>(function DropdownMenuItem({ className, inset, ...rest }, ref) {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(itemBaseClass, inset && 'pl-8', className)}
      {...rest}
    />
  )
})

export const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(function DropdownMenuCheckboxItem({ className, children, checked, ...rest }, ref) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(itemBaseClass, 'pl-8 pr-2', className)}
      {...rest}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon size={14} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
})

export const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(function DropdownMenuRadioItem({ className, children, ...rest }, ref) {
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        itemBaseClass,
        'pl-8 pr-2',
        'data-[state=checked]:text-foreground',
        ...radioItemSelectionChrome,
        className,
      )}
      {...rest}
    >
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
})

export const DropdownMenuLabel = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }
>(function DropdownMenuLabel({ className, inset, ...rest }, ref) {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        'px-2.5 pt-2 pb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-primary',
        inset && 'pl-8',
        className,
      )}
      {...rest}
    />
  )
})

export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(function DropdownMenuSeparator({ className, ...rest }, ref) {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn('my-1.5 h-px bg-memphis', className)}
      {...rest}
    />
  )
})

export function DropdownMenuShortcut({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('ml-auto text-xs text-muted-foreground font-mono tracking-wider', className)}
      {...rest}
    />
  )
}

export const DropdownMenuSubTrigger = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }
>(function DropdownMenuSubTrigger({ className, inset, children, ...rest }, ref) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        itemBaseClass,
        'data-[state=open]:bg-secondary data-[state=open]:text-secondary-foreground',
        inset && 'pl-8',
        className,
      )}
      {...rest}
    >
      {children}
      <ChevronRightIcon size={14} className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  )
})

export const DropdownMenuSubContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(function DropdownMenuSubContent({ className, ...rest }, ref) {
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        'z-dropdown min-w-[8rem] overflow-hidden bg-popover text-popover-foreground',
        'border-2 border-memphis rounded-none shadow-memphis p-2',
        className,
      )}
      {...rest}
    />
  )
})
