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

const themeCss = readFileSync(resolve(__dirname, '..', 'theme.css'), 'utf8').replace(/\s+/g, ' ')

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
    ['--color-background', '--background'],
    ['--color-foreground', '--foreground'],
    ['--color-card', '--card'],
    ['--color-card-foreground', '--card-foreground'],
    ['--color-popover', '--popover'],
    ['--color-popover-foreground', '--popover-foreground'],
    ['--color-muted', '--muted'],
    ['--color-muted-foreground', '--muted-foreground'],
  ]
  it.each(SURFACES)('bridges %s → %s', (colorVar, sourceVar) => {
    expect(themeCss).toMatch(bridgesTo(colorVar, sourceVar))
  })
})

describe('J-03 Semantic intents are bridged', () => {
  const INTENTS: ReadonlyArray<readonly [string, string]> = [
    ['--color-primary', '--primary'],
    ['--color-primary-foreground', '--primary-foreground'],
    ['--color-secondary', '--secondary'],
    ['--color-secondary-foreground', '--secondary-foreground'],
    ['--color-destructive', '--destructive'],
    ['--color-destructive-foreground', '--destructive-foreground'],
  ]
  it.each(INTENTS)('bridges %s → %s', (colorVar, sourceVar) => {
    expect(themeCss).toMatch(bridgesTo(colorVar, sourceVar))
  })
})

describe('J-04 Semantic status are bridged', () => {
  const STATUS: ReadonlyArray<readonly [string, string]> = [
    ['--color-success', '--success'],
    ['--color-success-foreground', '--success-foreground'],
    ['--color-warning', '--warning'],
    ['--color-warning-foreground', '--warning-foreground'],
    ['--color-info', '--info'],
    ['--color-info-foreground', '--info-foreground'],
  ]
  it.each(STATUS)('bridges %s → %s', (colorVar, sourceVar) => {
    expect(themeCss).toMatch(bridgesTo(colorVar, sourceVar))
  })
})

