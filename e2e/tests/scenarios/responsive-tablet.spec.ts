import { test, expect } from '@playwright/test'

// Tablet portrait (768px = the `md` breakpoint, still below `lg`). This is the
// in-between state: the header nav is inline (>= md) while the docs and
// theme-generator sidebars are still drawers (< lg). Guards the md/lg interplay.
const TABLET = { width: 768, height: 1024 }
const MENU = /open menu|apri menu/i
const TOGGLE = /toggle navigation|navigazione/i

const noHorizontalOverflow = (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

test.use({ viewport: TABLET })

test.describe('Tablet 768px — header inline, sidebars as drawers', () => {
  test('header shows inline nav, no hamburger', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: MENU })).toBeHidden()
    await expect(
      page.locator('header').getByRole('link', { name: 'Docs', exact: true }),
    ).toBeVisible()
  })

  test('docs sidebar is a drawer (trigger shown), no overflow', async ({ page }) => {
    await page.goto('/docs/getting-started')
    await expect(page.getByRole('button', { name: TOGGLE })).toBeVisible()
    await expect(page.locator('aside')).toBeHidden()
    expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(1)
  })

  test('theme generator editor is a drawer, no overflow', async ({ page }) => {
    await page.goto('/theme-generator')
    await expect(page.getByRole('button', { name: TOGGLE })).toBeVisible()
    expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(1)
  })
})
