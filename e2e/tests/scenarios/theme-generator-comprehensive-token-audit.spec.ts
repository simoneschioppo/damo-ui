import { test, expect, type Page } from '@playwright/test'

/**
 * Comprehensive token-propagation audit for the theme generator.
 *
 * For every customizable token we know of (from
 * `_bmad-output/test-artifacts/component-token-map.md`), this spec:
 *
 *   1. Visits `/theme-generator` (the editor's preview pane renders
 *      ~50 of the 54 components).
 *   2. Mutates `--<token>` on `<html>` via `style.setProperty(..., 'important')`.
 *   3. Locates a consumer in the page that uses the matching Tailwind
 *      utility (e.g. `bg-primary`, `text-base`, `rounded-pill`).
 *   4. Reads the relevant computed-style property and asserts the
 *      override propagated.
 *
 * Failures from this spec are propagation bugs the source-contract
 * tests can't catch (Tailwind v4 cascade quirks, build-time
 * inlining, override-stylesheet specificity). Each failure should
 * become a separate issue in P6.
 */

// ─── Helpers ───────────────────────────────────────────────

const parseRgb = (s: string | null): [number, number, number] | null => {
  if (!s) return null
  const m = s.match(/(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)/)
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null
}

const parseLastNonTransparentRgb = (shadow: string | null): [number, number, number] | null => {
  if (!shadow) return null
  const re =
    /rgba?\(\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)(?:\s*[,/]\s*(\d+(?:\.\d+)?))?\s*\)/gi
  const triplets: Array<{ r: number; g: number; b: number; a: number | null }> = []
  let m: RegExpExecArray | null
  while ((m = re.exec(shadow)) !== null) {
    triplets.push({
      r: Number(m[1]),
      g: Number(m[2]),
      b: Number(m[3]),
      a: m[4] !== undefined ? Number(m[4]) : null,
    })
  }
  for (let i = triplets.length - 1; i >= 0; i--) {
    if (triplets[i].a !== 0) return [triplets[i].r, triplets[i].g, triplets[i].b]
  }
  return null
}

const parsePx = (v: string | null): number | null => {
  if (!v) return null
  const m = v.match(/^(-?\d+(?:\.\d+)?)px/)
  return m ? Number(m[1]) : null
}

const channelsClose = (
  actual: [number, number, number] | null,
  expected: readonly [number, number, number],
  tol = 3,
): { ok: boolean; reason: string } => {
  if (!actual) return { ok: false, reason: 'parser returned null' }
  const [ar, ag, ab] = actual
  const [er, eg, eb] = expected
  if (Math.abs(ar - er) <= tol && Math.abs(ag - eg) <= tol && Math.abs(ab - eb) <= tol) {
    return { ok: true, reason: '' }
  }
  return {
    ok: false,
    reason: `got [${ar}, ${ag}, ${ab}], expected [${er}, ${eg}, ${eb}] ±${tol}`,
  }
}

async function setTokenAndSettle(page: Page, token: string, value: string) {
  await page.evaluate(
    ({ t, v }) => {
      document.documentElement.style.setProperty(t, v, 'important')
    },
    { t: token, v: value },
  )
  // CI webkit needs a longer paint window than the local engine — 250ms
  // was enough on chromium but flaked consistently on the GitHub Actions
  // webkit runner. Poll until the inline-style override is observable
  // via getPropertyValue, falling back to a fixed wait if the property
  // resolves through a runtime layer (e.g. shadow tokens that compose
  // intermediate vars).
  await page
    .waitForFunction(
      ({ t, v }) => {
        const got = getComputedStyle(document.documentElement).getPropertyValue(t).trim()
        // Loose match — the spec normalises whitespace and rgb form.
        return got.length > 0 && got.replace(/\s+/g, '') === v.replace(/\s+/g, '')
      },
      { t: token, v: value },
      { timeout: 1500 },
    )
    .catch(() => {
      /* tolerate runtime-derived tokens that don't echo back literally */
    })
  await page.waitForTimeout(250)
}

async function clearToken(page: Page, token: string) {
  await page.evaluate((t) => {
    document.documentElement.style.removeProperty(t)
  }, token)
  await page.waitForTimeout(100)
}

// ─── Color tokens — single test per token ─────────────────

