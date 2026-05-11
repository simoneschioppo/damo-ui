'use client'

import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from 'react'
import { cn } from '../../lib/cn'
import { CheckIcon, ChevronRightIcon } from '../../icons'

export const ContextMenu = ContextMenuPrimitive.Root
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger
export const ContextMenuGroup = ContextMenuPrimitive.Group
export const ContextMenuPortal = ContextMenuPrimitive.Portal
export const ContextMenuSub = ContextMenuPrimitive.Sub
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

export const ContextMenuContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(function ContextMenuContent({ className, ...rest }, ref) {
  return (
    <ContextMenuPortal>
      <ContextMenuPrimitive.Content
        ref={ref}
        className={cn(
          'z-dropdown min-w-[10rem] overflow-hidden bg-popover text-popover-foreground',
          // Memphis chrome — matches DropdownMenu/Popover/Select/Dialog
          'border-2 border-memphis rounded-none shadow-memphis p-2',
          className,
        )}
        {...rest}
      />
    </ContextMenuPortal>
  )
})

const itemBaseClass = cn(
  'relative flex select-none items-center gap-2',
  'px-2.5 py-1.5 text-[13px] font-body font-medium rounded-none outline-none cursor-pointer',
  'transition-colors duration-snap ease-memphis',
  'focus:bg-foreground/5 focus:text-foreground',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
)

export const ContextMenuItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & { inset?: boolean }
>(function ContextMenuItem({ className, inset, ...rest }, ref) {
  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      className={cn(itemBaseClass, inset && 'pl-8', className)}
      {...rest}
    />
  )
})

export const ContextMenuCheckboxItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(function ContextMenuCheckboxItem({ className, children, checked, ...rest }, ref) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(itemBaseClass, 'pl-8 pr-2', className)}
      {...rest}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon size={14} />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
})

export const ContextMenuRadioItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(function ContextMenuRadioItem({ className, children, ...rest }, ref) {
  return (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      className={cn(itemBaseClass, 'pl-8 pr-2', className)}
      {...rest}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <span className="h-2 w-2 rounded-full bg-secondary" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
})

export const ContextMenuLabel = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & { inset?: boolean }
>(function ContextMenuLabel({ className, inset, ...rest }, ref) {
  return (
    <ContextMenuPrimitive.Label
      ref={ref}
      className={cn(
        'px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground',
        inset && 'pl-8',
        className,
      )}
      {...rest}
    />
  )
})

export const ContextMenuSeparator = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(function ContextMenuSeparator({ className, ...rest }, ref) {
  return (
    <ContextMenuPrimitive.Separator
      ref={ref}
      className={cn('my-1 h-px bg-border', className)}
      {...rest}
    />
  )
})

export function ContextMenuShortcut({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('ml-auto text-xs text-muted-foreground font-mono tracking-wider', className)}
      {...rest}
    />
  )
}

export const ContextMenuSubTrigger = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & { inset?: boolean }
>(function ContextMenuSubTrigger({ className, inset, children, ...rest }, ref) {
  return (
    <ContextMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        itemBaseClass,
        'data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground',
        inset && 'pl-8',
        className,
      )}
      {...rest}
    >
      {children}
      <ChevronRightIcon size={14} className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  )
})

export const ContextMenuSubContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(function ContextMenuSubContent({ className, ...rest }, ref) {
  return (
    <ContextMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        'z-dropdown min-w-[8rem] overflow-hidden bg-popover text-popover-foreground',
        // Memphis chrome — matches Content above + DropdownMenu SubContent
        'border-2 border-memphis rounded-none shadow-memphis p-2',
        className,
      )}
      {...rest}
    />
  )
})
