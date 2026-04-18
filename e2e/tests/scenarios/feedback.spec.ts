import { test, expect } from '@playwright/test'

test.describe('Feedback page', () => {
  test('renders all feedback sections', async ({ page }) => {
    await page.goto('/components/feedback')
    await expect(page.getByRole('heading', { name: 'Feedback', level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Tooltip' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Toast' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Progress' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Spinner' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Skeleton' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Badge' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Chip/ })).toBeVisible()
  })

  test('Tooltip appears on hover', async ({ page }) => {
    await page.goto('/components/feedback')
    const topButton = page.getByRole('button', { name: 'top' }).first()
    await topButton.hover()
    await expect(page.getByRole('tooltip', { name: 'Side: top' })).toBeVisible({
      timeout: 3000,
    })
  })

  test('Toast opens when button clicked', async ({ page }) => {
    await page.goto('/components/feedback')
    await page.getByRole('button', { name: 'Toast success' }).click()
    const region = page.getByRole('region', { name: /notifications/i })
    await expect(region).toContainText('Toast success')
    await expect(region).toContainText('Questo è un toast di tipo success.')
  })

  test('Progress renders with percentage labels', async ({ page }) => {
    await page.goto('/components/feedback')
    await expect(page.getByText('25%').first()).toBeVisible()
    await expect(page.getByText('100%').first()).toBeVisible()
  })

  test('Spinner has role=status', async ({ page }) => {
    await page.goto('/components/feedback')
    const spinners = page.getByRole('status', { name: 'Caricamento…' })
    await expect(spinners.first()).toBeVisible()
  })
})
