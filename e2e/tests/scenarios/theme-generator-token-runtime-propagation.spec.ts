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
 * Coverage focused on the highest-value journeys:
 *   J-02/J-03  Semantic surfaces + intents — bg-primary, text-foreground
 *   J-06       Memphis identity            — border-memphis, shadow-memphis tinted
 *   J-12       Shadow Memphis              — shadow-memphis renders the tier value
 *
 * The remaining journeys (status, chrome, fonts, radius, easings) are
 * covered by the source-contract tests; adding them here would multiply
 * the runtime cost without changing the bug class.
 */

/**
 * Parse a CSS color string into [r, g, b] integers. Tolerates browser
 * normalization variance (Chromium emits `rgb(255, 0, 128)`, WebKit may
 * emit `rgb(255 0 128)` or `rgba(255, 0, 128, 1)`). Returns null if the
 * string isn't an rgb/rgba color.
 */
const parseRgb = (color: string | null): [number, number, number] | null => {
  if (!color) return null
  const match = color.match(/(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)/)
  if (!match) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

test.describe('TA — token edits propagate to consumer computed styles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/theme-generator')
    // Ensure the editor's data-motion-preview opt-out is active (PR #48).
    await expect(page.locator('html')).toHaveAttribute('data-motion-preview', '')
  })

  test('J-02 surfaces — overriding --background paints any bg-background consumer', async ({
    page,
  }) => {
    const NEW_BG = 'rgb(255, 0, 128)' // magenta — won't collide with any default

    await page.evaluate((color) => {
      document.documentElement.style.setProperty('--background', color)
    }, NEW_BG)

    // <body> in apps/web's globals.css uses `background: var(--background)`.
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    expect(parseRgb(bodyBg), `body bg should resolve to magenta, got ${bodyBg}`).toEqual([255, 0, 128])
  })

  test('J-03 intents — overriding --primary paints any bg-primary consumer', async ({ page }) => {
    const NEW_PRIMARY = 'rgb(0, 200, 100)' // green

    await page.evaluate((color) => {
      document.documentElement.style.setProperty('--primary', color)
    }, NEW_PRIMARY)

    // The components-preview scene renders many <Button variant="primary">
    // instances with `bg-primary text-primary-foreground …`.
    const btnBg = await page.evaluate(() => {
      const btn = document.querySelector<HTMLButtonElement>('button.bg-primary')
      if (!btn) return null
      return getComputedStyle(btn).backgroundColor
    })
    expect(btnBg, 'a `bg-primary` consumer must exist in the preview').not.toBeNull()
    expect(parseRgb(btnBg), `bg-primary should resolve to ${NEW_PRIMARY}, got ${btnBg}`).toEqual([
      0, 200, 100,
    ])
  })

  test('J-06 Memphis identity — overriding --memphis-border-color retints `border-memphis`', async ({
    page,
  }) => {
    const NEW_BORDER = 'rgb(255, 165, 0)' // orange

    await page.evaluate((color) => {
      document.documentElement.style.setProperty('--memphis-border-color', color)
    }, NEW_BORDER)

    const computedBorder = await page.evaluate(() => {
      // Any Memphis-bordered consumer in the preview pane (Card, Button,
      // Input, Banner …). Match by the className fragment.
      const el = document.querySelector<HTMLElement>('.border-memphis')
      if (!el) return null
      return getComputedStyle(el).borderColor
    })
    expect(computedBorder, 'a `border-memphis` consumer must exist').not.toBeNull()
    expect(parseRgb(computedBorder), `border-memphis should resolve to orange, got ${computedBorder}`).toEqual([
      255, 165, 0,
    ])
  })

  test('J-06 tinted-shadow recipe — per-instance --memphis-shadow-color override is honored', async ({
    page,
  }) => {
    // Button ghost variant overrides --memphis-shadow-color to var(--primary)
    // inline, so its shadow tints with the primary color even though the
    // global token stays black. Verify by changing --primary and re-reading
    // the ghost button's box-shadow.
    const NEW_PRIMARY = 'rgb(50, 100, 200)' // blue

    await page.evaluate((color) => {
      document.documentElement.style.setProperty('--primary', color)
    }, NEW_PRIMARY)

    // The components-preview scene renders ghost buttons via Button.
    // Find one and re-read its box-shadow color.
    const ghostShadow = await page.evaluate(() => {
      // Query any element whose className contains the per-instance override
      // pattern. We accept both spellings (with or without explicit className
      // injection at runtime). We rely on Button ghost's inline class:
      // `[--memphis-shadow-color:var(--primary)]`.
      const candidates = document.querySelectorAll<HTMLElement>('button')
      for (const btn of candidates) {
        if (
          btn.className.includes('[--memphis-shadow-color:var(--primary)]') ||
          btn.className.includes('[--memphis-shadow-color:var(--secondary)]')
        ) {
          return getComputedStyle(btn).boxShadow
        }
      }
      return null
    })

    // If no per-instance-tinted button exists in the current preview scene,
    // the source-contract test (PR #54) already guards the recipe — surface
    // a clear assertion message instead of silently skipping.
    expect(
      ghostShadow,
      'expected at least one button with [--memphis-shadow-color:var(--primary|secondary)] in the components-preview scene; recipe is also guarded by the source-contract test',
    ).not.toBeNull()
    // Match by parsed channels rather than string equality (Webkit/Chromium
    // emit slightly different shadow strings).
    const shadowRgb = parseRgb(ghostShadow)
    expect(shadowRgb, `expected shadow string to contain rgb channels, got ${ghostShadow}`).toEqual([
      50, 100, 200,
    ])
  })

  test('J-12 Shadow Memphis — overriding --shadow-memphis paints the resolved value', async ({
    page,
  }) => {
    const NEW_SHADOW = '12px 12px 0 rgb(255, 0, 0)'

    await page.evaluate((value) => {
      document.documentElement.style.setProperty('--shadow-memphis', value)
    }, NEW_SHADOW)

    const computedShadow = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.shadow-memphis')
      if (!el) return null
      return getComputedStyle(el).boxShadow
    })
    expect(computedShadow, 'a `shadow-memphis` consumer must exist').not.toBeNull()
    // Browsers normalise the shadow string differently. Match by parsed
    // channels and offset numbers rather than substring.
    expect(parseRgb(computedShadow), `expected shadow rgb channels for red, got ${computedShadow}`).toEqual([
      255, 0, 0,
    ])
    expect(computedShadow).toMatch(/12px\s+12px/)
  })
})
