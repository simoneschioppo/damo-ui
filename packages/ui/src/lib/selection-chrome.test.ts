import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { selectionChromeClasses } from './selection-chrome'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * gh-61 — `selectionChromeClasses()` is the single source of truth for the
 * shared "selection chrome" recipe (rounded-selection radius + 135° tinted
 * gradient + 1px inset outline + 3px ::before accent bar) used by both
 * NavItem (aria-current=page) and DropdownMenuRadioItem (data-state=checked).
 *
 * These tests pin the helper's output to the literal class blocks that used
 * to live in the call-sites, so any drift surfaces here before it can sneak
 * into a snapshot or behavior diff.
 */

const NAV_ITEM_DEFAULT_OPTS = {
  gate: 'aria-[current=page]' as const,
  radiusToken: 'rounded-selection' as const,
  gradientFrom: 'var(--primary)',
  gradientFromMix: 18,
  gradientTo: 'var(--secondary)',
  gradientToMix: 10,
  outlineToken: 'var(--primary)',
  outlineMix: 30,
  barColor: 'bg-primary',
  barInset: '-2px',
  barTop: '2',
  barBottom: '2',
}

const NAV_ITEM_ON_DARK_OPTS = {
  gate: 'aria-[current=page]' as const,
  radiusToken: 'rounded-selection' as const,
  gradientFrom: 'var(--nav-on-dark-accent-strong)',
  gradientFromMix: 22,
  gradientTo: 'var(--nav-on-dark-accent)',
  gradientToMix: 12,
  outlineToken: 'var(--nav-on-dark-accent-strong)',
  outlineMix: 30,
  barColor: 'bg-[var(--nav-on-dark-accent-strong)]',
  barInset: '-2px',
  barTop: '2',
  barBottom: '2',
}

const RADIO_ITEM_OPTS = {
  gate: 'data-[state=checked]' as const,
  radiusToken: 'rounded-selection' as const,
  gradientFrom: 'var(--primary)',
  gradientFromMix: 18,
  gradientTo: 'var(--secondary)',
  gradientToMix: 10,
  outlineToken: 'var(--primary)',
  outlineMix: 30,
  barColor: 'bg-primary',
  barInset: '1',
  barTop: '1.5',
  barBottom: '1.5',
}

describe('selectionChromeClasses — shape & contract', () => {
  it('returns an array of exactly 11 class strings — guards against silent class creep', () => {
    // The recipe is fixed-shape: rounded + gradient + outline + 6 ::before
    // utilities (content/absolute/left/top/bottom/w/rounded/bg = 8) + the
    // bar color = 11 classes. Catching a length drift here prevents future
    // additions from sneaking in unverified.
    const out = selectionChromeClasses(NAV_ITEM_DEFAULT_OPTS)
    expect(Array.isArray(out)).toBe(true)
    expect(out).toHaveLength(11)
    out.forEach((cls) => expect(typeof cls).toBe('string'))
  })

  it('every class is gated on the supplied attribute selector', () => {
    const out = selectionChromeClasses(NAV_ITEM_DEFAULT_OPTS)
    out.forEach((cls) => {
      expect(cls.startsWith('aria-[current=page]:')).toBe(true)
    })
  })

  it('uses the data-[state=checked] gate for radio item options', () => {
    const out = selectionChromeClasses(RADIO_ITEM_OPTS)
    out.forEach((cls) => {
      expect(cls.startsWith('data-[state=checked]:')).toBe(true)
    })
  })
})

