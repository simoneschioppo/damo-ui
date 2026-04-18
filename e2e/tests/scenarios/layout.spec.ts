import { test, expect } from '@playwright/test'

test.describe('Layout page', () => {
  test('renders sections', async ({ page }) => {
    await page.goto('/components/layout')
    await expect(page.getByRole('heading', { name: 'Layout', level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'PageHeader' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /AppShell.*light/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: /AppShell.*onDark/ })).toBeVisible()
  })

  test('PageHeader renders eyebrow, title, description, actions', async ({ page }) => {
    await page.goto('/components/layout')
    await expect(page.getByText('Shop').first()).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Set di pezzi' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Nuovo' }).first()).toBeVisible()
  })

  test('AppShell has sidebar and main', async ({ page }) => {
    await page.goto('/components/layout')
    // Both AppShells have DAMACCHI brand in sidebar
    const brands = page.getByText('DAMACCHI', { exact: true })
    await expect(brands.first()).toBeVisible()
    // Main content shows Dashboard eyebrow (inside AppShell)
    await expect(page.getByText('Dashboard').first()).toBeVisible()
  })
})
