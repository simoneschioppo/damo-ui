import { test, expect, type Page } from '@playwright/test'

/**
 * Runtime regression guard for issue #66 — per-color tinted Memphis shadows.
 *
 * Background: PR #65 fixed the structural cascade for `--shadow-memphis-X`
 * but left the per-instance `[--memphis-shadow-color:var(--X)] shadow-memphis`
 * recipe broken. Browsers substitute `var()` references inside an
 * inherited custom property at the *declaring* element (`:root`), so a
 * consumer redeclaring `--memphis-shadow-color` cannot retroactively
 * re-tint an already-resolved `--shadow-memphis`. Chromium and WebKit
 * both behave this way (verified via no-Tailwind repro in PR #65).
 *
 * Issue #66 replaced the recipe with per-color `@utility` blocks that
 * embed the intent token directly into the box-shadow value, so the
 * substitution happens at the consumer's computed-value time. This spec
 * is the runtime regression guard — it overrides intent tokens at runtime
 * and asserts the painted box-shadow follows.
 *
 * Patterns reused from `theme-generator-token-runtime-propagation.spec.ts`:
 *  - `setProperty(name, value, 'important')` to win over the theme
 *    generator's override stylesheet.
 *  - `parseLastNonTransparentRgb` to skip Tailwind's transparent filler
 *    shadows and isolate the visible Memphis tier.
 *  - ±2 sRGB tolerance for color-channel comparisons.
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

async function setRootTokenAndSettle(page: Page, token: string, value: string) {
  await page.evaluate(
    ({ t, v }) => {
      document.documentElement.style.setProperty(t, v, 'important')
    },
    { t: token, v: value },
  )
  // Memphis transitions are 80ms; allow ~3 frames of headroom.
  await page.waitForTimeout(250)
}

test.describe('#66 — per-color tinted Memphis shadow recipe', () => {
  test('Button ghost paints the active --primary, not black (J-12 + #66)', async ({ page }) => {
    await page.goto('/')

    // The home hero CTA renders a Button ghost. Override --primary at
    // :root and assert the painted box-shadow follows.
    await setRootTokenAndSettle(page, '--primary', 'rgb(255, 0, 128)')
    const computedShadow = await page.evaluate(() => {
      // Button ghost has the new `shadow-memphis-primary` utility. Look
      // for the FIRST element carrying it, which is the home hero CTA.
      const el = document.querySelector<HTMLElement>('.shadow-memphis-primary')
      if (!el) return null
      return getComputedStyle(el).boxShadow
    })
    expect(
      computedShadow,
      'expected at least one `.shadow-memphis-primary` consumer on /',
    ).not.toBeNull()
    expectChannelsClose(parseLastNonTransparentRgb(computedShadow), [255, 0, 128])
  })

  test('Banner danger paints the active --destructive, not black', async ({ page }) => {
    // The Banner docs page renders all four variants statically (no
    // user interaction needed). Banner danger uses the new
    // `shadow-memphis-destructive` utility.
    await page.goto('/docs/components/banner')
    await setRootTokenAndSettle(page, '--destructive', 'rgb(0, 200, 100)')
    const computedShadow = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.shadow-memphis-destructive')
      if (!el) return null
      return getComputedStyle(el).boxShadow
    })
    expect(
      computedShadow,
      'expected at least one `.shadow-memphis-destructive` consumer on /docs/components/banner',
    ).not.toBeNull()
    expectChannelsClose(parseLastNonTransparentRgb(computedShadow), [0, 200, 100])
  })

  test('Button ghost hover state paints --primary (no jolt to black)', async ({ page }) => {
    // Adversarial regression guard: at rest the ghost paints
    // `shadow-memphis-primary`; on hover it switches to
    // `shadow-memphis-primary-hover` (7px offset) — both must follow
    // the same `--primary` override. Pre-fix, hover read the inherited
    // `--memphis-shadow-color` and jolted to default black.
    await page.goto('/')
    await setRootTokenAndSettle(page, '--primary', 'rgb(255, 0, 128)')
    const ghostBtn = page.locator('.shadow-memphis-primary').first()
    await expect(ghostBtn).toBeVisible()
    await ghostBtn.hover()
    // Allow the hover transition to settle (Memphis transitions are 80ms).
    await page.waitForTimeout(250)
    const hoverShadow = await ghostBtn.evaluate((el) => getComputedStyle(el).boxShadow)
    expectChannelsClose(parseLastNonTransparentRgb(hoverShadow), [255, 0, 128])
  })

  test('aria-invalid Input paints --destructive on the focus shadow (state pseudo-class path)', async ({
    page,
  }) => {
    // The aria-invalid:shadow-memphis-destructive path is a state-prefixed
    // utility that compiles differently from a bare class. The Input docs
    // page renders an invalid input statically.
    await page.goto('/docs/components/input')
    await setRootTokenAndSettle(page, '--destructive', 'rgb(140, 30, 200)')
    const invalidInput = page.locator('input[aria-invalid="true"]').first()
    await expect(invalidInput).toBeVisible()
    const shadow = await invalidInput.evaluate((el) => getComputedStyle(el).boxShadow)
    expectChannelsClose(parseLastNonTransparentRgb(shadow), [140, 30, 200])
  })

  test('Banner warning paints --warning (covers non-primary/destructive intents)', async ({
    page,
  }) => {
    // The four Banner variants render statically on the docs page (no
    // trigger required), so this is a more deterministic guard for the
    // success/warning/info intents than triggering a Radix Toast. Each
    // intent migrates the same way; warning is a representative.
    await page.goto('/docs/components/banner')
    await setRootTokenAndSettle(page, '--warning', 'rgb(20, 180, 90)')
    const warningBanner = page.locator('.shadow-memphis-warning').first()
    await expect(warningBanner).toBeVisible()
    const shadow = await warningBanner.evaluate((el) => getComputedStyle(el).boxShadow)
    expectChannelsClose(parseLastNonTransparentRgb(shadow), [20, 180, 90])
  })

  test('default `shadow-memphis` keeps painting --memphis-shadow-color (no regression)', async ({
    page,
  }) => {
    await page.goto('/')
    // The home page renders multiple bare-`shadow-memphis` consumers
    // (Card default, Button primary, etc.) that should keep tracking
    // --memphis-shadow-color (default black). Override the token to a
    // recognizable color and assert the painted shadow follows — proves
    // the legacy non-tinted path is untouched by this PR.
    await setRootTokenAndSettle(page, '--memphis-shadow-color', 'rgb(255, 165, 0)')
    const computedShadow = await page.evaluate(() => {
      // Pick any consumer that has the bare `shadow-memphis` class but
      // NOT a per-color variant — Button primary in the home hero is a
      // safe bet. Filter explicitly to avoid grabbing a tinted sibling.
      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>('.shadow-memphis'),
      ).filter(
        (el) =>
          !el.classList.contains('shadow-memphis-primary') &&
          !el.classList.contains('shadow-memphis-success') &&
          !el.classList.contains('shadow-memphis-warning') &&
          !el.classList.contains('shadow-memphis-destructive') &&
          !el.classList.contains('shadow-memphis-info'),
      )
      const el = candidates[0]
      if (!el) return null
      return getComputedStyle(el).boxShadow
    })
    expect(
      computedShadow,
      'expected at least one bare `.shadow-memphis` consumer on /',
    ).not.toBeNull()
    expectChannelsClose(parseLastNonTransparentRgb(computedShadow), [255, 165, 0])
  })
})
