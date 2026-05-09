import { test, expect, type Page } from '@playwright/test'

/**
 * Runtime regression guard for issues #93 + #95 — Palette refresh r2 / r2.5.
 *
 * These three tests verify CSS specificity / cascade behavior that unit tests
 * cannot exercise:
 *
 * 1. Cyberpunk light primary stack (post-gh-95): `--primary` must resolve to
 *    the cyan brand.500 = `#0f766e`, and `--primary-foreground` must stay
 *    canonical white. gh-95 dropped the gh-93 ink.900 override because the
 *    deep teal contrasts AA with white on its own.
 *
 * 2. Sunset dark `--memphis-border-color` override (gh-93): the 2-attribute
 *    selector `[data-theme='dark'][data-palette='sunset']` must resolve to
 *    `#000000`, beating the gh-91 single-attribute dark default `#cccccc`.
 *
 * 3. Forest no-override sanity (gh-95): `--primary` resolves to copper rust
 *    `brand.500 = #8e4318` and `--primary-foreground` stays canonical white.
 *
 * Seeding pattern (mirrors `dark-theme-tokens.spec.ts` from gh-91):
 *   localStorage.setItem('palette', '…') → page.reload() →
 *   waitForFunction(data-palette attr equals the seeded value).
 *
 * All tests run on `/theme-generator`, which wires `data-palette` to the DOM
 * via the `usePersistedAttr('palette', 'data-palette', 'default')` hook.
 *
 * Specs: `_bmad-output/implementation-artifacts/spec-gh-93-palette-refresh-r2.md`
 *      + `_bmad-output/implementation-artifacts/spec-gh-95-palette-r2-light-rebalance.md`.
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

  // ── Test 1: Cyberpunk light primary stack (gh-95) ───────────────────────
  //
  // CSS in theme.css:
  //   :root[data-palette='cyberpunk'] { --brand-500: #0f766e; --paper-50: #f3fbfa; ... }
  //
  // gh-95 dropped the gh-93 light-only `--primary-foreground: var(--ink-900)`
  // override because deep teal `#0f766e` contrasts AA with white. The probe
  // verifies the new --primary value AND that --primary-foreground stays
  // canonical white in light mode.
  test('cyberpunk light: --primary resolves to teal #0f766e and --primary-foreground stays white', async ({
    page,
  }) => {
    await enablePalette(page, 'cyberpunk')

    // Wait for the theme-generator's runtime <style id="theme-generator-overrides">
    // tag to catch up with the data-palette MutationObserver dispatch.
    await expect
      .poll(async () => parseRgbTriplet(await probeVarAsColor(page, '--primary'))?.[1], {
        timeout: 5000,
      })
      .toBeGreaterThanOrEqual(110) // teal G channel = 118; default plum.G = 148, so >=110 confirms cyberpunk

    const themeAttr = await page.evaluate(
      () => document.documentElement.getAttribute('data-theme') ?? 'none',
    )
    expect(themeAttr, 'test pre-condition: should be in light mode').not.toBe('dark')

    const [primaryColor, primaryFgColor] = await Promise.all([
      probeVarAsColor(page, '--primary'),
      probeVarAsColor(page, '--primary-foreground'),
    ])

    // brand.500 cyberpunk = #0f766e → rgb(15, 118, 110)
    expectChannelsClose(
      parseRgbTriplet(primaryColor),
      [15, 118, 110],
      '--primary (cyberpunk light)',
    )

    // gh-95: --primary-foreground stays canonical white (no override applied)
    expectChannelsClose(
      parseRgbTriplet(primaryFgColor),
      [255, 255, 255],
      '--primary-foreground (cyberpunk light — no override post-gh-95)',
    )
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

    // The theme-generator's runtime <style> tag emits the override under a
    // selector that includes data-palette + data-theme. On webkit the
    // MutationObserver dispatch + next React render lands a beat later than
    // chromium, so poll until the cascade settles to black.
    const probeBorderColor = async () => {
      return page.evaluate(() => {
        const probe = document.createElement('div')
        probe.style.cssText = `position:absolute;left:-9999px;background-color:var(--memphis-border-color);`
        document.body.appendChild(probe)
        const result = getComputedStyle(probe).backgroundColor
        probe.remove()
        return result
      })
    }

    await expect
      .poll(async () => parseRgbTriplet(await probeBorderColor())?.[0], { timeout: 5000 })
      .toBeLessThanOrEqual(20) // sunset-dark override → R=0; gh-91 default → R=204

    const color = await probeBorderColor()

    // #000000 → rgb(0, 0, 0)
    expectChannelsClose(parseRgbTriplet(color), [0, 0, 0], '--memphis-border-color (sunset dark)')

    // Negative assertion: must NOT be the gh-91 dark default #cccccc
    const triplet = parseRgbTriplet(color)
    expect(
      triplet,
      '--memphis-border-color must not be #cccccc (would mean 2-attr selector lost the cascade)',
    ).not.toEqual([204, 204, 204])
  })

  // ── Test 3: Forest no-override sanity (gh-95) ───────────────────────────
  //
  // Forest has no semantic overrides — `computeSemanticLight` derives all
  // values from the raw palette unchanged. After gh-95:
  //   --primary          = brand.500 = #8e4318 → rgb(142, 67, 24)
  //   --primary-foreground = #ffffff (canonical `:root` default, NOT overridden)
  test('forest light: --primary resolves to brand.500 (#8e4318) and --primary-foreground stays white', async ({
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
      .toBeLessThanOrEqual(150) // forest brand.500 R = 142 (plum default would be 196)

    const [primaryColor, primaryFgColor] = await Promise.all([
      probeVarAsColor(page, '--primary'),
      probeVarAsColor(page, '--primary-foreground'),
    ])

    // brand.500 for forest (gh-95) = #8e4318 → rgb(142, 67, 24)
    expectChannelsClose(parseRgbTriplet(primaryColor), [142, 67, 24], '--primary (forest)')

    // --primary-foreground must be the unmodified default white (#ffffff)
    expectChannelsClose(
      parseRgbTriplet(primaryFgColor),
      [255, 255, 255],
      '--primary-foreground (forest — no override)',
    )
  })
})
