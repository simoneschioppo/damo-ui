import { test, expect, type Page, type Locator } from '@playwright/test'

// All controls that conflict with the global topbar theme-switcher are
// scoped to the sidebar (aria-label="Theme controls").
function sidebar(page: Page): Locator {
  return page.getByLabel('Theme controls')
}

test.describe('Theme generator — light/dark editing across Palette, Theme, Identity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/theme-generator')
  })

  test('Sidebar surfaces the Damo UI brand alongside the Theme Generator label', async ({
    page,
  }) => {
    const sb = sidebar(page)
    await expect(sb.getByText('Theme Generator', { exact: true })).toBeVisible()
    await expect(sb.getByText(/Damo UI/)).toBeVisible()
  })

  test('Editing toggle is visible across all three editor tabs', async ({ page }) => {
    const sb = sidebar(page)
    for (const tabName of ['Palette', 'Theme', 'Identity']) {
      await sb.getByRole('tab', { name: new RegExp(`^${tabName}$`) }).click()
      await expect(sb.getByText('Editing:')).toBeVisible()
      await expect(sb.getByRole('button', { name: 'Light', exact: true })).toBeVisible()
      await expect(sb.getByRole('button', { name: 'Dark', exact: true })).toBeVisible()
    }
  })

  test('Switching to Dark in Palette tab updates aria-pressed', async ({ page }) => {
    const sb = sidebar(page)
    await sb.getByRole('tab', { name: /^Palette$/ }).click()
    const lightBtn = sb.getByRole('button', { name: 'Light', exact: true })
    const darkBtn = sb.getByRole('button', { name: 'Dark', exact: true })

    await expect(lightBtn).toHaveAttribute('aria-pressed', 'true')
    await darkBtn.click()
    await expect(darkBtn).toHaveAttribute('aria-pressed', 'true')
    await expect(lightBtn).toHaveAttribute('aria-pressed', 'false')
  })

  test('Editing palette in Light vs Dark produces different export output', async ({ page }) => {
    const sb = sidebar(page)
    await sb.getByRole('tab', { name: /^Palette$/ }).click()
    await sb.getByRole('button', { name: 'Light', exact: true }).click()

    // ColorPicker exposes a hex text input next to its label.
    const inkLightInput = sb
      .locator('label:has-text("ink-500")')
      .locator('..')
      .locator('input[type="text"]')
      .first()
    await inkLightInput.fill('#aabbcc')
    await inkLightInput.press('Tab')

    await sb.getByRole('button', { name: 'Dark', exact: true }).click()
    const inkDarkInput = sb
      .locator('label:has-text("ink-500")')
      .locator('..')
      .locator('input[type="text"]')
      .first()
    await inkDarkInput.fill('#112233')
    await inkDarkInput.press('Tab')

    // Open Export pane → CSS
    await page.getByRole('tab', { name: /^Export$/ }).click()
    await page.getByRole('button', { name: 'CSS', exact: true }).click()

    const output = page.locator('pre').first()
    await expect(output).toContainText('--ink-500: #aabbcc')
    await expect(output).toContainText("[data-theme='dark']")
    const cssText = (await output.textContent()) ?? ''
    const darkBlockIdx = cssText.indexOf("[data-theme='dark']")
    expect(darkBlockIdx).toBeGreaterThan(-1)
    expect(cssText.slice(darkBlockIdx)).toContain('--ink-500: #112233')
  })

  test('Editing identity (chart) in Dark only does not affect Light', async ({ page }) => {
    const sb = sidebar(page)
    await sb.getByRole('tab', { name: /^Identity$/ }).click()
    await sb.getByRole('button', { name: 'Dark', exact: true }).click()

    // Charts accordion is collapsed by default — expand it
    await sb.getByRole('button', { name: /^Charts$/ }).click()

    const chartDarkInput = sb
      .locator('label:has-text("Chart 1")')
      .locator('..')
      .locator('input[type="text"]')
      .first()
    await chartDarkInput.fill('#deadbe')
    await chartDarkInput.press('Tab')

    // Switch back to Light — chart 1 should be unchanged from default
    await sb.getByRole('button', { name: 'Light', exact: true }).click()
    const chartLightInput = sb
      .locator('label:has-text("Chart 1")')
      .locator('..')
      .locator('input[type="text"]')
      .first()
    await expect(chartLightInput).not.toHaveValue('#deadbe')

    await page.getByRole('tab', { name: /^Export$/ }).click()
    await page.getByRole('button', { name: 'CSS', exact: true }).click()
    const output = page.locator('pre').first()
    const cssText = (await output.textContent()) ?? ''
    const darkIdx = cssText.indexOf("[data-theme='dark']")
    expect(darkIdx).toBeGreaterThan(-1)
    expect(cssText.slice(darkIdx)).toContain('--chart-1: #deadbe')
    expect(cssText.slice(0, darkIdx)).not.toContain('#deadbe')
  })

  test('EDITING toggle does NOT change the page-level data-theme', async ({ page }) => {
    // The EDITING toggle controls only which variant is being edited.
    // Switching the page theme is the navbar's responsibility.
    const sb = sidebar(page)
    await sb.getByRole('tab', { name: /^Identity$/ }).click()
    const initial = await page.locator('html').getAttribute('data-theme')

    await sb.getByRole('button', { name: 'Dark', exact: true }).click()
    await page.waitForTimeout(100)
    expect(await page.locator('html').getAttribute('data-theme')).toBe(initial)

    await sb.getByRole('button', { name: 'Light', exact: true }).click()
    await page.waitForTimeout(100)
    expect(await page.locator('html').getAttribute('data-theme')).toBe(initial)
  })

  test('Sidebar shows prominent variant header that updates with the toggle', async ({ page }) => {
    const sb = sidebar(page)
    await sb.getByRole('tab', { name: /^Identity$/ }).click()

    // Light is the default selection. The sidebar must display a prominent
    // text indicating the variant being edited so the toggle's effect is
    // visible even before the user touches any input.
    await sb.getByRole('button', { name: 'Light', exact: true }).click()
    const header = sb.getByTestId('editing-variant-header')
    await expect(header).toBeVisible()
    await expect(header).toContainText(/light/i)

    await sb.getByRole('button', { name: 'Dark', exact: true }).click()
    await expect(header).toContainText(/dark/i)
  })

  test('ColorPicker shows divergence indicator when light/dark values differ', async ({ page }) => {
    const sb = sidebar(page)
    await sb.getByRole('tab', { name: /^Identity$/ }).click()

    // Initial state: light and dark are identical → no divergence indicator
    const goldInner = sb.locator('[data-token="medal-gold-inner"]')
    await expect(goldInner).toBeVisible()
    await expect(goldInner.getByTestId('divergence-indicator')).toHaveCount(0)

    // Edit gold inner in Light mode → values now diverge → indicator appears
    const hex = goldInner.locator('input[aria-label="Hex value for gold inner"]')
    await hex.fill('#abcdef')
    await hex.press('Tab')
    await expect(goldInner.getByTestId('divergence-indicator')).toBeVisible()
  })

  test('Foundations are editable per mode (radius example)', async ({ page }) => {
    const sb = sidebar(page)
    await sb.getByRole('tab', { name: /^Identity$/ }).click()
    await sb.getByRole('button', { name: /^Radius$/ }).click()

    // Default light value should match the original `md` radius
    await sb.getByRole('button', { name: 'Light', exact: true }).click()

    // Switch to Dark, change radius md via keyboard arrow on slider
    await sb.getByRole('button', { name: 'Dark', exact: true }).click()
    // Find the md slider — labelled "md · Npx". Issue #64 added a
    // TokenPreviewChip as a sibling of the label inside the header div,
    // so the previous `label/following-sibling::*[1]` walk landed on
    // the chip (no [role=slider] inside) instead of the slider wrapper.
    // Walk up to the label's parent (header div), then to its next
    // sibling (DivergenceWrapper), where the slider actually lives.
    const mdLabel = sb.locator('label:has-text("md ·")').first()
    await mdLabel.scrollIntoViewIfNeeded()
    const slider = mdLabel
      .locator('xpath=ancestor::div[1]/following-sibling::*[1]')
      .locator('[role="slider"]')
      .first()
    await slider.click()
    await slider.press('ArrowRight')
    await slider.press('ArrowRight')
    await page.waitForTimeout(150)

    // Open Export pane, CSS, ensure dark block has --radius-md override
    await page.getByRole('tab', { name: /^Export$/ }).click()
    await page.getByRole('button', { name: 'CSS', exact: true }).click()
    const output = page.locator('pre').first()
    const text = (await output.textContent()) ?? ''
    const darkBlockIdx = text.indexOf("[data-theme='dark']")
    expect(darkBlockIdx).toBeGreaterThan(-1)
    expect(text.slice(darkBlockIdx)).toMatch(/--radius-md:\s*\d+px;/)
  })

  test('JSON export structure has per-mode foundations', async ({ page }) => {
    await page.getByRole('tab', { name: /^Export$/ }).click()
    await page.getByRole('button', { name: 'JSON', exact: true }).click()
    const output = page.locator('pre').first()
    const text = (await output.textContent()) ?? ''
    const json = JSON.parse(text)
    expect(json.typography.light).toBeDefined()
    expect(json.typography.dark).toBeDefined()
    expect(json.radius.light).toBeDefined()
    expect(json.radius.dark).toBeDefined()
    expect(json.shadowMemphis.light).toBeDefined()
    expect(json.shadowMemphis.dark).toBeDefined()
    expect(json.shadowSoft.light).toBeDefined()
    expect(json.shadowSoft.dark).toBeDefined()
    expect(json.motion.light.durations).toBeDefined()
    expect(json.motion.dark.durations).toBeDefined()
    // Spacing scale was removed from the audit — density covers the same
    // global-spacing knob via `--density-scale-y`.
    expect(json.spacing).toBeUndefined()
  })

  test('JSON export contains both palette.light and palette.dark', async ({ page }) => {
    await page.getByRole('tab', { name: /^Export$/ }).click()
    await page.getByRole('button', { name: 'JSON', exact: true }).click()

    const output = page.locator('pre').first()
    const text = (await output.textContent()) ?? ''
    const json = JSON.parse(text)
    expect(json.palette.light).toBeDefined()
    expect(json.palette.dark).toBeDefined()
    expect(json.identity.light).toBeDefined()
    expect(json.identity.dark).toBeDefined()
  })
})
