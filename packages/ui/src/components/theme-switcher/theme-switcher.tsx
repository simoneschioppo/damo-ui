'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { usePersistedAttr } from '../../hooks/use-persisted-attr'

export interface ThemeOption {
  value: string
  label: string
}

export interface ThemeSwitcherProps extends HTMLAttributes<HTMLDivElement> {
  /** Options to render as buttons. Defaults to Light/Dark. */
  options?: ReadonlyArray<ThemeOption>
  /** localStorage key for persistence. */
  storageKey?: string
  /** HTML attribute mirrored on `<html>`. */
  attribute?: string
  /** Default value when nothing is persisted. */
  defaultValue?: string
}

const DEFAULT_OPTIONS: ReadonlyArray<ThemeOption> = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

/**
 * ThemeSwitcher — button group that toggles an HTML data attribute and
 * persists the value in localStorage. Composes `usePersistedAttr`.
 */
export const ThemeSwitcher = forwardRef<HTMLDivElement, ThemeSwitcherProps>(
  function ThemeSwitcher(
    {
      options = DEFAULT_OPTIONS,
      storageKey = 'theme',
      attribute = 'data-theme',
      defaultValue = 'light',
      className,
      ...rest
    },
    ref,
  ) {
    const [current, setCurrent] = usePersistedAttr<string>(storageKey, attribute, defaultValue)

    return (
      <div
        ref={ref}
        className={cn('inline-flex gap-2 items-center', className)}
        {...rest}
      >
        <span className="eyebrow">Theme</span>
        <div className="inline-flex border-2 border-memphis">
          {options.map((opt) => {
            const isActive = current === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCurrent(opt.value)}
                className={cn(
                  'px-3 py-1.5 text-[13px] font-semibold capitalize cursor-pointer border-0',
                  isActive ? 'bg-secondary text-secondary-foreground' : 'bg-card text-card-foreground',
                )}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>
    )
  },
)