describe('selectionChromeClasses — NavItem default tone parity', () => {
  const out = selectionChromeClasses(NAV_ITEM_DEFAULT_OPTS).join(' ')

  it('emits the rounded-selection radius', () => {
    expect(out).toContain('aria-[current=page]:rounded-selection')
  })

  it('emits the 135° gradient with primary 18% / secondary 10% color-mix', () => {
    expect(out).toContain(
      'aria-[current=page]:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_18%,transparent),color-mix(in_oklab,var(--secondary)_10%,transparent))]',
    )
  })

  it('emits the 1px inset outline shadow tinted 30% with primary', () => {
    expect(out).toContain(
      'aria-[current=page]:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_30%,transparent)]',
    )
  })

  it('emits the ::before accent bar geometry (left -2px, top/bottom 2, w-3, rounded 2px)', () => {
    expect(out).toContain('aria-[current=page]:before:content-[""]')
    expect(out).toContain('aria-[current=page]:before:absolute')
    expect(out).toContain('aria-[current=page]:before:left-[-2px]')
    expect(out).toContain('aria-[current=page]:before:top-2')
    expect(out).toContain('aria-[current=page]:before:bottom-2')
    expect(out).toContain('aria-[current=page]:before:w-[3px]')
    expect(out).toContain('aria-[current=page]:before:rounded-[2px]')
    expect(out).toContain('aria-[current=page]:before:bg-primary')
  })
})

describe('selectionChromeClasses — NavItem onDark tone parity', () => {
  const out = selectionChromeClasses(NAV_ITEM_ON_DARK_OPTS).join(' ')

  it('emits the rounded-selection radius', () => {
    expect(out).toContain('aria-[current=page]:rounded-selection')
  })

  it('emits the gradient using --nav-on-dark-accent[-strong] tokens at 22%/12%', () => {
    expect(out).toContain(
      'aria-[current=page]:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--nav-on-dark-accent-strong)_22%,transparent),color-mix(in_oklab,var(--nav-on-dark-accent)_12%,transparent))]',
    )
  })

  it('emits the inset outline tinted 30% with --nav-on-dark-accent-strong', () => {
    expect(out).toContain(
      'aria-[current=page]:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--nav-on-dark-accent-strong)_30%,transparent)]',
    )
  })

  it('emits the ::before bar coloured by --nav-on-dark-accent-strong', () => {
    expect(out).toContain('aria-[current=page]:before:bg-[var(--nav-on-dark-accent-strong)]')
  })
})

describe('selectionChromeClasses — DropdownMenuRadioItem parity', () => {
  const out = selectionChromeClasses(RADIO_ITEM_OPTS).join(' ')

  it('emits the rounded-selection radius', () => {
    expect(out).toContain('data-[state=checked]:rounded-selection')
  })

  it('emits the same primary/secondary gradient as NavItem default', () => {
    expect(out).toContain(
      'data-[state=checked]:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_18%,transparent),color-mix(in_oklab,var(--secondary)_10%,transparent))]',
    )
  })

  it('emits the inset outline tinted 30% with primary', () => {
    expect(out).toContain(
      'data-[state=checked]:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_30%,transparent)]',
    )
  })

  it('emits the ::before bar at left-1, top-1.5, bottom-1.5 (overflow-hidden panel inset)', () => {
    expect(out).toContain('data-[state=checked]:before:content-[""]')
    expect(out).toContain('data-[state=checked]:before:absolute')
    expect(out).toContain('data-[state=checked]:before:left-1')
    expect(out).toContain('data-[state=checked]:before:top-1.5')
    expect(out).toContain('data-[state=checked]:before:bottom-1.5')
    expect(out).toContain('data-[state=checked]:before:w-[3px]')
    expect(out).toContain('data-[state=checked]:before:rounded-[2px]')
    expect(out).toContain('data-[state=checked]:before:bg-primary')
  })
})