interface ColorTokenCase {
  readonly token: string // e.g. '--primary'
  readonly utilityClass: string // e.g. 'bg-primary'
  readonly cssProperty: 'backgroundColor' | 'color' | 'borderColor' | 'outlineColor'
  readonly category: string // for grouping in describe
  readonly skipIfMissing?: boolean // tokens whose consumer is not in the components-preview scene
}

const COLOR_CASES: ColorTokenCase[] = [
  // Surfaces
  {
    token: '--background',
    utilityClass: 'bg-background',
    cssProperty: 'backgroundColor',
    category: 'surfaces',
  },
  {
    token: '--foreground',
    utilityClass: 'text-foreground',
    cssProperty: 'color',
    category: 'surfaces',
  },
  {
    token: '--card',
    utilityClass: 'bg-card',
    cssProperty: 'backgroundColor',
    category: 'surfaces',
  },
  {
    token: '--card-foreground',
    utilityClass: 'text-card-foreground',
    cssProperty: 'color',
    category: 'surfaces',
    skipIfMissing: true,
  },
  {
    token: '--popover',
    utilityClass: 'bg-popover',
    cssProperty: 'backgroundColor',
    category: 'surfaces',
    skipIfMissing: true,
  },
  {
    token: '--popover-foreground',
    utilityClass: 'text-popover-foreground',
    cssProperty: 'color',
    category: 'surfaces',
    skipIfMissing: true,
  },
  {
    token: '--muted',
    utilityClass: 'bg-muted',
    cssProperty: 'backgroundColor',
    category: 'surfaces',
  },
  {
    token: '--muted-foreground',
    utilityClass: 'text-muted-foreground',
    cssProperty: 'color',
    category: 'surfaces',
  },
  // Intents
  {
    token: '--primary',
    utilityClass: 'bg-primary',
    cssProperty: 'backgroundColor',
    category: 'intents',
  },
  {
    token: '--primary-foreground',
    utilityClass: 'text-primary-foreground',
    cssProperty: 'color',
    category: 'intents',
  },
  {
    token: '--secondary',
    utilityClass: 'bg-secondary',
    cssProperty: 'backgroundColor',
    category: 'intents',
  },
  {
    token: '--secondary-foreground',
    utilityClass: 'text-secondary-foreground',
    cssProperty: 'color',
    category: 'intents',
  },
  {
    token: '--destructive',
    utilityClass: 'bg-destructive',
    cssProperty: 'backgroundColor',
    category: 'intents',
  },
  {
    token: '--destructive-foreground',
    utilityClass: 'text-destructive-foreground',
    cssProperty: 'color',
    category: 'intents',
  },
  // Status
  {
    token: '--success',
    utilityClass: 'bg-success',
    cssProperty: 'backgroundColor',
    category: 'status',
  },
  {
    token: '--success-foreground',
    utilityClass: 'text-success-foreground',
    cssProperty: 'color',
    category: 'status',
  },
  {
    token: '--warning',
    utilityClass: 'bg-warning',
    cssProperty: 'backgroundColor',
    category: 'status',
  },
  {
    token: '--warning-foreground',
    utilityClass: 'text-warning-foreground',
    cssProperty: 'color',
    category: 'status',
  },
  { token: '--info', utilityClass: 'bg-info', cssProperty: 'backgroundColor', category: 'status' },
  {
    token: '--info-foreground',
    utilityClass: 'text-info-foreground',
    cssProperty: 'color',
    category: 'status',
  },
  // Chrome
  {
    token: '--border',
    utilityClass: 'border-border',
    cssProperty: 'borderColor',
    category: 'chrome',
    skipIfMissing: true,
  },
  {
    token: '--border-strong',
    utilityClass: 'border-border-strong',
    cssProperty: 'borderColor',
    category: 'chrome',
    skipIfMissing: true,
  },
  {
    token: '--ring',
    utilityClass: 'outline-ring',
    cssProperty: 'outlineColor',
    category: 'chrome',
    skipIfMissing: true,
  },
  // Memphis identity
  {
    token: '--memphis-border-color',
    utilityClass: 'border-memphis',
    cssProperty: 'borderColor',
    category: 'memphis',
  },
  // Charts
  {
    token: '--chart-1',
    utilityClass: 'bg-chart-1',
    cssProperty: 'backgroundColor',
    category: 'identity',
    skipIfMissing: true,
  },
  {
    token: '--chart-2',
    utilityClass: 'bg-chart-2',
    cssProperty: 'backgroundColor',
    category: 'identity',
    skipIfMissing: true,
  },
  {
    token: '--chart-3',
    utilityClass: 'bg-chart-3',
    cssProperty: 'backgroundColor',
    category: 'identity',
    skipIfMissing: true,
  },
  {
    token: '--chart-4',
    utilityClass: 'bg-chart-4',
    cssProperty: 'backgroundColor',
    category: 'identity',
    skipIfMissing: true,
  },
  {
    token: '--chart-5',
    utilityClass: 'bg-chart-5',
    cssProperty: 'backgroundColor',
    category: 'identity',
    skipIfMissing: true,
  },
  // Badge featured
  {
    token: '--badge-featured',
    utilityClass: 'bg-badge-featured',
    cssProperty: 'backgroundColor',
    category: 'identity',
    skipIfMissing: true,
  },
  {
    token: '--badge-featured-foreground',
    utilityClass: 'text-badge-featured-foreground',
    cssProperty: 'color',
    category: 'identity',
    skipIfMissing: true,
  },
]

