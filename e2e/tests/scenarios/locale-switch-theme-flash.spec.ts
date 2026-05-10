import { test, expect } from '@playwright/test'

/**
 * Regression guard for fix/locale-switch-theme-flash (PR #99).
 *
 * The docs site previously flashed light theme for one frame on any cold
 * reload when the user had a non-default theme persisted in localStorage.
 * The pain point was the locale switcher: clicking "Italiano" triggers
 * `window.location.reload()` to refresh RSC chrome, and the SSR'd HTML had
 * `data-theme="light"` hardcoded — visible until JS re-applied dark.
 *
 * The fix has two layers:
 *   1. A synchronous inline FOUC script in <head> reads localStorage and
 *      applies `data-theme` / `data-palette` / `data-density` to <html>
 *      before <body> parses, so the very first paint has the user's attrs.
 *   2. `usePersistedAttr` lazy-inits `useState` from localStorage on the
 *      client so React's first commit doesn't undo what the script set.
 *
 * Test strategy
 * ─────────────
 * After reload, Playwright auto-waits for `domcontentloaded` before returning
 * from `page.reload()`. At that moment the inline <head> script has already
 * run and the attribute is set. We read `data-theme` immediately — before
 * `networkidle`, before React hydration — and assert it equals 'dark'.
 * If the FOUC script were absent the value would still be 'light' at this
 * point.
 *
 * The webkit reload-after-cookie-write race quarantined in i18n-switcher.spec.ts
 * also applies to the locale-switch test below; the same skip guard is used.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Seed localStorage and reload. Returns immediately after DOMContentLoaded —
 * we intentionally do NOT wait for networkidle so we read the attribute at
 * the earliest possible moment (right after the FOUC script runs).
 */
