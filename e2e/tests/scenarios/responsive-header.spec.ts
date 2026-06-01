import { test, expect } from '@playwright/test'

// Below `md` the AppTopBar nav collapses into a hamburger-driven drawer, so the
// one-row header never wraps and spills over page content (which previously
// intercepted taps on mobile).
const MOBILE = { width: 390, height: 844 }
const DESKTOP = { width: 1280, height: 900 }
const MENU = /open menu|apri menu/i

test.describe('Site header — mobile menu (< md)', () => {
  test.use({ viewport: MOBILE })

  test('shows the hamburger menu button', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: MENU })).toBeVisible()
  })

  test('does not spill the header over the page content', async ({ page }) => {
    await page.goto('/theme-generator')
    // The point just below the 56px header must be page content, not a header
    // descendant (the pre-fix wrapped nav spilled to ~y100 and intercepted taps).
    const isHeader = await page.evaluate(() => {
      const el = document.elementFromPoint(20, 92)
      return !!el?.closest('header')
    })
    expect(isHeader).toBe(false)
  })

  test('opens the nav in a drawer and lists the links', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: MENU }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'Docs', exact: true })).toBeVisible()
  })
})

test.describe('Site header — desktop (>= md)', () => {
  test.use({ viewport: DESKTOP })

  test('shows inline nav and hides the hamburger', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: MENU })).toBeHidden()
    await expect(
      page.locator('header').getByRole('link', { name: 'Docs', exact: true }),
    ).toBeVisible()
  })
})
