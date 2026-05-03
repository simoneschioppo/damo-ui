'use client'

import { forwardRef, useEffect, useId, useMemo, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { usePersistedAttr } from '../../hooks/use-persisted-attr'
import { CogIcon } from '../../icons'
import { IconButton } from '../icon-button/icon-button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '../dropdown-menu/dropdown-menu'

export interface DisplaySettingsOption {
  value: string
  label: string
}

export interface DisplaySettingsMenuProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  paletteOptions: ReadonlyArray<DisplaySettingsOption>
  paletteDefaultValue?: string
  paletteStorageKey?: string
  paletteAttribute?: string

  themeOptions?: ReadonlyArray<DisplaySettingsOption>
  themeDefaultValue?: string
  themeStorageKey?: string
  themeAttribute?: string

  densityOptions?: ReadonlyArray<DisplaySettingsOption>
  densityDefaultValue?: string
  densityStorageKey?: string
  densityAttribute?: string

  triggerLabel?: string
  themeLabel?: string
  paletteLabel?: string
  densityLabel?: string
}

const DEFAULT_THEME_OPTIONS: ReadonlyArray<DisplaySettingsOption> = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

const DEFAULT_DENSITY_OPTIONS: ReadonlyArray<DisplaySettingsOption> = [
  { value: 'compact', label: 'Compatta' },
  { value: 'normal', label: 'Normale' },
  { value: 'comfortable', label: 'Ampia' },
]

function useSanitizedPersistedAttr(
  options: ReadonlyArray<DisplaySettingsOption>,
  storageKey: string,
  attribute: string,
  fallback: string,
): readonly [string, (value: string) => void] {
  const validValues = useMemo(() => new Set(options.map((o) => o.value)), [options])
  const [value, setValue] = usePersistedAttr<string>(storageKey, attribute, fallback)

  useEffect(() => {
    if (!validValues.has(value)) setValue(fallback)
  }, [value, fallback, validValues, setValue])

  return [value, setValue] as const
}

/**
 * DisplaySettingsMenu — collapses Theme / Palette / Density controls into a
 * single icon-button trigger that opens a dropdown menu with three labelled
 * radio groups. Persists each axis with the same storage keys and `data-*`
 * attributes used by the legacy sibling switchers, so user preferences carry
 * over without migration.
 */
export const DisplaySettingsMenu = forwardRef<HTMLDivElement, DisplaySettingsMenuProps>(
  function DisplaySettingsMenu(
    {
      paletteOptions,
      paletteDefaultValue,
      paletteStorageKey = 'palette',
      paletteAttribute = 'data-palette',

      themeOptions = DEFAULT_THEME_OPTIONS,
      themeDefaultValue = 'light',
      themeStorageKey = 'theme',
      themeAttribute = 'data-theme',

      densityOptions = DEFAULT_DENSITY_OPTIONS,
      densityDefaultValue = 'normal',
      densityStorageKey = 'density',
      densityAttribute = 'data-density',

      triggerLabel = 'Display settings',
      themeLabel = 'Theme',
      paletteLabel = 'Palette',
      densityLabel = 'Density',

      className,
      ...rest
    },
    ref,
  ) {
    const paletteFallback = paletteDefaultValue ?? paletteOptions[0]?.value ?? ''

    const [theme, setTheme] = useSanitizedPersistedAttr(
      themeOptions,
      themeStorageKey,
      themeAttribute,
      themeDefaultValue,
    )
    const [palette, setPalette] = useSanitizedPersistedAttr(
      paletteOptions,
      paletteStorageKey,
      paletteAttribute,
      paletteFallback,
    )
    const [density, setDensity] = useSanitizedPersistedAttr(
      densityOptions,
      densityStorageKey,
      densityAttribute,
      densityDefaultValue,
    )

    const reactId = useId()
    const themeLabelId = `${reactId}-theme-label`
    const paletteLabelId = `${reactId}-palette-label`
    const densityLabelId = `${reactId}-density-label`

    return (
      <div
        ref={ref}
        data-component="display-settings-menu"
        className={cn('inline-flex items-center', className)}
        {...rest}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton variant="ghost" aria-label={triggerLabel}>
              <CogIcon size={18} />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[12rem]">
            <DropdownMenuLabel id={themeLabelId}>{themeLabel}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={setTheme}
              aria-labelledby={themeLabelId}
            >
              {themeOptions.map((opt) => (
                <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            <DropdownMenuLabel id={paletteLabelId}>{paletteLabel}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={palette}
              onValueChange={setPalette}
              aria-labelledby={paletteLabelId}
            >
              {paletteOptions.map((opt) => (
                <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            <DropdownMenuLabel id={densityLabelId}>{densityLabel}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={density}
              onValueChange={setDensity}
              aria-labelledby={densityLabelId}
            >
              {densityOptions.map((opt) => (
                <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  },
)