describe('J-05 Semantic chrome are bridged', () => {
  const CHROME: ReadonlyArray<readonly [string, string]> = [
    ['--color-border', '--border'],
    ['--color-border-strong', '--border-strong'],
    ['--color-ring', '--ring'],
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
  // load-bearing pattern: components paint the Memphis offset shadow in
  // an intent color (primary on Button ghost / Card featured / focused
  // inputs, destructive on invalid inputs / Toast danger / Dialog danger,
  // success/warning/info on Banner + Toast variants).
  //
  // The legacy mechanism `[--memphis-shadow-color:var(--X)] shadow-memphis`
  // was broken at runtime: browsers substitute var() inside an inherited
  // custom property at the *declaring* element (`:root`), so per-instance
  // overrides of `--memphis-shadow-color` could not retroactively re-tint
  // an already-resolved `--shadow-memphis` (PR #65 caveat).
  //
  // Issue #66 replaced the recipe with per-color @utility blocks
  // (`shadow-memphis-{primary|success|warning|destructive|info}` and
  // `shadow-memphis-lg-destructive`), which bake the intent token into
  // the box-shadow value so substitution happens at the consumer.
  describe('per-color tinted shadow recipe (post-#66)', () => {
    const COMPONENTS: ReadonlyArray<readonly [string, string, ReadonlyArray<string>]> = [
      [
        'Button ghost variant',
        '../../components/button/button.variants.ts',
        [
          'shadow-memphis-primary',
          'hover:shadow-memphis-primary-hover',
          'active:shadow-memphis-primary-active',
        ],
      ],
      [
        'Card featured variant',
        '../../components/card/card.variants.ts',
        ['shadow-memphis-primary'],
      ],
      [
        'Input focus shadow',
        '../../components/input/input.tsx',
        ['focus-visible:shadow-memphis-primary'],
      ],
      [
        'Input invalid shadow',
        '../../components/input/input.tsx',
        ['aria-invalid:shadow-memphis-destructive'],
      ],
      [
        'Textarea focus shadow',
        '../../components/textarea/textarea.tsx',
        ['focus-visible:shadow-memphis-primary'],
      ],
      [
        'Textarea invalid shadow',
        '../../components/textarea/textarea.tsx',
        ['aria-invalid:shadow-memphis-destructive'],
      ],
      [
        'Select trigger focus',
        '../../components/select/select.tsx',
        ['focus-visible:shadow-memphis-primary'],
      ],
      [
        'Combobox trigger focus',
        '../../components/combobox/combobox.tsx',
        ['focus-visible:shadow-memphis-primary'],
      ],
      [
        'DatePicker trigger focus',
        '../../components/date-picker/date-picker.tsx',
        ['focus-visible:shadow-memphis-primary'],
      ],
      ['Toast success variant', '../../components/toast/toast.tsx', ['shadow-memphis-success']],
      ['Toast warning variant', '../../components/toast/toast.tsx', ['shadow-memphis-warning']],
      ['Toast danger variant', '../../components/toast/toast.tsx', ['shadow-memphis-destructive']],
      [
        'Banner info variant',
        '../../components/banner/banner.variants.ts',
        ['shadow-memphis-info'],
      ],
      [
        'Banner success variant',
        '../../components/banner/banner.variants.ts',
        ['shadow-memphis-success'],
      ],
      [
        'Banner warning variant',
        '../../components/banner/banner.variants.ts',
        ['shadow-memphis-warning'],
      ],
      [
        'Banner danger variant',
        '../../components/banner/banner.variants.ts',
        ['shadow-memphis-destructive'],
      ],
      [
        'Dialog danger tone',
        '../../components/dialog/dialog.tsx',
        ['shadow-memphis-lg-destructive'],
      ],
    ]
    it.each(COMPONENTS)('%s uses the new tinted utility', (_label, path, fragments) => {
      const source = readFileSync(resolve(__dirname, path), 'utf8')
      for (const fragment of fragments) {
        expect(source).toContain(fragment)
      }
    })

    // Anti-regression: the legacy per-instance bracket recipe must not
    // creep back into any migrated consumer. The recipe is broken at the
    // CSS-substitution layer; restoring it would silently revert the
    // tinted shadow to default black on these components.
    const MIGRATED_FILES: ReadonlyArray<readonly [string, string]> = [
      ['Button', '../../components/button/button.variants.ts'],
      ['Card', '../../components/card/card.variants.ts'],
      ['Input', '../../components/input/input.tsx'],
      ['Textarea', '../../components/textarea/textarea.tsx'],
      ['Select', '../../components/select/select.tsx'],
      ['Combobox', '../../components/combobox/combobox.tsx'],
      ['DatePicker', '../../components/date-picker/date-picker.tsx'],
      ['Toast', '../../components/toast/toast.tsx'],
      ['Banner', '../../components/banner/banner.variants.ts'],
      ['Dialog', '../../components/dialog/dialog.tsx'],
    ]
    it.each(MIGRATED_FILES)('%s no longer embeds [--memphis-shadow-color:…]', (_label, path) => {
      const source = readFileSync(resolve(__dirname, path), 'utf8')
      expect(source).not.toMatch(/\[--memphis-shadow-color:/)
    })
  })
})

describe('J-09 Typography fonts are bridged', () => {
  const FONTS: ReadonlyArray<readonly [string, string]> = [
    ['--font-display', '--font-display'],
    ['--font-body', '--font-body'],
    ['--font-mono', '--font-mono'],
  ]
  it.each(FONTS)('bridges %s → %s', (colorVar, sourceVar) => {
    expect(themeCss).toMatch(bridgesTo(colorVar, sourceVar))
  })
})

describe('J-11 Radius are bridged', () => {
  const RADII: ReadonlyArray<readonly [string, string]> = [
    ['--radius-none', '--radius-none'],
    ['--radius-sm', '--radius-sm'],
    ['--radius-md', '--radius-md'],
    ['--radius-selection', '--radius-selection'],
    ['--radius-pill', '--radius-pill'],
    ['--radius-full', '--radius-full'],
  ]
  it.each(RADII)('bridges %s → %s', (colorVar, sourceVar) => {
    expect(themeCss).toMatch(bridgesTo(colorVar, sourceVar))
  })
})

describe('J-12 Shadow Memphis are exposed via @utility (not @theme inline)', () => {
  /**
   * Why this asserts `@utility` instead of `@theme inline` bridges:
   * v4 compiles theme-namespace declarations of the form
   * `--shadow-X: var(--shadow-X)` into a top-level
   * `:root, :host { --shadow-X: var(--shadow-X) }` rule that wins over
   * `tokens.css` and erases the `<Npx Npx 0 var(--memphis-shadow-color)>`
   * value — breaking the per-instance `[--memphis-shadow-color:var(--X)]`
   * recipe across Button/Input/Toast/Banner/etc. We sidestep that emission
   * by declaring `shadow-memphis-*` (and `shadow-md`) as `@utility` blocks
   * that read the token at use-time. See issue #58.
   *
   * Mirrors the `duration-*` story: those classes are also `@utility`
   * blocks at the bottom of theme.css for the same reason.
   */
  const SHADOW_UTILITIES: ReadonlyArray<readonly [string, string]> = [
    ['shadow-memphis-sm', '--shadow-memphis-sm'],
    ['shadow-memphis-card', '--shadow-memphis-card'],
    ['shadow-memphis', '--shadow-memphis'], // the 'md' tier — no suffix
    ['shadow-memphis-lg', '--shadow-memphis-lg'],
    ['shadow-memphis-hover', '--shadow-memphis-hover'],
    ['shadow-memphis-active', '--shadow-memphis-active'],
    ['shadow-md', '--shadow-md'], // soft tier
  ]
  it.each(SHADOW_UTILITIES)('@utility %s reads var(%s)', (utilityName, sourceVar) => {
    // Match: `@utility <name> { box-shadow: var(<sourceVar>); }`
    // (with arbitrary whitespace; .replace above already collapsed it).
    const escapedName = utilityName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    const escapedSrc = sourceVar.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    const rx = new RegExp(
      `@utility\\s+${escapedName}\\s*\\{\\s*box-shadow\\s*:\\s*var\\(\\s*${escapedSrc}\\s*[,)]`,
    )
    expect(themeCss).toMatch(rx)
  })

  it('does NOT redeclare --shadow-memphis-* inside @theme inline (would shadow tokens.css)', () => {
    // Anti-regression: if the self-referential bridge sneaks back into
    // @theme inline, v4 emits :root, :host { --shadow-memphis-X: var(--shadow-memphis-X) }
    // which clobbers the tokens.css value and breaks the per-instance recipe.
    const themeInlineMatch = themeCss.match(/@theme inline \{([\s\S]*?)\}/)
    expect(themeInlineMatch).not.toBeNull()
    const themeInlineBody = themeInlineMatch![1]
    expect(themeInlineBody).not.toMatch(/--shadow-memphis(-\w+)?\s*:/)
    expect(themeInlineBody).not.toMatch(/--shadow-md\s*:/)
  })
})

describe('J-12b Per-color tinted Memphis shadow @utility blocks (#66)', () => {
  /**
   * Per-color tinted shadows replace the broken
   * `[--memphis-shadow-color:var(--X)] shadow-memphis` recipe. Each
   * @utility bakes the intent token directly into the box-shadow value,
   * which sidesteps the inherited-custom-property substitution trap from
   * PR #65 (browsers substitute the inner var() at the declaring element,
   * not the consumer).
   *
   * Each entry asserts:
   *   `@utility <name> { box-shadow: <Npx Npx 0> var(<intent>); }`
   * with the offset matching the corresponding tier (md = 6px 6px 0,
   * lg = 9px 9px 0). The offset is hardcoded inside the @utility because
   * there is no separate `--shadow-memphis-offset` token; if the theme
   * generator ever needs to override per-color offsets, that's a follow-up.
   */
  const TINTED_UTILITIES: ReadonlyArray<readonly [string, string, string]> = [
    ['shadow-memphis-primary', '6px 6px 0', '--primary'],
    ['shadow-memphis-success', '6px 6px 0', '--success'],
    ['shadow-memphis-warning', '6px 6px 0', '--warning'],
    ['shadow-memphis-destructive', '6px 6px 0', '--destructive'],
    ['shadow-memphis-info', '6px 6px 0', '--info'],
    ['shadow-memphis-lg-destructive', '9px 9px 0', '--destructive'],
    // Hover/active offsets matching the lib's non-tinted hover/active
    // tiers (7px 7px 0 / 2px 2px 0 from tokens.css), tinted with --primary.
    // Without these, Button ghost would jolt to default-black on hover/active.
    ['shadow-memphis-primary-hover', '7px 7px 0', '--primary'],
    ['shadow-memphis-primary-active', '2px 2px 0', '--primary'],
  ]
  it.each(TINTED_UTILITIES)(
    '@utility %s emits box-shadow %s var(%s)',
    (utilityName, offset, intentVar) => {
      const escapedName = utilityName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
      const escapedOffset = offset.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+')
      const escapedIntent = intentVar.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
      const rx = new RegExp(
        `@utility\\s+${escapedName}\\s*\\{\\s*box-shadow\\s*:\\s*${escapedOffset}\\s+var\\(\\s*${escapedIntent}\\s*[,)]`,
      )
      expect(themeCss).toMatch(rx)
    },
  )
})

describe('J-13b Motion easings are bridged', () => {
  const EASINGS: ReadonlyArray<readonly [string, string]> = [
    ['--ease-memphis', '--ease-memphis'],
    ['--ease-out', '--ease-out'],
  ]
  it.each(EASINGS)('bridges %s → %s', (colorVar, sourceVar) => {
    expect(themeCss).toMatch(bridgesTo(colorVar, sourceVar))
  })
})
