import { test, expect } from '@playwright/test'

const LIB_NAME = 'Damo UI'
const LEGACY_BRAND = 'DAMO · UI'

test.describe('Navbar brand', () => {
  test('shows the mascot inside a link to home with accessible library name', async ({ page }) => {
    await page.goto('/')
    const brandLink = page.getByRole('link', { name: new RegExp(`${LIB_NAME} home`, 'i') })
    await expect(brandLink).toBeVisible()
    await expect(brandLink).toHaveAttribute('href', '/')

    const mascot = brandLink.locator('img[src="/mascot.png"]')
    await expect(mascot).toBeVisible()
    await expect(mascot).toHaveAttribute('alt', '')
  })

  test('does not surface the legacy DAMO · UI wordmark in the navbar', async ({ page }) => {
    await page.goto('/')
    const navbar = page.getByRole('banner')
    await expect(navbar).toBeVisible()
    await expect(navbar.getByText(LEGACY_BRAND)).toHaveCount(0)
  })

  test('does not surface a textual wordmark next to the mascot', async ({ page }) => {
    await page.goto('/')
    const brandLink = page.getByRole('banner').getByRole('link', { name: /Damo UI home/i })
    const text = (await brandLink.innerText()).trim()
    expect(text).toBe('')
  })

  test('document title contains the library name', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Damo UI/)
  })
})
