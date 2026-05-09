import { test, expect, type Page } from '@playwright/test'

/**
 * Runtime regression guard for issue #93 — Palette refresh round 2.
 *
 * These three tests verify CSS specificity / cascade behavior that unit tests
 * cannot exercise:
 *
 * 1. Cyberpunk light `--primary-foreground` override: the palette block's
 *    `--primary-foreground: var(--ink-900)` must beat the `:root` default
 *    `#ffffff` when `data-palette='cyberpunk'` is set.
 *
 * 2. Sunset dark `--memphis-border-color` override: the 2-attribute selector
 *    `[data-theme='dark'][data-palette='sunset']` must resolve to `#000000`,
 *    beating the gh-91 single-attribute dark default `#cccccc`.
 *
 * 3. Forest no-override sanity: `--primary` and `--primary-foreground` should
 *    resolve to the Forest-palette values without any override touching them
 *    (`brand.500 = #a8590e` for primary, `#ffffff` for primary-foreground).
 *
 * Seeding pattern (mirrors `dark-theme-tokens.spec.ts` from gh-91):
 *   localStorage.setItem('palette', '…') → page.reload() →
 *   waitForFunction(data-palette attr equals the seeded value).
 *
 * All tests run on `/theme-generator`, which wires `data-palette` to the DOM
 * via the `usePersistedAttr('palette', 'data-palette', 'default')` hook.
 *
 * See `_bmad-output/implementation-artifacts/spec-gh-93-palette-refresh-r2.md`.
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

const parseRgbTriplet = (value: string): [number, number, number] | null => {
  const m = value
    .trim()
    .match(/rgba?\(\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)/i)
  if (!m) return null
  return [Number(m[1]), Number(m[2]), Number(m[3])]
}

const expectChannelsClose = (
  actual: [number, number, number] | null,
  expected: readonly [number, number, number],
  label: string,
  tolerance = 2,
) => {
  expect(actual, `${label}: expected an rgb triplet, got null`).not.toBeNull()
  const [ar, ag, ab] = actual!
  const [er, eg, eb] = expected
  expect(
    Math.abs(ar - er),
    `${label} R: got ${ar}, expected ${er}±${tolerance}`,
  ).toBeLessThanOrEqual(tolerance)
  expect(
    Math.abs(ag - eg),
    `${label} G: got ${ag}, expected ${eg}±${tolerance}`,
  ).toBeLessThanOrEqual(tolerance)
  expect(
    Math.abs(ab - eb),
    `${label} B: got ${ab}, expected ${eb}±${tolerance}`,
  ).toBeLessThanOrEqual(tolerance)
}

/**
 * Seed `localStorage.palette` and wait for the hook's `useEffect` to apply
 * `data-palette` to `<html>`. A reload is required because the effect only
 * hydrates from storage on mount (same design as the `theme` / `density` attrs).
 */
async function enablePalette(page: Page, palette: string) {
  await page.evaluate((p) => {
    window.localStorage.setItem('palette', p)
  }, palette)
  await page.reload()
  await page.waitForFunction(
    (p) => document.documentElement.getAttribute('data-palette') === p,
    palette,
    { timeout: 5000 },
  )
}

/**
 * Seed both `data-theme='dark'` and `data-palette=<palette>` on `<html>`.
 * Order: set both storage keys, reload once, then wait for BOTH attributes.
 */
async function enableDarkPalette(page: Page, palette: string) {
  await page.evaluate((p) => {
    window.localStorage.setItem('theme', 'dark')
    window.localStorage.setItem('palette', p)
  }, palette)
  await page.reload()
  await page.waitForFunction(
    (p) =>
      document.documentElement.getAttribute('data-theme') === 'dark' &&
      document.documentElement.getAttribute('data-palette') === p,
    palette,
    { timeout: 5000 },
  )
}

/**
 * Read a CSS custom property from the computed style of `<html>` (`:root`).
 * Equivalent to reading the cascade value in the browser — not the raw declared
 * value in any single rule block.
 */