async function seedAndReload(
  page: import('@playwright/test').Page,
  storage: Record<string, string>,
) {
  for (const [key, value] of Object.entries(storage)) {
    await page.evaluate(([k, v]) => window.localStorage.setItem(k, v), [key, value] as [
      string,
      string,
    ])
  }
  // `waitUntil: 'commit'` fires after the first byte of the response is
  // received, which is the earliest event after which the inline <head>
  // script has run. 'domcontentloaded' is the standard Playwright default
  // and is safe here — by DOMContentLoaded the synchronous <head> script
  // has definitely executed.
  await page.reload({ waitUntil: 'domcontentloaded' })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('FOUC prevention — theme persisted across cold reload (PR #99)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Clear all storage so each test starts from a known blank slate.
    await page.evaluate(() => {
      window.localStorage.clear()
    })
    await page.context().clearCookies()
    // Reload so the server resolves the cleared cookie → default 'en' locale.
    // Wait for networkidle as a hydration proxy (mirrors i18n-switcher.spec.ts
    // beforeEach) so interactive elements are ready before any test asserts them.
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  // ── Test 1 ──────────────────────────────────────────────────────────────
  // Cold reload with dark theme persisted: data-theme must already be 'dark'
  // at DOMContentLoaded, before React hydration.
  test('cold reload preserves dark theme without flash', async ({ page }) => {
    // Seed dark theme then reload.
    await seedAndReload(page, { theme: 'dark' })

    // Read immediately — no networkidle, no hydration wait.
    // If the FOUC script ran correctly the attribute is 'dark' right now.
    const attrAfterReload = await page.locator('html').getAttribute('data-theme')
    expect(attrAfterReload).toBe('dark')

    // Also wait for hydration to confirm React doesn't undo the attribute.
    await page.waitForLoadState('networkidle')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  // ── Test 2 ──────────────────────────────────────────────────────────────
  // Cold reload with all three axes persisted: each attribute is correct.
  test('cold reload preserves palette and density without flash', async ({ page }) => {
    await seedAndReload(page, {
      theme: 'dark',
      palette: 'cyberpunk',
      density: 'compact',
    })

    const html = page.locator('html')
    // Read immediately at DOMContentLoaded.
    expect(await html.getAttribute('data-theme')).toBe('dark')
    expect(await html.getAttribute('data-palette')).toBe('cyberpunk')
    expect(await html.getAttribute('data-density')).toBe('compact')

    // Confirm stable after hydration.
    await page.waitForLoadState('networkidle')
    await expect(html).toHaveAttribute('data-theme', 'dark')
    await expect(html).toHaveAttribute('data-palette', 'cyberpunk')
    await expect(html).toHaveAttribute('data-density', 'compact')
  })

  // ── Test 3 ──────────────────────────────────────────────────────────────
  // Invalid persisted values must not be written by the FOUC script
  // (allow-list validation).
  test('FOUC script ignores invalid persisted theme value', async ({ page }) => {
    await seedAndReload(page, { theme: 'INVALID_THEME' })

    // Script should leave the SSR default ('light') untouched for unknown values.
    const attrAfterReload = await page.locator('html').getAttribute('data-theme')
    // The FOUC script validates against the allow-list; an unknown value
    // must not be applied. SSR default is 'light'.
    expect(attrAfterReload).toBe('light')
  })

  // ── Test 4 ──────────────────────────────────────────────────────────────
  // Locale switch preserves dark theme (the primary regression scenario).
  // The locale switcher calls window.location.reload() after writing the
  // cookie. Before the fix, the reload landed on SSR'd light theme.
  test('locale switch from EN to IT preserves dark theme', async ({ page, browserName }) => {
    // Same webkit race as in i18n-switcher.spec.ts — the reload triggered by
    // handleLocaleChange races the cookie persistence in webkit on GHA runners.
    test.skip(browserName === 'webkit', 'webkit reload-after-cookie-write race; tracked separately')

    // beforeEach left the page on the default EN locale, hydrated. Seed dark
    // theme and reload so the FOUC script picks it up, then wait for the page
    // to be interactive before touching the popover.
    await page.evaluate(() => window.localStorage.setItem('theme', 'dark'))
    await page.reload({ waitUntil: 'networkidle' })
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // Open the preferences popover and switch to Italian. The popover must be
    // fully visible before clicking "Italiano" to avoid the click being eaten.
    await page.getByRole('button', { name: 'Display settings' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Italiano' }).click()

    // handleLocaleChange fires window.location.reload(). Wait for the new
    // page to reach DOMContentLoaded — the FOUC script runs in that window.
    await page.waitForLoadState('domcontentloaded')

    const html = page.locator('html')

    // Primary assertion: theme must already be 'dark' immediately after
    // DOMContentLoaded (FOUC script applied it before <body> parsed).
    const themeAtReload = await html.getAttribute('data-theme')
    expect(themeAtReload).toBe('dark')

    // Wait for full hydration, then confirm both locale and theme are stable.
    await page.waitForLoadState('networkidle')
    // lang / data-locale are set by the RSC render + usePersistedLocale.
    await expect(html).toHaveAttribute('lang', 'it')
    // Theme must still be dark — React must not have reset it.
    await expect(html).toHaveAttribute('data-theme', 'dark')
  })

  // ── Test 5 ──────────────────────────────────────────────────────────────
  // Switching back from IT to EN still preserves dark theme.
  test('locale switch back from IT to EN preserves dark theme', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'webkit reload-after-cookie-write race; tracked separately')

    // Seed Italian locale so the page starts in IT.
    await page.evaluate(() => {
      window.localStorage.setItem('theme', 'dark')
      window.localStorage.setItem('locale', 'it')
    })
    // Write the NEXT_LOCALE cookie directly so the RSC render uses IT.
    await page.context().addCookies([
      {
        name: 'NEXT_LOCALE',
        value: 'it',
        domain: 'localhost',
        path: '/',
      },
    ])
    await page.goto('/', { waitUntil: 'networkidle' })

    // Should be on IT chrome now.
    await expect(page.locator('html')).toHaveAttribute('lang', 'it')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // Switch back to English via the IT-labelled trigger. Mirror the
    // i18n-switcher.spec.ts pattern: wait for networkidle (hydration proxy)
    // before clicking, then assert the dialog is visible before acting inside it.
    await page.waitForLoadState('networkidle')
    const itTrigger = page.getByRole('button', { name: 'Impostazioni di visualizzazione' })
    await expect(itTrigger).toBeVisible()
    await itTrigger.click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: 'English' }).click()

    await page.waitForLoadState('domcontentloaded')

    // Theme must be dark immediately after reload.
    const themeAtReload = await page.locator('html').getAttribute('data-theme')
    expect(themeAtReload).toBe('dark')

    await page.waitForLoadState('networkidle')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })
})
