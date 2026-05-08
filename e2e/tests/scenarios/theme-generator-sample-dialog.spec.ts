import { test, expect } from '@playwright/test'

test.describe('Theme generator — sample dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/theme-generator')
  })

  test('exposes a trigger that opens a real Dialog with title, body and actions', async ({
    page,
  }) => {
    const trigger = page.getByTestId('open-sample-dialog')
    await expect(trigger).toBeVisible()
    await trigger.click()

    const content = page.getByTestId('sample-dialog-content')
    await expect(content).toBeVisible()
    await expect(content.getByRole('heading', { name: /Publish new release/ })).toBeVisible()
    await expect(content.getByLabel('Version tag')).toBeVisible()
    await expect(page.getByTestId('sample-dialog-cancel')).toBeVisible()
    await expect(page.getByTestId('sample-dialog-confirm')).toBeVisible()
  })

  test('closes when the cancel action is clicked', async ({ page }) => {
    await page.getByTestId('open-sample-dialog').click()
    await page.getByTestId('sample-dialog-cancel').click()
    await expect(page.getByTestId('sample-dialog-content')).toHaveCount(0)
  })

  test('closes when the confirm action is clicked', async ({ page }) => {
    await page.getByTestId('open-sample-dialog').click()
    await page.getByTestId('sample-dialog-confirm').click()
    await expect(page.getByTestId('sample-dialog-content')).toHaveCount(0)
  })
})

test.describe('Theme generator — chart bars follow the chart-N theme tokens', () => {
  test('dashboard bars use bg-chart-1/2 utilities, not bg-primary/secondary', async ({ page }) => {
    await page.goto('/theme-generator')
    await page.getByRole('tab', { name: 'Dashboard', exact: true }).click()

    const bars = page.getByTestId('dashboard-bar')
    const count = await bars.count()
    expect(count).toBe(7)

    // Aggregate the class names — every bar must use a chart token.
    const classNames = await bars.evaluateAll((els) => els.map((el) => el.className))
    for (const cls of classNames) {
      expect(cls).toMatch(/bg-chart-(1|2)/)
      expect(cls).not.toContain('bg-primary')
      expect(cls).not.toContain('bg-secondary')
    }
  })
})

test.describe('Memphis shadow color is consistent across pages in dark mode', () => {
  test('--memphis-shadow-color stays solid black on landing AND theme generator', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      document.documentElement.setAttribute('data-theme', 'dark')
    })

    await page.goto('/')
    const landingShadow = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--memphis-shadow-color').trim(),
    )

    await page.goto('/theme-generator')
    const generatorShadow = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--memphis-shadow-color').trim(),
    )

    expect(landingShadow.toLowerCase()).toBe(generatorShadow.toLowerCase())
    expect(landingShadow.toLowerCase()).toMatch(/^#?000(000)?$/)
  })
})
