'use client'

import { forwardRef, useEffect, useMemo, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { usePersistedAttr } from '../../hooks/use-persisted-attr'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select/select'

export interface PaletteOption {
  value: string
  label: string
}

export interface PaletteSwitcherProps extends HTMLAttributes<HTMLDivElement> {
  /** Caller-provided options. Required; no implicit default set. */
  options: ReadonlyArray<PaletteOption>
  /** Initial value when nothing is persisted. Defaults to the first option. */
  defaultValue?: string
  /** localStorage key for persistence. */
  storageKey?: string
  /** HTML attribute mirrored on `<html>`. */
  attribute?: string
}

/**
 * PaletteSwitcher — design-system Select that toggles an HTML data attribute
 * and persists the value in localStorage. Sanitizes unknown persisted values
 * back to `defaultValue` so the dropdown never shows a stale option.
 */
export const PaletteSwitcher = forwardRef<HTMLDivElement, PaletteSwitcherProps>(
  function PaletteSwitcher(
    {
      options,
      defaultValue,
      storageKey = 'palette',
      attribute = 'data-palette',
      className,
      ...rest
    },
    ref,
  ) {
    const fallback = defaultValue ?? options[0]?.value ?? ''
    const validValues = useMemo(() => new Set(options.map((o) => o.value)), [options])

    const [current, setCurrent] = usePersistedAttr<string>(storageKey, attribute, fallback)

    useEffect(() => {
      if (!validValues.has(current)) setCurrent(fallback)
    }, [current, fallback, validValues, setCurrent])

    return (
      <div ref={ref} className={cn('inline-flex gap-2 items-center', className)} {...rest}>
        <span className="eyebrow">Palette</span>
        <Select value={current} onValueChange={setCurrent}>
          <SelectTrigger className="h-auto w-auto min-w-[9rem] py-1.5 text-[13px] font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  },
)
