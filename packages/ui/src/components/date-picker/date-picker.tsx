'use client'

import { useState, forwardRef, type ReactNode } from 'react'
import { DayPicker, type DayPickerProps } from 'react-day-picker'
import { format } from 'date-fns'
import { it as itLocale } from 'date-fns/locale'
import 'react-day-picker/style.css'
import { Popover, PopoverTrigger, PopoverContent } from '../popover/popover'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons'
import { cn } from '../../lib/cn'

export interface DatePickerProps extends Omit<DayPickerProps, 'mode'> {
  value?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: ReactNode
  formatStr?: string
  disabled?: boolean
  id?: string
  className?: string
  triggerClassName?: string
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  {
    value,
    onValueChange,
    placeholder = 'Seleziona una data',
    formatStr = 'PPP',
    disabled,
    id,
    className,
    triggerClassName,
    ...dayPickerProps
  },
  ref,
) {
  const [open, setOpen] = useState(false)
  const [internal, setInternal] = useState<Date | undefined>(value)
  const selected = value ?? internal

  function handleSelect(next: Date | undefined) {
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
    if (next) setOpen(false)
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            id={id}
            type="button"
            disabled={disabled}
            className={cn(
              'inline-flex h-10 w-full items-center justify-between gap-2',
              'px-3 py-2 text-base text-ink text-left',
              'bg-surface border-2 border-border-memphis rounded-none',
              'transition-colors duration-fast cursor-pointer',
              'hover:bg-surface-2',
              'focus-visible:outline-none focus-visible:border-accent focus-visible:[--shadow-memphis-color:var(--gold-500)] focus-visible:shadow-memphis',
              'disabled:opacity-50 disabled:pointer-events-none',
              !selected && 'text-ink-muted',
              triggerClassName,
            )}
          >
            <span>
              {selected ? format(selected, formatStr, { locale: itLocale }) : placeholder}
            </span>
            <span aria-hidden="true">📅</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            locale={itLocale}
            showOutsideDays
            components={{
              Chevron: ({ orientation }) =>
                orientation === 'left' ? (
                  <ChevronLeftIcon size={16} />
                ) : (
                  <ChevronRightIcon size={16} />
                ),
            }}
            {...dayPickerProps}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
})
