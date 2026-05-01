import { test, expect } from '@playwright/test'

test.describe('Smoke — playground boot', () => {
  test('home page renders the Axolab navbar brand', async ({ page }) => {
    await page.goto('/')
    const navbarLink = page.getByRole('link', { name: /Axolab home/i })
    await expect(navbarLink).toBeVisible()
  })

  test('home page links to the docs surface', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /Design System|Docs/i }).first()).toBeVisible()
  })

  test('design-system route is reachable', async ({ page }) => {
    await page.goto('/design-system')
    await expect(page).toHaveURL(/\/(design-system|docs)/)
  })
})
