'use client'

import { Command as CommandPrimitive } from 'cmdk'
import { forwardRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useI18n } from '../../lib/i18n'
import { Popover, PopoverTrigger, PopoverContent } from '../popover/popover'
import { ChevronDownIcon, CheckIcon, SearchIcon } from '../../icons'

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: ReactNode
  searchPlaceholder?: string
  emptyMessage?: ReactNode
  disabled?: boolean
  id?: string
  className?: string
}

export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(function Combobox(
  {
    options,
    value,
    defaultValue,
    onValueChange,
    placeholder,
    searchPlaceholder,
    emptyMessage,
    disabled,
    id,
    className,
  },
  ref,
) {
  const i18n = useI18n()
  const resolvedPlaceholder = placeholder ?? i18n.combobox.placeholder
  const resolvedSearchPlaceholder = searchPlaceholder ?? i18n.combobox.searchPlaceholder
  const resolvedEmptyMessage = emptyMessage ?? i18n.combobox.emptyMessage
  const [open, setOpen] = useState(false)
  const [internal, setInternal] = useState<string | undefined>(defaultValue)
  const selected = value ?? internal

  const selectedOption = options.find((o) => o.value === selected)

  function handleSelect(nextValue: string) {
    if (value === undefined) setInternal(nextValue)
    onValueChange?.(nextValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={ref}
          id={id}
          type="button"
          disabled={disabled}
          aria-expanded={open}
          className={cn(
            'inline-flex h-10 w-full items-center justify-between gap-2',
            'px-3 py-2 text-base text-foreground text-left',
            'bg-card border-2 border-memphis rounded-none',
            'transition-colors duration-fast cursor-pointer',
            'hover:bg-muted',
            // Primary-tinted Memphis shadow on focus (see #66 for the per-color
            // utilities that replaced the broken inherited-var recipe).
            'focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-memphis-primary',
            'disabled:opacity-50 disabled:pointer-events-none',
            !selectedOption && 'text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : resolvedPlaceholder}
          </span>
          <ChevronDownIcon size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <CommandPrimitive className={cn('flex h-full w-full flex-col overflow-hidden')}>
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <SearchIcon size={16} />
            <CommandPrimitive.Input
              placeholder={resolvedSearchPlaceholder}
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-sm"
            />
          </div>
          <CommandPrimitive.List className="max-h-60 overflow-y-auto p-1">
            <CommandPrimitive.Empty className="py-4 text-center text-sm text-muted-foreground">
              {resolvedEmptyMessage}
            </CommandPrimitive.Empty>
            {options.map((o) => (
              <CommandPrimitive.Item
                key={o.value}
                value={o.value}
                disabled={o.disabled}
                onSelect={() => handleSelect(o.value)}
                className={cn(
                  'relative flex cursor-pointer select-none items-center',
                  'py-1.5 pl-8 pr-2 text-sm outline-none rounded-sm',
                  'data-[selected=true]:bg-muted',
                  'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
                )}
              >
                {selected === o.value && (
                  <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                    <CheckIcon size={14} />
                  </span>
                )}
                {o.label}
              </CommandPrimitive.Item>
            ))}
          </CommandPrimitive.List>
        </CommandPrimitive>
      </PopoverContent>
    </Popover>
  )
})
