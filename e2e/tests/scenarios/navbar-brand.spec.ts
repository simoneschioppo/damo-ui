import { test, expect } from '@playwright/test'

const SITE_NAME = 'Axolab'
const LIB_NAME_LEGACY = 'DAMO · UI'

test.describe('Navbar brand', () => {
  test('shows the mascot inside a link to home with accessible site name', async ({ page }) => {
    await page.goto('/')
    const brandLink = page.getByRole('link', { name: new RegExp(`${SITE_NAME} home`, 'i') })
    await expect(brandLink).toBeVisible()
    await expect(brandLink).toHaveAttribute('href', '/')

    const mascot = brandLink.locator('img[src="/mascot.png"]')
    await expect(mascot).toBeVisible()
    await expect(mascot).toHaveAttribute('alt', '')
  })

  test('does not surface the legacy library wordmark in the navbar', async ({ page }) => {
    await page.goto('/')
    const navbar = page.getByRole('banner')
    await expect(navbar).toBeVisible()
    await expect(navbar.getByText(LIB_NAME_LEGACY)).toHaveCount(0)
  })

  test('shows the site name as a visible wordmark next to the mascot', async ({ page }) => {
    await page.goto('/')
    const navbar = page.getByRole('banner')
    await expect(navbar.getByText(SITE_NAME, { exact: true })).toBeVisible()
  })

  test('document title contains both the site name and the library name', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Axolab.*Damo UI/)
  })
})
