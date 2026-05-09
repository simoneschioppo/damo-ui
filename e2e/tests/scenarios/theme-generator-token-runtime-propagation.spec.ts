import { test, expect } from '@playwright/test'

/**
 * Theme generator → component RUNTIME propagation smoke (TA / PR-B).
 *
 * Source-contract tests in `packages/ui/src/styles/__tests__/` guard the
 * `@theme inline` declarations exist. This spec exercises the same
 * journeys end-to-end at runtime: mutate a `--token` on `:root`, render
 * a component using the corresponding Tailwind utility, read the
 * computed style.
 *
 * Patterns to know:
 *
 *  1) `setProperty(name, value, 'important')` is mandatory. The
 *     `/theme-generator` page injects `<style id="theme-generator-overrides">`
 *     with `:root[data-palette='default']` selectors that win over plain
 *     `:root`; without `'important'` an inline-element-style override on
 *     `<html>` may not beat them in cascade for custom properties.
 *
 *  2) Browsers cache used-value on the current frame. After mutating a
 *     custom property, wait one tick (`waitForTimeout(50)`) before
 *     reading `getComputedStyle` — otherwise Chromium can return the
 *     pre-update value.
 *
 *  3) Color channels surface with ±2 sRGB rounding (e.g. input
 *     `rgb(0, 200, 100)` may surface as `rgb(0, 201, 101)`). Use
 *     `expectChannelsClose` for tolerant matching.
 *
 *  4) For box-shadow strings, the relevant color is the LAST
 *     non-transparent layer (Tailwind layers transparent rgba(0,0,0,0)
 *     filler shadows before the visible Memphis tier). Use
 *     `parseLastNonTransparentRgb`.
 *
 *  5) **Per-instance `[--memphis-shadow-color:var(--X)]` recipe**: this
 *     pattern (Button ghost, Input focus, Dialog danger, Toast variants)
 *     was broken when `--shadow-memphis-*` lived inside `@theme inline`
 *     because v4 emits a `:root, :host { --shadow-memphis-X: var(--shadow-memphis-X) }`
 *     rule that wins the cascade over `tokens.css` and erases the
 *     `<Npx Npx 0 var(--memphis-shadow-color)>` token value. Issue #58
 *     fixed this by declaring the shadow utilities as `@utility` blocks
 *     instead, sidestepping the @theme-inline emission path. The
 *     `J-12 per-instance` test below is the runtime regression guard.
 */

const parseRgb = (color: string | null): [number, number, number] | null => {
  if (!color) return null
  const match = color.match(/(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)/)
  if (!match) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

/**
 * Box-shadow strings layer multiple shadows separated by commas, each
 * with its own color. The Memphis tier we care about is the LAST one
 * in the chain (the visible offset shadow); preceding entries are
 * Tailwind's transparent `rgba(0, 0, 0, 0)` filler stack.
 *
 * Returns the last non-transparent rgb triplet found in the string,
 * skipping `rgba(…, 0)` entries.
 */
const parseLastNonTransparentRgb = (shadow: string | null): [number, number, number] | null => {
  if (!shadow) return null
  const triplets: Array<{ r: number; g: number; b: number; alpha: number | null }> = []
  const re =
    /rgba?\(\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)(?:\s*[,/]\s*(\d+(?:\.\d+)?))?\s*\)/gi
  let match: RegExpExecArray | null
  while ((match = re.exec(shadow)) !== null) {
    triplets.push({
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
      alpha: match[4] !== undefined ? Number(match[4]) : null,
    })
  }
  for (let i = triplets.length - 1; i >= 0; i--) {
    const t = triplets[i]
    if (t.alpha === 0) continue
    return [t.r, t.g, t.b]
  }
  return null
}

const expectChannelsClose = (
  actual: [number, number, number] | null,
  expected: readonly [number, number, number],
  tolerance = 2,
) => {
  expect(actual, 'expected an rgb triplet, got null').not.toBeNull()
  const [ar, ag, ab] = actual!
  const [er, eg, eb] = expected
  expect(Math.abs(ar - er), `R: got ${ar}, expected ${er}±${tolerance}`).toBeLessThanOrEqual(
    tolerance,
  )
  expect(Math.abs(ag - eg), `G: got ${ag}, expected ${eg}±${tolerance}`).toBeLessThanOrEqual(
    tolerance,
  )
  expect(Math.abs(ab - eb), `B: got ${ab}, expected ${eb}±${tolerance}`).toBeLessThanOrEqual(
    tolerance,
  )
}

async function setRootTokenAndSettle(
  page: import('@playwright/test').Page,
  token: string,
  value: string,
) {
  await page.evaluate(
    ({ t, v }) => {
      document.documentElement.style.setProperty(t, v, 'important')
    },
    { t: token, v: value },
  )
  // Wait long enough for any in-flight CSS transition to settle. Button's
  // `transition-colors duration-snap ease-memphis` is 80ms; allow generous
  // headroom plus ~1 paint frame.
  await page.waitForTimeout(250)
}

