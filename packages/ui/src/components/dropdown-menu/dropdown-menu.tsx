'use client'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from 'react'
import { cn } from '../../lib/cn'
import { CheckIcon, ChevronRightIcon } from '../../icons'

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
          'z-dropdown min-w-[10rem] overflow-hidden bg-card text-foreground',
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
  'focus:bg-secondary focus:text-secondary-foreground',
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
        // Selected radio item: subtle gradient + 1px inset outline + 3px
        // ::before bar pinned to the inner left edge. Mirrors the NavItem
        // selection chrome so persistent selection reads consistently across
        // the library (sidebar entries, settings menus, etc.).
        'data-[state=checked]:text-foreground',
        'data-[state=checked]:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_18%,transparent),color-mix(in_oklab,var(--secondary)_10%,transparent))]',
        'data-[state=checked]:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_30%,transparent)]',
        'data-[state=checked]:before:content-[""] data-[state=checked]:before:absolute',
        // Bar sits inside the menu panel (overflow-hidden), so we keep it
        // flush at left-1 instead of bleeding outwards like NavItem does.
        'data-[state=checked]:before:left-1 data-[state=checked]:before:top-1.5 data-[state=checked]:before:bottom-1.5',
        'data-[state=checked]:before:w-[3px] data-[state=checked]:before:rounded-[2px]',
        'data-[state=checked]:before:bg-primary',
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
        'z-dropdown min-w-[8rem] overflow-hidden bg-card text-foreground',
        'border-2 border-memphis rounded-none shadow-memphis p-2',
        className,
      )}
      {...rest}
    />
  )
})
