'use client'

import { useState, forwardRef, type ReactNode } from 'react'
import { DayPicker, type DayPickerProps } from 'react-day-picker'
import { format } from 'date-fns'
import 'react-day-picker/style.css'
import { Popover, PopoverTrigger, PopoverContent } from '../popover/popover'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '../../icons'
import { cn } from '../../lib/cn'
import { useI18n } from '../../lib/i18n'

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
    placeholder,
    formatStr = 'PPP',
    disabled,
    id,
    className,
    triggerClassName,
    ...dayPickerProps
  },
  ref,
) {
  const i18n = useI18n()
  const dateFnsLocale = i18n.datePicker.dateFnsLocale
  const resolvedPlaceholder = placeholder ?? i18n.datePicker.placeholder
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
              'px-3 py-2 text-base text-foreground text-left',
              'bg-card border-2 border-memphis rounded-none',
              'transition-colors duration-fast cursor-pointer',
              'hover:bg-muted',
              'focus-visible:outline-none focus-visible:border-primary focus-visible:[--memphis-shadow-color:var(--primary)] focus-visible:shadow-memphis',
              'disabled:opacity-50 disabled:pointer-events-none',
              !selected && 'text-muted-foreground',
              triggerClassName,
            )}
          >
            <span>
              {selected ? format(selected, formatStr, { locale: dateFnsLocale }) : resolvedPlaceholder}
            </span>
            <CalendarIcon size={16} className="shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            locale={dateFnsLocale}
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