async function readRootVar(page: Page, name: string): Promise<string> {
  return page.evaluate(
    (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
    name,
  )
}

/**
 * Probe pattern from `dark-theme-tokens.spec.ts`: create an off-screen `<div>`,
 * assign `style.color = 'var(--X)'`, then read `getComputedStyle(probe).color`.
 * The browser resolves all `var()` references in the cascade before painting,
 * so this yields the fully-resolved hex-equivalent RGB triplet.
 */
async function probeVarAsColor(page: Page, cssVar: string): Promise<string> {
  return page.evaluate((v) => {
    const probe = document.createElement('div')
    probe.style.cssText = `position:absolute;left:-9999px;color:${v};`
    document.body.appendChild(probe)
    const result = getComputedStyle(probe).color
    probe.remove()
    return result
  }, `var(${cssVar})`)
}

// ─── Tests ───────────────────────────────────────────────────────────────────

test.describe('Palette refresh r2 — runtime CSS cascade (#93)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate first so we can seed localStorage on the same origin before
    // the reload that triggers usePersistedAttr hydration.
    await page.goto('/theme-generator')
  })

  // ── Test 1: Cyberpunk light primary-foreground override ─────────────────
  //
  // CSS in theme.css:
  //   :root, :root[data-theme='light'] { --primary-foreground: #ffffff; }
  //   :root[data-palette='cyberpunk']  { --primary-foreground: var(--ink-900); }
  //
  // The palette block is declared AFTER the light block in source order, so at
  // equal specificity (0,1,0) it wins. ink.900 for cyberpunk = #170731.
  test('cyberpunk light: --primary-foreground resolves to ink.900 (#170731), not white', async ({
    page,
  }) => {
    await enablePalette(page, 'cyberpunk')

    const color = await probeVarAsColor(page, '--primary-foreground')

    // Verify dark theme is NOT set (this is the light-mode test)
    const themeAttr = await page.evaluate(
      () => document.documentElement.getAttribute('data-theme') ?? 'none',
    )
    expect(themeAttr, 'test pre-condition: should be in light mode').not.toBe('dark')

    // ink.900 cyberpunk = #170731 → rgb(23, 7, 49)
    expectChannelsClose(
      parseRgbTriplet(color),
      [23, 7, 49],
      '--primary-foreground (cyberpunk light)',
    )

    // Explicit negative assertion: must NOT be white (#ffffff)
    const triplet = parseRgbTriplet(color)
    expect(
      triplet,
      '--primary-foreground must not be white (would mean palette override lost the cascade)',
    ).not.toEqual([255, 255, 255])
  })

  // ── Test 2: Sunset dark memphis-border override ─────────────────────────
  //
  // CSS in theme.css:
  //   :root[data-theme='dark']                      { --memphis-border-color: #cccccc; }
  //   :root[data-theme='dark'][data-palette='sunset'] { --memphis-border-color: #000000; }
  //
  // The 2-attribute selector has specificity (0,2,0) which beats the
  // single-attribute dark block (0,1,0), so the border should resolve to black.
  test('sunset dark: --memphis-border-color resolves to #000000, not cccccc', async ({ page }) => {
    await enableDarkPalette(page, 'sunset')

    // The probe pattern for a color that is not a standard RGB-mapped value:
    // use backgroundColor to avoid browser heuristics that may suppress
    // invisible colors. border-color properties via getComputedStyle also work
    // but require a rendered element with an actual border; the color var probe
    // is simpler and sufficient.
    const color = await page.evaluate(() => {
      const probe = document.createElement('div')
      probe.style.cssText = `position:absolute;left:-9999px;background-color:var(--memphis-border-color);`
      document.body.appendChild(probe)
      const result = getComputedStyle(probe).backgroundColor
      probe.remove()
      return result
    })

    // #000000 → rgb(0, 0, 0)
    expectChannelsClose(parseRgbTriplet(color), [0, 0, 0], '--memphis-border-color (sunset dark)')

    // Negative assertion: must NOT be the gh-91 dark default #cccccc
    const triplet = parseRgbTriplet(color)
    expect(
      triplet,
      '--memphis-border-color must not be #cccccc (would mean 2-attr selector lost the cascade)',
    ).not.toEqual([204, 204, 204])
  })

  // ── Test 3: Forest no-override sanity ───────────────────────────────────
  //
  // Forest has no semantic overrides — `computeSemanticLight` derives all
  // values from the raw palette unchanged. Checks:
  //   --primary          = brand.500 = #a8590e → rgb(168, 89, 14)
  //   --primary-foreground = #ffffff (canonical `:root` default, NOT overridden)
  test('forest light: --primary resolves to brand.500 (#a8590e) and --primary-foreground stays white', async ({
    page,
  }) => {
    await enablePalette(page, 'forest')

    // /theme-generator injects a `<style id="theme-generator-overrides">` tag
    // emitting the active state's palette+semantic; the MutationObserver on
    // `data-palette` re-applies it after we seed the attribute. Webkit lands
    // there a beat later than chromium, so poll until the cascade settles on
    // the forest brand instead of probing once.
    await expect
      .poll(async () => parseRgbTriplet(await probeVarAsColor(page, '--primary'))?.[0], {
        timeout: 5000,
      })
      .toBeLessThanOrEqual(170) // forest brand.500 R = 168 (plum default would be 196)

    const [primaryColor, primaryFgColor] = await Promise.all([
      probeVarAsColor(page, '--primary'),
      probeVarAsColor(page, '--primary-foreground'),
    ])

    // brand.500 for forest = #a8590e → rgb(168, 89, 14)
    expectChannelsClose(parseRgbTriplet(primaryColor), [168, 89, 14], '--primary (forest)')

    // --primary-foreground must be the unmodified default white (#ffffff)
    expectChannelsClose(
      parseRgbTriplet(primaryFgColor),
      [255, 255, 255],
      '--primary-foreground (forest — no override)',
    )
  })
})
