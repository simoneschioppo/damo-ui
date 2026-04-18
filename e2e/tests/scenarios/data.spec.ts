import { test, expect } from '@playwright/test'

test.describe('Data page', () => {
  test('renders sections', async ({ page }) => {
    await page.goto('/components/data')
    await expect(page.getByRole('heading', { name: 'Data Display', level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Avatar' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Stat' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Accordion' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Table' })).toBeVisible()
  })

  test('Accordion toggles section', async ({ page }) => {
    await page.goto('/components/data')
    const modesTrigger = page.getByRole('button', { name: 'Modalità di gioco' })
    await expect(modesTrigger).toHaveAttribute('data-state', 'closed')
    await modesTrigger.click()
    await expect(modesTrigger).toHaveAttribute('data-state', 'open')
  })

  test('Table renders leaderboard rows', async ({ page }) => {
    await page.goto('/components/data')
    await expect(page.getByText('Korai')).toBeVisible()
    await expect(page.getByText('2150')).toBeVisible()
    await expect(page.getByText('Classifica top 5 — stagione 2026-Q1')).toBeVisible()
  })

  test('Stat shows value and delta', async ({ page }) => {
    await page.goto('/components/data')
    await expect(page.locator('span.font-display', { hasText: '1842' })).toBeVisible()
    await expect(page.getByText('+42')).toBeVisible()
  })
})