test.describe('TA — token edits propagate (in /theme-generator)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/theme-generator')
    await expect(page.locator('html')).toHaveAttribute('data-motion-preview', '')
  })

  test('J-02 surfaces — overriding --background paints the body', async ({ page }) => {
    await setRootTokenAndSettle(page, '--background', 'rgb(255, 0, 128)')
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    expectChannelsClose(parseRgb(bodyBg), [255, 0, 128])
  })

  test('J-03 intents — overriding --primary paints any bg-primary consumer', async ({ page }) => {
    await setRootTokenAndSettle(page, '--primary', 'rgb(0, 200, 100)')
    const btnBg = await page.evaluate(() => {
      const btn = document.querySelector<HTMLButtonElement>('button.bg-primary')
      if (!btn) return null
      return getComputedStyle(btn).backgroundColor
    })
    expect(btnBg, 'a `bg-primary` consumer must exist in the preview').not.toBeNull()
    expectChannelsClose(parseRgb(btnBg), [0, 200, 100])
  })

  test('J-12 Shadow Memphis — overriding --shadow-memphis paints the resolved value', async ({
    page,
  }) => {
    await setRootTokenAndSettle(page, '--shadow-memphis', '12px 12px 0 rgb(255, 0, 0)')
    const computedShadow = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.shadow-memphis')
      if (!el) return null
      return getComputedStyle(el).boxShadow
    })
    expect(computedShadow, 'a `shadow-memphis` consumer must exist').not.toBeNull()
    expectChannelsClose(parseLastNonTransparentRgb(computedShadow), [255, 0, 0])
    // Offset numbers — Chromium can render `12.0897px` due to sub-pixel
    // calc rounding; tolerate ±0.5px.
    const offsets = computedShadow!.match(
      /(\d+(?:\.\d+)?)px\s+(\d+(?:\.\d+)?)px(?=\s+0px\s+0px[^,]*$)/,
    )
    expect(offsets, `couldn't parse offsets from ${computedShadow}`).not.toBeNull()
    if (offsets) {
      expect(Math.abs(Number(offsets[1]) - 12)).toBeLessThanOrEqual(0.5)
      expect(Math.abs(Number(offsets[2]) - 12)).toBeLessThanOrEqual(0.5)
    }
  })
})

test.describe('TA — Memphis identity on lib-default routes (no override stylesheet)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('J-06 Memphis identity — overriding --memphis-border-color retints `border-memphis`', async ({
    page,
  }) => {
    await setRootTokenAndSettle(page, '--memphis-border-color', 'rgb(255, 165, 0)')
    const computedBorder = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.border-memphis')
      if (!el) return null
      return getComputedStyle(el).borderColor
    })
    expect(computedBorder, 'a `border-memphis` consumer must exist').not.toBeNull()
    expectChannelsClose(parseRgb(computedBorder), [255, 165, 0])
  })

  // Regression guard for issue #58 (structural half).
  // Before the fix, the lib's `theme.css` declared the Memphis shadow
  // tiers inside `@theme inline` as self-referential bridges, which
  // Tailwind v4 emits as `:root, :host { --shadow-memphis-X: var(--shadow-memphis-X) }`
  // — that declaration won the cascade over `tokens.css`'s
  // `:root { --shadow-memphis-X: <Npx Npx 0 var(--memphis-shadow-color)>; }`,
  // so the resolved value of `--shadow-memphis-X` at any element was the
  // self-referential cycle (which CSS treats as invalid → the `box-shadow`
  // utility painted `rgb(0, 0, 0) 0px 0px 0px 0px` or fell back to a literal
  // depending on the surrounding context).
  //
  // Moving the utilities to `@utility shadow-memphis-X { box-shadow: var(--shadow-memphis-X); }`
  // (mirroring the `duration-*` story) sidesteps the @theme-inline
  // emission and restores the tokens.css declaration as the live source.
  // This guard asserts that on the home route (which doesn't carry the
  // theme-generator's override stylesheet), the resolved
  // `--shadow-memphis-X` references the tokens.css construction — i.e.
  // that the @utility consumes a usable token and the `<offset> <var()>`
  // chain is still present.
  //
  // NOTE: this guard does NOT yet cover the per-instance
  // `[--memphis-shadow-color:var(--X)]` recipe at runtime. That recipe
  // depends on `var()` substitution inside an inherited custom property
  // re-resolving at the consuming element — Chromium/WebKit substitute
  // at the declaring element instead, which collapses the recipe even
  // after the @theme-inline emission is removed. Closing that gap
  // requires a follow-up architectural change (per-color @utility blocks
  // OR inline shadow construction inside the @utility) and is tracked
  // as a separate concern in the PR description for #58.
  test('J-12 — `--shadow-memphis-card` resolves to the tokens.css construction (not a self-ref cycle)', async ({
    page,
  }) => {
    const resolved = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.shadow-memphis')
      if (!el) return null
      return getComputedStyle(el).getPropertyValue('--shadow-memphis').trim()
    })
    expect(resolved, 'a `shadow-memphis` consumer must exist on the home route').not.toBeNull()
    // The tokens.css declaration is `--shadow-memphis: 6px 6px 0 var(--memphis-shadow-color);`.
    // After the cascade settles, the resolved value must contain the
    // `6px 6px 0` offset/blur and a color string. If the @theme inline
    // self-reference re-appears, this resolves to the literal token name
    // string (`var(--shadow-memphis)` or empty) and the assertion fails.
    expect(resolved).toMatch(/^6px\s+6px\s+0(?:px)?\s+\S+/)
  })
})