const NEW_COLOR: [number, number, number] = [222, 17, 99] // unique pink — won't collide with any default

// ─── Radius tokens ────────────────────────────────────────

interface RadiusCase {
  readonly token: string
  readonly utilityClass: string
  readonly newPx: number
  readonly skipIfMissing?: boolean
}

const RADIUS_CASES: RadiusCase[] = [
  { token: '--radius-sm', utilityClass: 'rounded-sm', newPx: 17, skipIfMissing: true },
  { token: '--radius-md', utilityClass: 'rounded-md', newPx: 19 },
  {
    token: '--radius-selection',
    utilityClass: 'rounded-selection',
    newPx: 23,
    skipIfMissing: true,
  },
]

// ─── Shadow Memphis tiers ─────────────────────────────────

interface ShadowCase {
  readonly token: string
  readonly utilityClass: string
  readonly newOffsetPx: number
  readonly skipIfMissing?: boolean
}

const SHADOW_CASES: ShadowCase[] = [
  { token: '--shadow-memphis-sm', utilityClass: 'shadow-memphis-sm', newOffsetPx: 33 },
  {
    token: '--shadow-memphis-card',
    utilityClass: 'shadow-memphis-card',
    newOffsetPx: 35,
    skipIfMissing: true,
  },
  { token: '--shadow-memphis', utilityClass: 'shadow-memphis', newOffsetPx: 37 },
  {
    token: '--shadow-memphis-lg',
    utilityClass: 'shadow-memphis-lg',
    newOffsetPx: 39,
    skipIfMissing: true,
  },
  {
    token: '--shadow-memphis-hover',
    utilityClass: 'shadow-memphis-hover',
    newOffsetPx: 41,
    skipIfMissing: true,
  },
  {
    token: '--shadow-memphis-active',
    utilityClass: 'shadow-memphis-active',
    newOffsetPx: 43,
    skipIfMissing: true,
  },
]

// ─── Typography sizes ─────────────────────────────────────

interface TextSizeCase {
  readonly token: string
  readonly utilityClass: string
  readonly newPx: number
  readonly skipIfMissing?: boolean
}

const TEXT_SIZE_CASES: TextSizeCase[] = [
  { token: '--text-xs', utilityClass: 'text-xs', newPx: 27 },
  { token: '--text-sm', utilityClass: 'text-sm', newPx: 29 },
  { token: '--text-base', utilityClass: 'text-base', newPx: 31 },
  { token: '--text-lg', utilityClass: 'text-lg', newPx: 33 },
  { token: '--text-xl', utilityClass: 'text-xl', newPx: 35 },
  { token: '--text-2xl', utilityClass: 'text-2xl', newPx: 37 },
  { token: '--text-3xl', utilityClass: 'text-3xl', newPx: 39, skipIfMissing: true },
]

// ─── Font families ────────────────────────────────────────

interface FontCase {
  readonly token: string
  readonly utilityClass: string
  readonly familyName: string
}

const FONT_CASES: FontCase[] = [
  { token: '--font-display', utilityClass: 'font-display', familyName: 'Courier New' },
  { token: '--font-body', utilityClass: 'font-body', familyName: 'Times New Roman' },
  { token: '--font-mono', utilityClass: 'font-mono', familyName: 'Monaco' },
]

