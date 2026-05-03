import { test, expect } from '@playwright/test'

test.describe('Theme generator — full-screen preview modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/theme-generator')
  })

  test('opens the preview modal and surfaces all five scenes inside it', async ({ page }) => {
    const trigger = page.getByTestId('open-preview-modal')
    await expect(trigger).toBeVisible()
    await trigger.click()

    const content = page.getByTestId('preview-modal-content')
    await expect(content).toBeVisible()
    await expect(content.getByRole('heading', { name: 'Live preview' })).toBeVisible()

    const body = page.getByTestId('preview-modal-body')
    for (const sceneLabel of ['Gallery', 'Auth', 'Dashboard', 'Profile', 'Feed']) {
      await expect(body.getByRole('tab', { name: sceneLabel })).toBeVisible()
    }
  })

  test('toggles the preview body data-theme between light and dark', async ({ page }) => {
    await page.getByTestId('open-preview-modal').click()
    const body = page.getByTestId('preview-modal-body')
    await expect(body).toHaveAttribute('data-theme', 'light')

    await page.getByRole('button', { name: 'Dark', exact: true }).last().click()
    await expect(body).toHaveAttribute('data-theme', 'dark')
  })

  test('opens with the scene currently selected in the editor preview pane', async ({ page }) => {
    // Switch the editor preview to Profile then open the modal
    await page.getByRole('tab', { name: 'Profile', exact: true }).click()
    await page.getByTestId('open-preview-modal').click()

    const body = page.getByTestId('preview-modal-body')
    await expect(body.getByRole('tab', { name: 'Profile' })).toHaveAttribute(
      'data-state',
      'active',
    )
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
    // Force dark theme on the document before the bundle runs so theme.css
    // cascades the dark block.
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

    // Both pages must agree on the shadow colour. The previous "white in
    // dark" override in apps/web/app/styles/theme.css desynced these two
    // values, producing white shadows on landing and black ones in the
    // generator after the user visited it.
    expect(landingShadow.toLowerCase()).toBe(generatorShadow.toLowerCase())
    expect(landingShadow.toLowerCase()).toMatch(/^#?000(000)?$/)
  })
})
