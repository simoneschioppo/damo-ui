import { test, expect } from '@playwright/test'

test.describe('Smoke — web app boot', () => {
  test('home page renders the Damo UI navbar brand', async ({ page }) => {
    await page.goto('/')
    const navbarLink = page.getByRole('link', { name: /Damo UI home/i })
    await expect(navbarLink).toBeVisible()
  })

  test('home page links to the docs surface', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Docs', exact: true }).first()).toBeVisible()
  })

  test('home page exposes the display settings trigger', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Display settings' })).toBeVisible()
  })
})