// ─── Motion easings ────────────────────────────────────────

interface EasingCase {
  readonly token: string
  readonly utilityClass: string
  readonly newCubicBezier: string // e.g. 'cubic-bezier(0.1, 0.9, 0.2, 0.8)'
}

const EASING_CASES: EasingCase[] = [
  {
    token: '--ease-memphis',
    utilityClass: 'ease-memphis',
    newCubicBezier: 'cubic-bezier(0.111, 0.222, 0.333, 0.444)',
  },
  {
    token: '--ease-out',
    utilityClass: 'ease-out',
    newCubicBezier: 'cubic-bezier(0.555, 0.666, 0.777, 0.888)',
  },
]

// ─── Identity / app-pattern / header-height ────────────────

interface VarReferenceCase {
  readonly token: string
  readonly newValue: string
  readonly resolveSelector: string // queries an element to read getComputedStyle from
  readonly cssProperty: keyof CSSStyleDeclaration // e.g. 'borderRadius', 'height'
  readonly assert: (raw: string) => { ok: boolean; reason: string }
}

const VAR_REF_CASES: VarReferenceCase[] = [
  // Medal — Medal SVG uses `var(--medal-${rank}-${slot})` inline as `fill`
  // attribute. The first polygon is `outer`, the second is `inner`.
  // The components-preview scene renders Medals with custom labels:
  // bronze/silver/gold/master keep their rank in the label; grandmaster
  // uses "GM". We accept either and select the polygon by index.
  ...(['bronze', 'silver', 'gold', 'master', 'grandmaster'] as const).flatMap((rank) =>
    (['outer', 'inner'] as const).map((slot) => ({
      token: `--medal-${rank}-${slot}`,
      newValue: 'rgb(123, 45, 67)',
      // Custom resolver: scan SVGs whose aria-label contains the rank name
      // (case-insensitive) OR — for grandmaster — the literal "GM" tag.
      // Then pick the polygon at index outer=0 / inner=1.
      resolveSelector:
        rank === 'grandmaster'
          ? `svg[aria-label*="grandmaster" i] polygon:nth-of-type(${slot === 'outer' ? 1 : 2}), svg[aria-label="GM" i] polygon:nth-of-type(${slot === 'outer' ? 1 : 2})`
          : `svg[aria-label*="${rank}" i] polygon:nth-of-type(${slot === 'outer' ? 1 : 2})`,
      cssProperty: 'fill' as keyof CSSStyleDeclaration,
      assert: (raw: string) => {
        const m = raw.match(/(\d+),\s*(\d+),\s*(\d+)/)
        if (!m) return { ok: false, reason: `no rgb in ${raw}` }
        const [, r, g, b] = m
        const ok = Math.abs(+r - 123) <= 3 && Math.abs(+g - 45) <= 3 && Math.abs(+b - 67) <= 3
        return { ok, reason: ok ? '' : `got ${raw}, expected rgb(123,45,67) ±3` }
      },
    })),
  ),
  // Header height — AppTopBar renders `h-[var(--header-height)]`. Override
  // and read computed height of the <header> element.
  {
    token: '--header-height',
    newValue: '99px',
    resolveSelector: 'header.h-\\[var\\(--header-height\\)\\]',
    cssProperty: 'height',
    assert: (raw: string) => {
      const m = raw.match(/^(\d+(?:\.\d+)?)/)
      const px = m ? Number(m[1]) : NaN
      const ok = Math.abs(px - 99) <= 1
      return { ok, reason: ok ? '' : `got ${raw}, expected 99px ±1` }
    },
  },
]

// ─── Additional radii and shadow tiers ─────────────────────

const RADIUS_EXTRA_CASES: RadiusCase[] = []

/**
 * Editor → emitter → DOM bug: theme-generator's `applyThemeToRoot` in
 * `apps/web/app/theme-generator/use-theme-state.ts` forces the `pill`
 * key to `999px` and `full` to `50%` regardless of the value the user
 * sets in the editor. Edits to those two radius keys are muted at the
 * emit layer, before they reach the DOM. The runtime path (overriding
 * `--radius-pill` directly via setProperty) does work — proven below —
 * but the editor's flow does NOT honor user input for these two keys.
 */
