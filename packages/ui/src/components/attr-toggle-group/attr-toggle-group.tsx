'use client'

import { forwardRef, useId, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select/select'
import { useSanitizedPersistedAttr } from './use-sanitized-persisted-attr'

export interface AttrToggleOption {
  value: string
  label: string
}

export type AttrToggleGroupVariant = 'segmented' | 'select'

export interface AttrToggleGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Caller-provided options. Required; no implicit default set. */
  options: ReadonlyArray<AttrToggleOption>
  /** localStorage key used to persist the active value. */
  storageKey: string
  /** `data-*` attribute mirrored on `<html>`. Validated by `usePersistedAttr`. */
  attribute: string
  /** Initial value when nothing is persisted. Falls back to `options[0].value`. */
  defaultValue?: string
  /** Optional eyebrow label rendered before the control. */
  label?: string
  /** Visual layout. `segmented` is a button row; `select` is the design-system Select. */
  variant?: AttrToggleGroupVariant
  /** Optional explicit id for the eyebrow label (otherwise generated via useId). */
  labelId?: string
}

/**
 * AttrToggleGroup — a generic toggle bound to a `data-*` attribute on `<html>`
 * and a `localStorage` key. Sanitises stale persisted values back to the
 * configured default. Two variants:
 *
 *  - `segmented`: a Memphis-bordered button row (default).
 *  - `select`: a design-system Select dropdown.
 *
 * Used as the base primitive for `ThemeSwitcher`, `PaletteSwitcher` and
 * `DensitySwitcher`.
 */
export const AttrToggleGroup = forwardRef<HTMLDivElement, AttrToggleGroupProps>(
  function AttrToggleGroup(
    {
      options,
      storageKey,
      attribute,
      defaultValue,
      label,
      variant = 'segmented',
      labelId: labelIdProp,
      className,
      ...rest
    },
    ref,
  ) {
    const fallback = defaultValue ?? options[0]?.value ?? ''
    const reactId = useId()
    const labelId = labelIdProp ?? `${reactId}-label`

    const [current, setCurrent] = useSanitizedPersistedAttr(
      options,
      storageKey,
      attribute,
      fallback,
    )

    return (
      <div ref={ref} className={cn('inline-flex gap-2 items-center', className)} {...rest}>
        {label ? (
          <span className="eyebrow" id={labelId}>
            {label}
          </span>
        ) : null}

        {variant === 'segmented' ? (
          <div
            role="group"
            aria-labelledby={label ? labelId : undefined}
            className="inline-flex border-2 border-memphis rounded-none"
          >
            {options.map((opt) => {
              const isActive = current === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setCurrent(opt.value)}
                  className={cn(
                    'px-3 py-1.5 text-[13px] font-semibold capitalize cursor-pointer border-0',
                    isActive
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-card text-card-foreground',
                  )}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        ) : (
          <Select value={current} onValueChange={setCurrent}>
            <SelectTrigger
              aria-labelledby={label ? labelId : undefined}
              className="h-auto w-auto min-w-[9rem] py-1.5 text-[13px] font-semibold"
            >
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
        )}
      </div>
    )
  },
)
