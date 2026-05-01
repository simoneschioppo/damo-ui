'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { usePersistedAttr } from '../../hooks/use-persisted-attr'

export interface DensityOption {
  value: string
  label: string
}

export interface DensitySwitcherProps extends HTMLAttributes<HTMLDivElement> {
  options?: ReadonlyArray<DensityOption>
  storageKey?: string
  attribute?: string
  defaultValue?: string
}

const DEFAULT_OPTIONS: ReadonlyArray<DensityOption> = [
  { value: 'compact', label: 'Compatta' },
  { value: 'normal', label: 'Normale' },
  { value: 'comfortable', label: 'Ampia' },
]

export const DensitySwitcher = forwardRef<HTMLDivElement, DensitySwitcherProps>(
  function DensitySwitcher(
    {
      options = DEFAULT_OPTIONS,
      storageKey = 'density',
      attribute = 'data-density',
      defaultValue = 'normal',
      className,
      ...rest
    },
    ref,
  ) {
    const [current, setCurrent] = usePersistedAttr<string>(storageKey, attribute, defaultValue)

    return (
      <div ref={ref} className={cn('inline-flex gap-2 items-center', className)} {...rest}>
        <span className="eyebrow" id="density-switcher-label">
          Density
        </span>
        <div
          role="group"
          aria-labelledby="density-switcher-label"
          className="inline-flex border-2 border-memphis"
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
      </div>
    )
  },
)