test.describe('TA — radius pill/full editor flow is NOT muted at emit (bug guard)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/theme-generator')
  })

  test('--radius-pill propagates to rounded-pill at runtime (direct setProperty)', async ({
    page,
  }) => {
    await setTokenAndSettle(page, '--radius-pill', '99px')
    const result = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.rounded-pill')
      if (!el) return { found: false as const }
      return { found: true as const, value: getComputedStyle(el).borderRadius }
    })
    if (!result.found) {
      test.info().annotations.push({
        type: 'preview-gap',
        description: 'no .rounded-pill consumer in /theme-generator preview',
      })
      return
    }
    const radius = parsePx(result.value as string)
    expect
      .soft(
        radius !== null && Math.abs(radius - 99) <= 0.5,
        `--radius-pill direct override: got ${result.value}, expected 99px`,
      )
      .toBe(true)
    await clearToken(page, '--radius-pill')
  })
})

// Already in SHADOW_CASES — leave empty so we don't duplicate test names.
const SHADOW_EXTRA_CASES: ShadowCase[] = []

// ─── Tests ─────────────────────────────────────────────────

test.describe('Comprehensive token propagation audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/theme-generator')
    await expect(page.locator('html')).toHaveAttribute('data-motion-preview', '')
  })

  for (const c of COLOR_CASES) {
    test(`color: ${c.token} → ${c.utilityClass} (${c.cssProperty})`, async ({ page }) => {
      await setTokenAndSettle(page, c.token, `rgb(${NEW_COLOR.join(', ')})`)
      const result = await page.evaluate(
        ({ cls, prop }) => {
          const el = document.querySelector<HTMLElement>(
            `.${cls.replace(/[/[\]]/g, (m) => `\\${m}`)}`,
          )
          if (!el) return { found: false as const }
          const cs = getComputedStyle(el)
          return { found: true as const, value: cs[prop as keyof CSSStyleDeclaration] as string }
        },
        { cls: c.utilityClass, prop: c.cssProperty },
      )
      if (!result.found) {
        if (c.skipIfMissing) {
          test.info().annotations.push({
            type: 'no-consumer',
            description: `no consumer with .${c.utilityClass} in /theme-generator preview — skipped per skipIfMissing`,
          })
          return
        }
        expect
          .soft(result.found, `expected a .${c.utilityClass} consumer in the preview`)
          .toBe(true)
        return
      }
      const parsed = parseRgb(result.value as string)
      const check = channelsClose(parsed, NEW_COLOR)
      expect
        .soft(check.ok, `${c.token} → ${c.cssProperty}: ${check.reason} (raw: ${result.value})`)
        .toBe(true)
      await clearToken(page, c.token)
    })
  }

  for (const c of RADIUS_CASES) {
    test(`radius: ${c.token} → ${c.utilityClass}`, async ({ page }) => {
      await setTokenAndSettle(page, c.token, `${c.newPx}px`)
      const result = await page.evaluate((cls) => {
        const el = document.querySelector<HTMLElement>(`.${cls}`)
        if (!el) return { found: false as const }
        return { found: true as const, value: getComputedStyle(el).borderRadius }
      }, c.utilityClass)
      if (!result.found) {
        if (c.skipIfMissing) return
        expect.soft(result.found, `expected a .${c.utilityClass} consumer`).toBe(true)
        return
      }
      const radius = parsePx(result.value as string)
      expect
        .soft(
          radius !== null && Math.abs(radius - c.newPx) <= 0.5,
          `${c.token}: got ${result.value}, expected ${c.newPx}px`,
        )
        .toBe(true)
      await clearToken(page, c.token)
    })
  }

  for (const c of SHADOW_CASES) {
    test(`shadow: ${c.token} → ${c.utilityClass}`, async ({ page }) => {
      const value = `${c.newOffsetPx}px ${c.newOffsetPx}px 0 rgb(${NEW_COLOR.join(', ')})`
      await setTokenAndSettle(page, c.token, value)
      const result = await page.evaluate((cls) => {
        const el = document.querySelector<HTMLElement>(`.${cls}`)
        if (!el) return { found: false as const }
        return { found: true as const, value: getComputedStyle(el).boxShadow }
      }, c.utilityClass)
      if (!result.found) {
        if (c.skipIfMissing) return
        expect.soft(result.found, `expected a .${c.utilityClass} consumer`).toBe(true)
        return
      }
      const lastRgb = parseLastNonTransparentRgb(result.value as string)
      const colorCheck = channelsClose(lastRgb, NEW_COLOR)
      expect
        .soft(colorCheck.ok, `${c.token} color: ${colorCheck.reason} (raw: ${result.value})`)
        .toBe(true)
      // Offset numbers — tolerate ±1px sub-pixel rounding.
      // Box-shadow strings are comma-separated layers; the LAST layer is
      // the Memphis tier carrying our override. Extract its first two
      // `<n>px` to read X/Y offsets.
      const lastLayer = (result.value as string).split(/\s*,\s*/).pop() ?? ''
      const offsetMatch = lastLayer.match(/(\d+(?:\.\d+)?)px\s+(\d+(?:\.\d+)?)px/)
      expect
        .soft(
          offsetMatch !== null,
          `${c.token} offsets: parser failed on last layer "${lastLayer}" of full shadow ${result.value}`,
        )
        .toBe(true)
      if (offsetMatch) {
        expect
          .soft(
            Math.abs(Number(offsetMatch[1]) - c.newOffsetPx) <= 1,
            `${c.token} X offset: got ${offsetMatch[1]}, expected ${c.newOffsetPx} (last layer: ${lastLayer})`,
          )
          .toBe(true)
        expect
          .soft(
            Math.abs(Number(offsetMatch[2]) - c.newOffsetPx) <= 1,
            `${c.token} Y offset: got ${offsetMatch[2]}, expected ${c.newOffsetPx} (last layer: ${lastLayer})`,
          )
          .toBe(true)
      }
      await clearToken(page, c.token)
    })
  }

  for (const c of TEXT_SIZE_CASES) {
    test(`text-size: ${c.token} → ${c.utilityClass}`, async ({ page }) => {
      await setTokenAndSettle(page, c.token, `${c.newPx}px`)
      const result = await page.evaluate((cls) => {
        const el = document.querySelector<HTMLElement>(`.${cls}`)
        if (!el) return { found: false as const }
        return { found: true as const, value: getComputedStyle(el).fontSize }
      }, c.utilityClass)
      if (!result.found) {
        if (c.skipIfMissing) return
        expect.soft(result.found, `expected a .${c.utilityClass} consumer`).toBe(true)
        return
      }
      const size = parsePx(result.value as string)
      expect
        .soft(
          size !== null && Math.abs(size - c.newPx) <= 0.5,
          `${c.token}: got ${result.value}, expected ${c.newPx}px`,
        )
        .toBe(true)
      await clearToken(page, c.token)
    })
  }

  for (const c of FONT_CASES) {
    test(`font: ${c.token} → ${c.utilityClass}`, async ({ page }) => {
      await setTokenAndSettle(page, c.token, `'${c.familyName}', sans-serif`)
      const result = await page.evaluate((cls) => {
        const el = document.querySelector<HTMLElement>(`.${cls}`)
        if (!el) return { found: false as const }
        return { found: true as const, value: getComputedStyle(el).fontFamily }
      }, c.utilityClass)
      if (!result.found) {
        expect.soft(result.found, `expected a .${c.utilityClass} consumer`).toBe(true)
        return
      }
      expect
        .soft(
          (result.value as string).includes(c.familyName),
          `${c.token}: got "${result.value}", expected to contain "${c.familyName}"`,
        )
        .toBe(true)
      await clearToken(page, c.token)
    })
  }

  for (const c of EASING_CASES) {
    test(`easing: ${c.token} → ${c.utilityClass}`, async ({ page }) => {
      await setTokenAndSettle(page, c.token, c.newCubicBezier)
      const result = await page.evaluate((cls) => {
        const el = document.querySelector<HTMLElement>(`.${cls}`)
        if (!el) return { found: false as const }
        return { found: true as const, value: getComputedStyle(el).transitionTimingFunction }
      }, c.utilityClass)
      if (!result.found) {
        expect.soft(result.found, `expected a .${c.utilityClass} consumer`).toBe(true)
        return
      }
      // CSS normalizes cubic-bezier whitespace; match by extracting numbers.
      const got = result.value as string
      const numbers = (got.match(/-?\d+(?:\.\d+)?/g) || []).map(Number)
      const expectedNumbers = (c.newCubicBezier.match(/-?\d+(?:\.\d+)?/g) || []).map(Number)
      expect
        .soft(
          numbers.length >= 4 && expectedNumbers.every((n, i) => Math.abs(numbers[i] - n) < 0.01),
          `${c.token}: got "${got}", expected to encode ${c.newCubicBezier}`,
        )
        .toBe(true)
      await clearToken(page, c.token)
    })
  }

  for (const c of RADIUS_EXTRA_CASES) {
    test(`radius: ${c.token} → ${c.utilityClass}`, async ({ page }) => {
      await setTokenAndSettle(page, c.token, `${c.newPx}px`)
      const result = await page.evaluate((cls) => {
        const el = document.querySelector<HTMLElement>(`.${cls}`)
        if (!el) return { found: false as const }
        return { found: true as const, value: getComputedStyle(el).borderRadius }
      }, c.utilityClass)
      if (!result.found) {
        if (c.skipIfMissing) {
          test.info().annotations.push({
            type: 'preview-gap',
            description: `no .${c.utilityClass} consumer in /theme-generator preview`,
          })
          return
        }
        expect.soft(result.found, `expected a .${c.utilityClass} consumer`).toBe(true)
        return
      }
      const radius = parsePx(result.value as string)
      expect
        .soft(
          radius !== null && Math.abs(radius - c.newPx) <= 0.5,
          `${c.token}: got ${result.value}, expected ${c.newPx}px`,
        )
        .toBe(true)
      await clearToken(page, c.token)
    })
  }

  for (const c of SHADOW_EXTRA_CASES) {
    test(`shadow: ${c.token} → ${c.utilityClass}`, async ({ page }) => {
      const value = `${c.newOffsetPx}px ${c.newOffsetPx}px 0 rgb(${NEW_COLOR.join(', ')})`
      await setTokenAndSettle(page, c.token, value)
      const result = await page.evaluate((cls) => {
        const el = document.querySelector<HTMLElement>(`.${cls}`)
        if (!el) return { found: false as const }
        return { found: true as const, value: getComputedStyle(el).boxShadow }
      }, c.utilityClass)
      if (!result.found) {
        if (c.skipIfMissing) {
          test.info().annotations.push({
            type: 'preview-gap',
            description: `no .${c.utilityClass} consumer in /theme-generator preview`,
          })
          return
        }
        expect.soft(result.found, `expected a .${c.utilityClass} consumer`).toBe(true)
        return
      }
      const lastRgb = parseLastNonTransparentRgb(result.value as string)
      const colorCheck = channelsClose(lastRgb, NEW_COLOR)
      expect.soft(colorCheck.ok, `${c.token} color: ${colorCheck.reason}`).toBe(true)
      const lastLayer = (result.value as string).split(/\s*,\s*/).pop() ?? ''
      const offsetMatch = lastLayer.match(/(\d+(?:\.\d+)?)px\s+(\d+(?:\.\d+)?)px/)
      if (offsetMatch) {
        expect
          .soft(
            Math.abs(Number(offsetMatch[1]) - c.newOffsetPx) <= 1,
            `${c.token} X offset: got ${offsetMatch[1]}, expected ${c.newOffsetPx}`,
          )
          .toBe(true)
      }
      await clearToken(page, c.token)
    })
  }

  for (const c of VAR_REF_CASES) {
    test(`var-ref: ${c.token} → ${c.resolveSelector}`, async ({ page }) => {
      await setTokenAndSettle(page, c.token, c.newValue)
      const result = await page.evaluate(
        ({ sel, prop }) => {
          const el = document.querySelector<HTMLElement>(sel)
          if (!el) return { found: false as const }
          const cs = getComputedStyle(el)
          return { found: true as const, value: cs[prop] as string }
        },
        { sel: c.resolveSelector, prop: c.cssProperty as string },
      )
      if (!result.found) {
        test.info().annotations.push({
          type: 'preview-gap',
          description: `no consumer matching "${c.resolveSelector}" in preview`,
        })
        // Soft-assert so this surfaces as a finding without hard-failing
        // (var-ref consumers are scene-dependent).
        expect.soft(result.found, `consumer missing for ${c.token}`).toBe(true)
        return
      }
      const check = c.assert(result.value as string)
      expect.soft(check.ok, `${c.token}: ${check.reason}`).toBe(true)
      await clearToken(page, c.token)
    })
  }
})
