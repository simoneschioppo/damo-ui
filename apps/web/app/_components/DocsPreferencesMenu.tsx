'use client'

import { useEffect } from 'react'
import { useTranslations, useLocale as useIntlLocale } from 'next-intl'
import {
  CogIcon,
  IconButton,
  type Locale,
  NavItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePersistedAttr,
} from '@damo/ui'
import { usePersistedLocale } from '../../lib/usePersistedLocale'

const THEME_VALUES = ['light', 'dark'] as const
const PALETTE_VALUES = ['default', 'sunset', 'cyberpunk', 'forest'] as const
const DENSITY_VALUES = ['compact', 'normal', 'comfortable'] as const
const LANGUAGE_VALUES: ReadonlyArray<Locale> = ['en', 'it']

function isAppLocale(value: string): value is Locale {
  return value === 'en' || value === 'it'
}

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
  const t = useTranslations('preferences')
  const rawLocale = useIntlLocale()
  const initialLocale: Locale = isAppLocale(rawLocale) ? rawLocale : 'en'

  const [theme, setTheme] = usePersistedAttr<'light' | 'dark'>('theme', 'data-theme', 'light')
  const [palette, setPalette] = usePersistedAttr<'default' | 'sunset' | 'cyberpunk' | 'forest'>(
    'palette',
    'data-palette',
    'default',
  )
  const [density, setDensity] = usePersistedAttr<'compact' | 'normal' | 'comfortable'>(
    'density',
    'data-density',
    'normal',
  )
  const [locale, setLocale] = usePersistedLocale(initialLocale)

  const themeOptions = THEME_VALUES.map((value) => ({
    value,
    label: t(`theme.options.${value}`),
  }))
  const paletteOptions = PALETTE_VALUES.map((value) => ({
    value,
    label: t(`palette.options.${value}`),
  }))
  const densityOptions = DENSITY_VALUES.map((value) => ({
    value,
    label: t(`density.options.${value}`),
  }))
  const languageOptions = LANGUAGE_VALUES.map((value) => ({
    value,
    label: t(`language.options.${value}`),
  }))

  // Sanitisation — if a previously persisted value is no longer in options
  // (e.g. a renamed palette), reset to the default so the live attribute and
  // localStorage converge on a known good value.
  useEffect(() => {
    if (!THEME_VALUES.includes(theme)) setTheme('light')
  }, [theme, setTheme])
  useEffect(() => {
    if (!PALETTE_VALUES.includes(palette)) setPalette('default')
  }, [palette, setPalette])
  useEffect(() => {
    if (!DENSITY_VALUES.includes(density)) setDensity('normal')
  }, [density, setDensity])

  function handleLocaleChange(next: Locale) {
    setLocale(next)
    // The locale is read server-side from the cookie on the next request.
    // Reload so RSC chrome (nav, sidebar group titles) re-renders in the
    // newly chosen language without a stale flash.
    if (typeof window !== 'undefined') window.location.reload()
  }

  return (
    <div data-density="compact" className="inline-flex">
      <Popover>
        <PopoverTrigger asChild>
          <IconButton aria-label={t('trigger')} variant="ghost">
            <CogIcon size={18} />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[16rem]">
          <div className="flex flex-col gap-4">
            <PrefGroup
              label={t('language.label')}
              options={languageOptions}
              current={locale}
              onSelect={handleLocaleChange}
            />
            <PrefGroup
              label={t('theme.label')}
              options={themeOptions}
              current={theme}
              onSelect={setTheme}
            />
            <PrefGroup
              label={t('palette.label')}
              options={paletteOptions}
              current={palette}
              onSelect={setPalette}
            />
            <PrefGroup
              label={t('density.label')}
              options={densityOptions}
              current={density}
              onSelect={setDensity}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
