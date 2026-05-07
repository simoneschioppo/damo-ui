import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Theme bridge coverage — runtime-propagation regression guards for the 11
 * PARTIAL-coverage journeys identified in the trace audit
 * (`_bmad-output/test-artifacts/traceability/traceability-matrix.md`).
 *
 * jsdom does not process external CSS, `@theme inline` directives, or
 * @utility blocks — `getComputedStyle` won't resolve Tailwind utilities
 * to runtime token values. The truer end-to-end runtime check is the
 * Playwright spec (`e2e/tests/scenarios/...`); this file is the cheap,
 * fast pre-merge guard against silently-removed bridges.
 *
 * Each `it` asserts a single bridge declaration in lib's theme.css. If a
 * future refactor drops one, the corresponding `<utility>` class would
 * stop responding to the theme generator's runtime override — exactly
 * the bug class AC-2 (typography sizes mute) revealed.
 *
 * Journeys covered here:
 *   J-02 Semantic surfaces       (8 bridges)
 *   J-03 Semantic intents        (6 bridges)
 *   J-04 Semantic status         (6 bridges)
 *   J-05 Semantic chrome         (3 bridges)
 *   J-06 Memphis identity        (2 bridges + 1 per-instance recipe)
 *   J-09 Typography fonts        (3 bridges)
 *   J-11 Radius                  (6 bridges)
 *   J-12 Shadow Memphis          (7 bridges — 6 Memphis tiers + 1 soft tier)
 *   J-13b Motion easings         (2 bridges)
 *
 * J-07 (medal direct-var refs in Medal SVG) is covered by a sibling file
 * alongside the Medal component. J-08a (chart bridges) was covered in
 * `chart-tokens.test.ts` (PR #51). J-10 (typography sizes bridge) was
 * covered in `typography-bridge.test.ts` (PR #49).
 */

const themeCss = readFileSync(
  resolve(__dirname, '..', 'theme.css'),
  'utf8',
).replace(/\s+/g, ' ')

/**
 * Build a regex that matches `--<colorVar>: var(--<sourceVar>)` inside
 * the @theme inline block, tolerating whitespace.
 *
 * NOTE on self-referencing bridges (`--X: var(--X)`):
 * Tailwind v4 namespaces `--font-*`, `--radius-*`, `--shadow-*`,
 * `--ease-*`, `--text-*`, `--spacing` are recognized as theme namespaces
 * even when the right-hand side has the same name as the left. The
 * self-ref form is a legitimate v4 idiom: it tells v4 "treat this name
 * as a theme token AND defer resolution to runtime" — without it,
 * runtime overrides on `:root --font-display` are ignored at the utility
 * layer (this is exactly the AC-2 typography mute bug).
 *
 * The regex still catches:
 *   - removal of the bridge entirely
 *   - replacement of `var(--X)` with a literal value (which would lose
 *     runtime reactivity)
 *   - replacement of `var(--X)` with `var(--Y)` where Y has a different
 *     name (broken upstream pointer)
 *
 * What it cannot catch (out of scope for source-contract tests):
 *   - Tailwind v4 changing how it resolves @theme inline at build time
 *   - cascade/specificity issues from consumer overrides
 *   - the actual `getComputedStyle` outcome on a rendered element
 *
 * Those concerns are guarded by the Playwright runtime spec
 * (planned: `e2e/tests/scenarios/theme-generator-token-runtime-propagation.spec.ts`).
 */
const bridgesTo = (colorVar: string, sourceVar: string) =>
  new RegExp(
    `${colorVar.replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\$&')}\\s*:\\s*var\\(\\s*${sourceVar.replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\$&')}\\s*[,)]`,
  )

/**
 * Sanity check: prove the regex actually fires for a known-bad input.
 * If `bridgesTo` were vacuously satisfied for any string, this would
 * pass (which we don't want).
 */
describe('bridgesTo helper — sanity', () => {
  it('does NOT match an unrelated CSS string', () => {
    const fake = '--color-foo: red;'
    expect(fake).not.toMatch(bridgesTo('--color-bar', '--bar'))
  })
  it('does NOT match a literal-value declaration (no var())', () => {
    const fake = '--font-display: Audiowide, sans-serif;'
    expect(fake).not.toMatch(bridgesTo('--font-display', '--font-display'))
  })
  it('matches a properly-formed bridge', () => {
    const ok = '--font-display: var(--font-display);'
    expect(ok).toMatch(bridgesTo('--font-display', '--font-display'))
  })
})

describe('J-02 Semantic surfaces are bridged', () => {
  const SURFACES: ReadonlyArray<readonly [string, string]> = [
    ['--color-background',         '--background'],
    ['--color-foreground',         '--foreground'],
    ['--color-card',               '--card'],
    ['--color-card-foreground',    '--card-foreground'],
    ['--color-popover',            '--popover'],
    ['--color-popover-foreground', '--popover-foreground'],
    ['--color-muted',              '--muted'],
    ['--color-muted-foreground',   '--muted-foreground'],
  ]
  it.each(SURFACES)('bridges %s → %s', (colorVar, sourceVar) => {
    expect(themeCss).toMatch(bridgesTo(colorVar, sourceVar))
  })
})

describe('J-03 Semantic intents are bridged', () => {
  const INTENTS: ReadonlyArray<readonly [string, string]> = [
    ['--color-primary',              '--primary'],
    ['--color-primary-foreground',   '--primary-foreground'],
    ['--color-secondary',            '--secondary'],
    ['--color-secondary-foreground', '--secondary-foreground'],
    ['--color-destructive',          '--destructive'],
    ['--color-destructive-foreground', '--destructive-foreground'],
  ]
  it.each(INTENTS)('bridges %s → %s', (colorVar, sourceVar) => {
    expect(themeCss).toMatch(bridgesTo(colorVar, sourceVar))
  })
})

describe('J-04 Semantic status are bridged', () => {
  const STATUS: ReadonlyArray<readonly [string, string]> = [
    ['--color-success',            '--success'],
    ['--color-success-foreground', '--success-foreground'],
    ['--color-warning',            '--warning'],
    ['--color-warning-foreground', '--warning-foreground'],
    ['--color-info',               '--info'],
    ['--color-info-foreground',    '--info-foreground'],
  ]
  it.each(STATUS)('bridges %s → %s', (colorVar, sourceVar) => {
    expect(themeCss).toMatch(bridgesTo(colorVar, sourceVar))
  })
})

describe('J-05 Semantic chrome are bridged', () => {
  const CHROME: ReadonlyArray<readonly [string, string]> = [
    ['--color-border',        '--border'],
    ['--color-border-strong', '--border-strong'],
    ['--color-ring',          '--ring'],
  ]
  it.each(CHROME)('bridges %s → %s', (colorVar, sourceVar) => {
    expect(themeCss).toMatch(bridgesTo(colorVar, sourceVar))
  })
})

describe('J-06 Memphis identity is bridged', () => {
  it('bridges --color-memphis → --memphis-border-color', () => {
    expect(themeCss).toMatch(bridgesTo('--color-memphis', '--memphis-border-color'))
  })
  it('bridges --color-memphis-shadow → --memphis-shadow-color', () => {
    expect(themeCss).toMatch(bridgesTo('--color-memphis-shadow', '--memphis-shadow-color'))
  })

  // The per-instance "tinted Memphis shadow" recipe is the lib's most
  // load-bearing pattern: a component overrides --memphis-shadow-color
  // inline (e.g. `[--memphis-shadow-color:var(--primary)]`) so the same
  // shadow utility paints in different colors per call site. If the
  // recipe ever stops working, multiple components (Button ghost, Input
  // focus, Dialog danger, Toast variants) silently lose their per-state
  // tint.
  describe('per-instance --memphis-shadow-color override recipe', () => {
    const COMPONENTS: ReadonlyArray<readonly [string, string, string]> = [
      ['Button ghost variant',  '../../components/button/button.variants.ts',         '[--memphis-shadow-color:var(--primary)]'],
      ['Input focus shadow',    '../../components/input/input.tsx',                   '[--memphis-shadow-color:var(--primary)]'],
      ['Input invalid shadow',  '../../components/input/input.tsx',                   '[--memphis-shadow-color:var(--destructive)]'],
      ['Textarea focus shadow', '../../components/textarea/textarea.tsx',             '[--memphis-shadow-color:var(--primary)]'],
      ['Textarea invalid',      '../../components/textarea/textarea.tsx',             '[--memphis-shadow-color:var(--destructive)]'],
      ['Toast success variant', '../../components/toast/toast.tsx',                   '[--memphis-shadow-color:var(--success)]'],
      ['Toast warning variant', '../../components/toast/toast.tsx',                   '[--memphis-shadow-color:var(--warning)]'],
      ['Toast danger variant',  '../../components/toast/toast.tsx',                   '[--memphis-shadow-color:var(--destructive)]'],
      ['Banner variants',       '../../components/banner/banner.variants.ts',         '[--memphis-shadow-color:var(--success)]'],
      ['FeatureCard tint',      '../../components/feature-card/feature-card.tsx',     '--memphis-shadow-color'],
    ]
    it.each(COMPONENTS)('%s preserves the recipe', (_label, path, fragment) => {
      const source = readFileSync(resolve(__dirname, path), 'utf8')
      expect(source).toContain(fragment)
    })
  })
})

describe('J-09 Typography fonts are bridged', () => {
  const FONTS: ReadonlyArray<readonly [string, string]> = [
    ['--font-display', '--font-display'],
    ['--font-body',    '--font-body'],
    ['--font-mono',    '--font-mono'],
  ]
  it.each(FONTS)('bridges %s → %s', (colorVar, sourceVar) => {
    expect(themeCss).toMatch(bridgesTo(colorVar, sourceVar))
  })
})

describe('J-11 Radius are bridged', () => {
  const RADII: ReadonlyArray<readonly [string, string]> = [
    ['--radius-none',      '--radius-none'],
    ['--radius-sm',        '--radius-sm'],
    ['--radius-md',        '--radius-md'],
    ['--radius-selection', '--radius-selection'],
    ['--radius-pill',      '--radius-pill'],
    ['--radius-full',      '--radius-full'],
  ]
  it.each(RADII)('bridges %s → %s', (colorVar, sourceVar) => {
    expect(themeCss).toMatch(bridgesTo(colorVar, sourceVar))
  })
})

describe('J-12 Shadow Memphis are bridged', () => {
  const SHADOWS: ReadonlyArray<readonly [string, string]> = [
    ['--shadow-memphis-sm',     '--shadow-memphis-sm'],
    ['--shadow-memphis-card',   '--shadow-memphis-card'],
    ['--shadow-memphis',        '--shadow-memphis'],     // the 'md' tier — no suffix
    ['--shadow-memphis-lg',     '--shadow-memphis-lg'],
    ['--shadow-memphis-hover',  '--shadow-memphis-hover'],
    ['--shadow-memphis-active', '--shadow-memphis-active'],
    ['--shadow-md',             '--shadow-md'],          // soft tier
  ]
  it.each(SHADOWS)('bridges %s → %s', (colorVar, sourceVar) => {
    expect(themeCss).toMatch(bridgesTo(colorVar, sourceVar))
  })
})

describe('J-13b Motion easings are bridged', () => {
  const EASINGS: ReadonlyArray<readonly [string, string]> = [
    ['--ease-memphis', '--ease-memphis'],
    ['--ease-out',     '--ease-out'],
  ]
  it.each(EASINGS)('bridges %s → %s', (colorVar, sourceVar) => {
    expect(themeCss).toMatch(bridgesTo(colorVar, sourceVar))
  })
})