describe('selectionChromeClasses — barInset polymorphism', () => {
  it('Tailwind arbitrary-value insets (e.g. "-2px") are wrapped in [...]', () => {
    const out = selectionChromeClasses(NAV_ITEM_DEFAULT_OPTS).join(' ')
    expect(out).toContain('before:left-[-2px]')
    expect(out).not.toContain('before:left--2px')
  })

  it('Tailwind spacing-scale insets (e.g. "1") are emitted bare', () => {
    const out = selectionChromeClasses(RADIO_ITEM_OPTS).join(' ')
    expect(out).toContain('before:left-1')
    expect(out).not.toContain('before:left-[1]')
  })

  it('fractional spacing-scale insets (e.g. "1.5") are emitted bare', () => {
    const out = selectionChromeClasses({ ...RADIO_ITEM_OPTS, barInset: '1.5' }).join(' ')
    expect(out).toContain('before:left-1.5')
    expect(out).not.toContain('before:left-[1.5]')
  })

  it('signed integer insets (e.g. "-1") are wrapped in [...] (treated as arbitrary)', () => {
    const out = selectionChromeClasses({ ...RADIO_ITEM_OPTS, barInset: '-1' }).join(' ')
    expect(out).toContain('before:left-[-1]')
  })

  it('CSS-variable insets (e.g. "var(--rail)") are wrapped in [...]', () => {
    const out = selectionChromeClasses({ ...RADIO_ITEM_OPTS, barInset: 'var(--rail)' }).join(' ')
    expect(out).toContain('before:left-[var(--rail)]')
  })

  it('leading-dot fractional insets (e.g. ".5") are emitted bare', () => {
    const out = selectionChromeClasses({ ...RADIO_ITEM_OPTS, barInset: '.5' }).join(' ')
    expect(out).toContain('before:left-.5')
    expect(out).not.toContain('before:left-[.5]')
  })
})

describe('selectionChromeClasses — barTop / barBottom polymorphism', () => {
  it('arbitrary barTop values (e.g. "-1") are wrapped in [...]', () => {
    const out = selectionChromeClasses({ ...RADIO_ITEM_OPTS, barTop: '-1' }).join(' ')
    expect(out).toContain('before:top-[-1]')
  })

  it('arbitrary barTop values with units (e.g. "1.5px") are wrapped in [...]', () => {
    const out = selectionChromeClasses({ ...RADIO_ITEM_OPTS, barTop: '1.5px' }).join(' ')
    expect(out).toContain('before:top-[1.5px]')
  })

  it('arbitrary barBottom values (e.g. "var(--gap)") are wrapped in [...]', () => {
    const out = selectionChromeClasses({ ...RADIO_ITEM_OPTS, barBottom: 'var(--gap)' }).join(' ')
    expect(out).toContain('before:bottom-[var(--gap)]')
  })

  it('spacing-scale barTop / barBottom stay bare', () => {
    const out = selectionChromeClasses(NAV_ITEM_DEFAULT_OPTS).join(' ')
    expect(out).toContain('before:top-2')
    expect(out).not.toContain('before:top-[2]')
    expect(out).toContain('before:bottom-2')
    expect(out).not.toContain('before:bottom-[2]')
  })
})

describe('selectionChromeClasses — barColor normalization (idempotency)', () => {
  it('strips an accidental leading "before:" so paste-from-source works', () => {
    const out = selectionChromeClasses({ ...RADIO_ITEM_OPTS, barColor: 'before:bg-primary' }).join(
      ' ',
    )
    expect(out).toContain('data-[state=checked]:before:bg-primary')
    expect(out).not.toContain('before:before:bg-primary')
  })

  it('does not double-prefix a bare bg- utility', () => {
    const out = selectionChromeClasses({ ...RADIO_ITEM_OPTS, barColor: 'bg-primary' }).join(' ')
    expect(out).toContain('data-[state=checked]:before:bg-primary')
    expect(out).not.toContain('before:before:bg-primary')
  })
})

describe('selectionChromeClasses — source-contract regression', () => {
  it('the NavItem variants source no longer hard-codes the 135deg gradient literal', () => {
    // After the refactor, the variants file should consume the helper rather
    // than pasting the gradient literal verbatim. Two literal copies of the
    // gradient in source = the recipe drifted; one copy = it lives in the
    // helper test fixture instead.
    const variantsSrc = readFileSync(
      resolve(__dirname, '../components/nav-item/nav-item.variants.ts'),
      'utf8',
    )
    const occurrences = (variantsSrc.match(/linear-gradient\(135deg/g) ?? []).length
    expect(occurrences).toBe(0)
  })

  it('the DropdownMenu source no longer hard-codes the 135deg gradient literal', () => {
    const dropdownSrc = readFileSync(
      resolve(__dirname, '../components/dropdown-menu/dropdown-menu.tsx'),
      'utf8',
    )
    const occurrences = (dropdownSrc.match(/linear-gradient\(135deg/g) ?? []).length
    expect(occurrences).toBe(0)
  })
})
