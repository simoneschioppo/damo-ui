import { test, expect } from '@playwright/test'

/**
 * E2E coverage for the docs-site language switcher (story 1.1).
 *
 * Default locale is English. Switching to Italiano via the preferences menu:
 *   - flips `<html lang>` from `en` to `it`
 *   - persists to `localStorage.locale` AND the `NEXT_LOCALE` cookie
 *   - re-renders the docs chrome (nav, sidebar group titles) in Italian on
 *     the next request (the switcher fires a reload to materialise this)
 */
test.describe('i18n switcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.localStorage.clear())
    await page.context().clearCookies()
    await page.reload()
  })

  test('defaults to English and the menu shows the Language axis', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await page.getByRole('button', { name: 'Display settings' }).click()
    const popover = page.getByRole('dialog')
    await expect(popover.getByText('Language', { exact: true })).toBeVisible()
    await expect(popover.getByRole('button', { name: 'English' })).toBeVisible()
    await expect(popover.getByRole('button', { name: 'Italiano' })).toBeVisible()
  })

  test('switching to Italiano flips html lang, persists, and translates the nav', async ({
    page,
  }) => {
    // Top-bar nav reads from translations: EN "Docs" / "Theme Generator".
    await expect(page.getByRole('link', { name: 'Docs', exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Display settings' }).click()
    await page.getByRole('button', { name: 'Italiano' }).click()

    // The switcher fires a reload so the RSC chrome re-renders in IT.
    // Wait on a content assertion that becomes true only after rerender —
    // `networkidle` was flaky in CI under load.
    await expect(page.locator('html')).toHaveAttribute('lang', 'it')
    await expect(page.locator('html')).toHaveAttribute('data-locale', 'it')

    const persisted = await page.evaluate(() => window.localStorage.getItem('locale'))
    expect(persisted).toBe('it')

    const cookies = await page.context().cookies()
    const localeCookie = cookies.find((c) => c.name === 'NEXT_LOCALE')
    expect(localeCookie?.value).toBe('it')

    // Italian nav copy now visible.
    await expect(page.getByRole('link', { name: 'Documentazione', exact: true })).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Generatore di Tema', exact: true }),
    ).toBeVisible()
  })

  test('switching back to English restores EN chrome', async ({ page }) => {
    await page.getByRole('button', { name: 'Display settings' }).click()
    await page.getByRole('button', { name: 'Italiano' }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'it')

    await page.getByRole('button', { name: 'Impostazioni di visualizzazione' }).click()
    await page.getByRole('button', { name: 'English' }).click()

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('link', { name: 'Docs', exact: true })).toBeVisible()
  })
})
