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
 *  5) **NOT covered here**: the per-instance
 *     `[--memphis-shadow-color:var(--primary)]` recipe (Button ghost,
 *     Input focus, Dialog danger, Toast variants). At the time of writing,
 *     this recipe is broken at runtime in this codebase: the lib's
 *     `theme.css` declares `@theme inline { --shadow-memphis:
 *     var(--shadow-memphis); }`, which compiles into a
 *     `:root, :host { --shadow-memphis: var(--shadow-memphis); }`
 *     declaration that wins over the lib's `tokens.css`
 *     `:root { --shadow-memphis: 6px 6px 0 var(--memphis-shadow-color); }`
 *     in cascade. The per-instance `--memphis-shadow-color` override has
 *     nowhere to flow because `--shadow-memphis` no longer references
 *     it. Consumer components (Button ghost etc.) render the lib's
 *     resolved-at-build-time literal `6px 6px 0 #000000` regardless of
 *     the per-instance override. Tracked separately — see
 *     `core-knowledge/10-library/10-components/button.md` Open question.
 */

const parseRgb = (color: string | null): [number, number, number] | null => {
  if (!color) return null
  const match = color.match(
    /(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)/,
  )
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
const parseLastNonTransparentRgb = (
  shadow: string | null,
): [number, number, number] | null => {
  if (!shadow) return null
  const triplets: Array<{ r: number; g: number; b: number; alpha: number | null }> = []
  const re = /rgba?\(\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)(?:\s*[,/]\s*(\d+(?:\.\d+)?))?\s*\)/gi
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
  expect(Math.abs(ar - er), `R: got ${ar}, expected ${er}±${tolerance}`).toBeLessThanOrEqual(tolerance)
  expect(Math.abs(ag - eg), `G: got ${ag}, expected ${eg}±${tolerance}`).toBeLessThanOrEqual(tolerance)
  expect(Math.abs(ab - eb), `B: got ${ab}, expected ${eb}±${tolerance}`).toBeLessThanOrEqual(tolerance)
}

async function setRootTokenAndSettle(page: import('@playwright/test').Page, token: string, value: string) {
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

  test('J-03 intents — overriding --primary paints any bg-primary consumer', async ({
    page,
  }) => {
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
    const offsets = computedShadow!.match(/(\d+(?:\.\d+)?)px\s+(\d+(?:\.\d+)?)px(?=\s+0px\s+0px[^,]*$)/)
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
})
