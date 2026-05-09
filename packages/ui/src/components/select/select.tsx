'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../../lib/cn'
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from '../../icons'

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

export const SelectTrigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(function SelectTrigger({ className, children, ...rest }, ref) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex h-10 w-full items-center justify-between gap-2',
        'px-3 py-2 text-base text-foreground',
        'bg-card border-2 border-memphis rounded-none',
        'transition-colors duration-fast cursor-pointer',
        'hover:bg-muted',
        'data-[placeholder]:text-muted-foreground',
        // Primary-tinted Memphis shadow on focus (see #66 for the per-color
        // utilities that replaced the broken inherited-var recipe).
        'focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-memphis-primary',
        'disabled:opacity-50 disabled:pointer-events-none',
        className,
      )}
      {...rest}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon size={16} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})

export const SelectScrollUpButton = forwardRef<
  ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(function SelectScrollUpButton({ className, ...rest }, ref) {
  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...rest}
    >
      <ChevronUpIcon size={14} />
    </SelectPrimitive.ScrollUpButton>
  )
})

export const SelectScrollDownButton = forwardRef<
  ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(function SelectScrollDownButton({ className, ...rest }, ref) {
  return (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...rest}
    >
      <ChevronDownIcon size={14} />
    </SelectPrimitive.ScrollDownButton>
  )
})

export const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(function SelectContent({ className, children, position = 'popper', ...rest }, ref) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        className={cn(
          'relative z-dropdown min-w-[8rem] overflow-hidden',
          'bg-popover text-popover-foreground',
          'border-2 border-memphis shadow-memphis rounded-none',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
          className,
        )}
        {...rest}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' && 'w-full min-w-[var(--radix-select-trigger-width)]',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
})

export const SelectLabel = forwardRef<
  ElementRef<typeof SelectPrimitive.Label>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(function SelectLabel({ className, ...rest }, ref) {
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn(
        'px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground',
        className,
      )}
      {...rest}
    />
  )
})

export const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(function SelectItem({ className, children, ...rest }, ref) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center',
        'py-1.5 pl-8 pr-2 text-sm outline-none',
        'focus:bg-muted focus:text-foreground',
        'data-[state=checked]:font-semibold',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...rest}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon size={14} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
})

export const SelectSeparator = forwardRef<
  ElementRef<typeof SelectPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(function SelectSeparator({ className, ...rest }, ref) {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn('my-1 h-px bg-border', className)}
      {...rest}
    />
  )
})
