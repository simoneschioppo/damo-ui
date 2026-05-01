import { test, expect } from '@playwright/test'

// These tests guard the user-reported gap: docs that mention data-theme /
// data-palette / data-density without explaining the valid values, and
// foundation pages that show visuals without ever showing how to apply them
// in product code.

test.describe('Docs completeness — values & code usage', () => {
  test('Getting Started step 5 lists valid attribute values', async ({ page }) => {
    await page.goto('/docs/getting-started')

    // Step 5 heading
    await expect(page.getByRole('heading', { name: /Wire theme, palette, density/i })).toBeVisible()

    // The "valid values" callout
    await expect(page.getByText(/Valid attribute values/i)).toBeVisible()

    // Light only message and density values
    await expect(page.getByText(/light only/i)).toBeVisible()
    await expect(page.getByText(/'compact'/).first()).toBeVisible()
    await expect(page.getByText(/'comfortable'/).first()).toBeVisible()
  })

  test('Theming page covers dark mode + custom palette + FOUC', async ({ page }) => {
    await page.goto('/docs/foundations/theming')
    await expect(page.getByRole('heading', { level: 1, name: 'Theming' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Adding dark mode/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Adding custom palettes/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Preventing the flash/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Programmatic switching/i })).toBeVisible()
    // At least one css block, one tsx block, one ts block
    expect(await page.locator('pre[data-lang="css"]').count()).toBeGreaterThan(0)
    expect(await page.locator('pre[data-lang="tsx"]').count()).toBeGreaterThan(0)
    expect(await page.locator('pre[data-lang="ts"]').count()).toBeGreaterThan(0)
  })

  test('Foundations/Colors shows code usage examples', async ({ page }) => {
    await page.goto('/docs/foundations/colors')
    // Three "how to use" sections
    await expect(page.getByRole('heading', { name: /Using colors in JSX/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Using colors in CSS/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Adding dark mode/i })).toBeVisible()
    // Tailwind utility names are present in the code blocks
    await expect(page.getByText('bg-card text-card-foreground').first()).toBeVisible()
  })

  test('Foundations/Typography shows code usage examples', async ({ page }) => {
    await page.goto('/docs/foundations/typography')
    await expect(page.getByRole('heading', { name: /Loading the fonts/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Using fonts in JSX/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Helper classes/i })).toBeVisible()
    await expect(page.getByText(/font-display/).first()).toBeVisible()
  })

  test('Foundations/Patterns shows code usage examples', async ({ page }) => {
    await page.goto('/docs/foundations/patterns')
    await expect(page.getByRole('heading', { name: /Using PatternSwatch/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Using the patterns directly in CSS/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Shape primitives/i })).toBeVisible()
    await expect(page.getByText(/MemphisShape/).first()).toBeVisible()
  })

  test('Foundations/Tokens shows three consumption styles', async ({ page }) => {
    await page.goto('/docs/foundations/tokens')
    await expect(page.getByRole('heading', { name: /Consuming semantic tokens/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Overriding tokens/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Density/i })).toBeVisible()
    // Tailwind, var() reference, inline style — three distinct titles
    await expect(page.getByText(/Tailwind utilities/i).first()).toBeVisible()
    await expect(page.getByText(/var\(\) reference/i).first()).toBeVisible()
    await expect(page.getByText(/inline style/i).first()).toBeVisible()
  })

  test('Sidebar navigation includes Theming entry', async ({ page }) => {
    await page.goto('/docs/getting-started')
    const navLinks = page.getByRole('link', { name: 'Theming' })
    expect(await navLinks.count()).toBeGreaterThan(0)
  })
})
