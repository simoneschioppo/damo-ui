import { test, expect, type Page } from '@playwright/test'

/**
 * Regression guard for gh-100 — editor-style code blocks.
 *
 * The docs code-block component was refactored to:
 *   - Drop MacOS traffic-light chrome and hardcoded GitHub-dark hexes.
 *   - Render a `.damo-code` editor surface that follows the page theme:
 *     paper-light editor on light pages (vitesse-light), calm-charcoal
 *     editor on dark pages (vitesse-dark). The chrome (--code-* vars)
 *     and the syntax theme switch in lockstep under [data-theme='dark'].
 *   - Add a `.line-number` gutter for multi-line snippets only.
 *   - Stack lines tightly via `display: grid` on `.shiki code` so Shiki's
 *     inter-line `\n` text nodes collapse to zero height.
 *
 * Test page: `/docs/components/button` — has many <Code> and <Example>
 * instances covering both multi-line and the Import snippet (single-line).
 * Single-line "no gutter" scenario uses `/` (homepage) where the Quick
 * Install card renders `pnpm add damo-ui` as an embedded single-line block.
 *
 * Theme toggling convention (mirrors display-settings-menu.spec.ts):
 *   1. Seed localStorage with { theme: 'dark' | 'light' } before or after load.
 *   2. Wait for `html[data-theme]` to match the expected value.
 *   3. OR use the preferences menu: 'Display settings' → 'Dark' / 'Light'.
 *
 * Webkit cookie-race skip: not needed for this spec — we don't write
 * NEXT_LOCALE cookies. All browsers run all tests.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Relative luminance of an sRGB colour (WCAG 2.x formula). */
function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/** Parse `rgb(R, G, B)` or `rgba(R, G, B, A)` → [R, G, B] or null. */
function parseRgb(value: string): [number, number, number] | null {
  const m = value
    .trim()
    .match(/rgba?\(\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)/)
  if (!m) return null
  return [Number(m[1]), Number(m[2]), Number(m[3])]
}

/**
 * Set theme via localStorage seed + reload, then wait for `data-theme` to
 * settle. This mirrors dark-theme-tokens.spec.ts and locale-switch-theme-flash.spec.ts.
 */
async function setThemeViaStorage(page: Page, theme: 'light' | 'dark') {
  await page.evaluate((t) => window.localStorage.setItem('theme', t), theme)
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForFunction(
    (t) => document.documentElement.getAttribute('data-theme') === t,
    theme,
    { timeout: 5_000 },
  )
}

/**
 * Toggle theme to the target value via the Display Settings preferences menu.
 * Mirrors the pattern in display-settings-menu.spec.ts.
 */
async function toggleThemeViaMenu(page: Page, theme: 'Light' | 'Dark') {
  await page.getByRole('button', { name: 'Display settings' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: theme, exact: true }).click()
  // Close the popover so it doesn't obscure subsequent interactions.
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('gh-100 — editor-style code blocks', () => {
  /**
   * All tests that navigate to /docs/components/button start from a clean
   * localStorage so theme defaults to 'light' (the SSR default).
   */
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/components/button')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload({ waitUntil: 'networkidle' })
  })

  // ── Test 1 — No legacy chrome ──────────────────────────────────────────
  // After page load, the rendered HTML of every .damo-code element must not
  // contain the old traffic-light hex colors or hardcoded GitHub-dark hexes.
  test('no legacy traffic-light or GitHub-dark hex colors in .damo-code', async ({ page }) => {
    // Collect the innerHTML of every .damo-code wrapper.
    const html = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.damo-code'))
        .map((el) => el.innerHTML)
        .join('\n')
    })

    // Traffic-light colors (old MacOS window chrome).
    expect(html).not.toContain('ff5f57')
    expect(html).not.toContain('FF5F57')
    expect(html).not.toContain('febc2e')
    expect(html).not.toContain('FEBC2E')
    expect(html).not.toContain('28c840')
    expect(html).not.toContain('28C840')

    // GitHub-dark hardcoded hexes (old Code.tsx / CopyButton.tsx).
    expect(html).not.toContain('0d1117')
    expect(html).not.toContain('0D1117')
    expect(html).not.toContain('161b22')
    expect(html).not.toContain('161B22')
    expect(html).not.toContain('30363d')
    expect(html).not.toContain('30363D')

    // Also check computed styles of .damo-code elements for inline bg color.
    const bgColors = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.damo-code')).map(
        (el) => window.getComputedStyle(el).backgroundColor,
      )
    })
    for (const bg of bgColors) {
      const rgb = bg.replace(/\s/g, '')
      // rgb(13,17,23) = #0d1117
      expect(rgb).not.toBe('rgb(13,17,23)')
      // rgb(22,27,34) = #161b22
      expect(rgb).not.toBe('rgb(22,27,34)')
    }
  })

  // ── Test 2 — Light page produces light editor surface ─────────────────
  // With data-theme="light" (default after clear), the .damo-code wrapper
  // background should be paper-light (luminance > 0.85) and tokens should
  // be dark-on-light (vitesse-light token colors against the paper bg).
  test('light page produces light editor surface + dark tokens', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    const result = await page.evaluate(() => {
      const wrapper = document.querySelector('.damo-code')
      const shiki = document.querySelector('.damo-code .shiki')
      if (!wrapper || !shiki) return null
      const span = Array.from(shiki.querySelectorAll('span')).find(
        (s) => s.textContent && s.textContent.trim().length > 0,
      )
      if (!span) return null
      return {
        wrapperBg: window.getComputedStyle(wrapper).backgroundColor,
        tokenColor: window.getComputedStyle(span).color,
      }
    })

    expect(result, 'Expected .damo-code + .shiki spans on the page').not.toBeNull()
    const wrapperRgb = parseRgb(result!.wrapperBg)
    const tokenRgb = parseRgb(result!.tokenColor)
    expect(wrapperRgb, `Wrapper bg unparseable: ${result!.wrapperBg}`).not.toBeNull()
    expect(tokenRgb, `Token color unparseable: ${result!.tokenColor}`).not.toBeNull()

    const wrapperLum = relativeLuminance(...wrapperRgb!)
    const tokenLum = relativeLuminance(...tokenRgb!)
    expect(
      wrapperLum,
      `Editor pane should be light, got wrapper lum=${wrapperLum}`,
    ).toBeGreaterThan(0.85)
    expect(tokenLum, `Tokens should be dark-on-light, got token lum=${tokenLum}`).toBeLessThan(0.5)
  })

  // ── Test 3 — Dark page produces dark editor surface ────────────────────
  // With data-theme="dark", the .damo-code wrapper background should be
  // dark (luminance < 0.2) and tokens should be light-on-dark.
  test('dark page produces dark editor surface + light tokens', async ({ page }) => {
    await setThemeViaStorage(page, 'dark')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    const result = await page.evaluate(() => {
      const wrapper = document.querySelector('.damo-code')
      const shiki = document.querySelector('.damo-code .shiki')
      if (!wrapper || !shiki) return null
      const span = Array.from(shiki.querySelectorAll('span')).find(
        (s) => s.textContent && s.textContent.trim().length > 0,
      )
      if (!span) return null
      return {
        wrapperBg: window.getComputedStyle(wrapper).backgroundColor,
        tokenColor: window.getComputedStyle(span).color,
      }
    })

    expect(result, 'Expected .damo-code + .shiki on the page in dark theme').not.toBeNull()
    const wrapperRgb = parseRgb(result!.wrapperBg)
    const tokenRgb = parseRgb(result!.tokenColor)
    expect(wrapperRgb, `Wrapper bg unparseable: ${result!.wrapperBg}`).not.toBeNull()
    expect(tokenRgb, `Token color unparseable: ${result!.tokenColor}`).not.toBeNull()

    const wrapperLum = relativeLuminance(...wrapperRgb!)
    const tokenLum = relativeLuminance(...tokenRgb!)
    expect(wrapperLum, `Editor pane should be dark, got wrapper lum=${wrapperLum}`).toBeLessThan(
      0.2,
    )
    expect(tokenLum, `Tokens should be light-on-dark, got token lum=${tokenLum}`).toBeGreaterThan(
      0.4,
    )
  })

  // ── Test 4 — Theme toggle live-updates editor surface + token colors ───
  // Load in light, capture the wrapper bg + a token color. Toggle to dark
  // via the menu. Both must change — code follows page theme.
  test('theme toggle live-updates editor surface and token colors', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    const lightSnap = await page.evaluate(() => {
      const wrapper = document.querySelector('.damo-code')
      const span = wrapper
        ? Array.from(wrapper.querySelectorAll('.shiki span')).find(
            (s) => s.textContent && s.textContent.trim().length > 0,
          )
        : null
      return wrapper && span
        ? {
            bg: window.getComputedStyle(wrapper).backgroundColor,
            color: window.getComputedStyle(span).color,
          }
        : null
    })
    expect(lightSnap, 'Could not snapshot the editor in light mode').not.toBeNull()

    await toggleThemeViaMenu(page, 'Dark')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    const darkSnap = await page.evaluate(() => {
      const wrapper = document.querySelector('.damo-code')
      const span = wrapper
        ? Array.from(wrapper.querySelectorAll('.shiki span')).find(
            (s) => s.textContent && s.textContent.trim().length > 0,
          )
        : null
      return wrapper && span
        ? {
            bg: window.getComputedStyle(wrapper).backgroundColor,
            color: window.getComputedStyle(span).color,
          }
        : null
    })
    expect(darkSnap, 'Could not snapshot the editor after toggling dark').not.toBeNull()

    expect(
      darkSnap!.bg,
      `Editor bg did not change across theme toggle (still "${lightSnap!.bg}").`,
    ).not.toBe(lightSnap!.bg)
    expect(
      darkSnap!.color,
      `Token color did not change across theme toggle (still "${lightSnap!.color}").`,
    ).not.toBe(lightSnap!.color)
  })

  // ── Test 4b — Lines stack tight (no inter-line gap) ────────────────────
  // Regression for the visible spacing issue where Shiki's `\n` text nodes
  // between consecutive `<span class="line">` were rendering as anonymous
  // block boxes inside `<pre>` (which preserves whitespace), adding ~1
  // line-height of dead space per row. Fix: `display: grid` on `.shiki code`
  // collapses the whitespace text nodes to zero height. This test reads the
  // bounding rects of two consecutive `.line` elements and asserts the
  // vertical distance equals one line-height (within a 4 px tolerance).
  test('consecutive .line rows stack tight (no anonymous newline gap)', async ({ page }) => {
    const measurement = await page.evaluate(() => {
      const blocks = Array.from(document.querySelectorAll('.damo-code'))
      for (const block of blocks) {
        const lines = block.querySelectorAll<HTMLElement>('.line')
        if (lines.length >= 2) {
          const r1 = lines[0]!.getBoundingClientRect()
          const r2 = lines[1]!.getBoundingClientRect()
          const viewport = block.querySelector('.damo-code__viewport') as HTMLElement | null
          const lh = viewport ? parseFloat(window.getComputedStyle(viewport).lineHeight) : NaN
          return { distance: r2.top - r1.top, lineHeight: lh }
        }
      }
      return null
    })

    expect(measurement, 'Expected to find a multi-line .damo-code block').not.toBeNull()
    const { distance, lineHeight } = measurement!
    expect(
      Math.abs(distance - lineHeight),
      `Expected consecutive .line rows ~${lineHeight}px apart, got ${distance}px. ` +
        `Anonymous newline text nodes are inflating the row height — check ` +
        `\`display: grid\` on \`.shiki code\`.`,
    ).toBeLessThan(4)
  })

  // ── Test 5 — Multi-line snippet has line numbers ────────────────────────
  // The button docs page renders several multi-line snippets (e.g. BASIC_SNIPPET,
  // SIZES_SNIPPET). Assert that .line-number elements exist and their count
  // equals the number of .line siblings in the same <pre>.
  test('multi-line .damo-code block has .line-number elements matching line count', async ({
    page,
  }) => {
    const result = await page.evaluate(() => {
      // Find the first .damo-code that contains multiple .line elements.
      const blocks = Array.from(document.querySelectorAll('.damo-code'))
      for (const block of blocks) {
        const lines = block.querySelectorAll('.line')
        if (lines.length > 1) {
          const lineNumbers = block.querySelectorAll('.line-number')
          return {
            lineCount: lines.length,
            lineNumberCount: lineNumbers.length,
          }
        }
      }
      return null
    })

    expect(
      result,
      'Expected to find a multi-line .damo-code block on the button docs page',
    ).not.toBeNull()
    expect(
      result!.lineNumberCount,
      `Expected ${result!.lineCount} .line-number elements, got ${result!.lineNumberCount}`,
    ).toBe(result!.lineCount)
    expect(
      result!.lineNumberCount,
      'Multi-line block must have at least 2 line numbers',
    ).toBeGreaterThan(1)
  })

  // ── Test 6 — Single-line snippet has NO line numbers ───────────────────
  // The homepage Quick Install card renders `pnpm add damo-ui` as an embedded
  // single-line block. Assert .line-number count is 0 inside that block.
  test('single-line .damo-code block on homepage has no .line-number elements', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const result = await page.evaluate(() => {
      // Find a .damo-code that contains exactly one .line element.
      const blocks = Array.from(document.querySelectorAll('.damo-code'))
      for (const block of blocks) {
        const lines = block.querySelectorAll('.line')
        if (lines.length === 1) {
          const lineNumbers = block.querySelectorAll('.line-number')
          const text = block.textContent ?? ''
          return {
            lineNumberCount: lineNumbers.length,
            text: text.trim().substring(0, 60),
          }
        }
      }
      return null
    })

    expect(result, 'Expected to find a single-line .damo-code block on the homepage').not.toBeNull()
    expect(
      result!.lineNumberCount,
      `Single-line block ("${result!.text}") should have 0 .line-number elements, got ${result!.lineNumberCount}`,
    ).toBe(0)
  })

  // ── Test 7 — Copy button still works ────────────────────────────────────
  // Click the Copy button on the first .damo-code block. Assert the button
  // transitions to the "copied" state (data-state="copied"). Handles both
  // EN ("Copied") and IT ("Copiato") locales by checking data-state.
  //
  // clipboard.writeText requires the `clipboard-write` permission in Playwright.
  // webkit does not support `clipboard-write` as a grantable permission name;
  // we mock navigator.clipboard for webkit so the button's try/catch path
  // still resolves without throwing, which lets us verify the UI transition.
  test('copy button transitions to copied state on click', async ({
    page,
    context,
    browserName,
  }) => {
    if (browserName === 'webkit') {
      // webkit's BrowserContext.grantPermissions does not accept 'clipboard-write'.
      // Inject a synchronous mock so CopyButton's navigator.clipboard.writeText
      // call resolves successfully, allowing the state transition to be tested.
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'clipboard', {
          value: {
            writeText: (_text: string) => Promise.resolve(),
          },
          configurable: true,
        })
      })
      // Re-navigate so the init script takes effect.
      await page.goto('/docs/components/button')
      await page.waitForLoadState('networkidle')
    } else {
      // Chromium supports both clipboard-read and clipboard-write.
      await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    }

    const copyBtn = page.locator('.damo-code__copy').first()
    await expect(copyBtn).toBeVisible()

    // Before click: idle state.
    await expect(copyBtn).toHaveAttribute('data-state', 'idle')

    await copyBtn.click()

    // After click: copied state should appear within 500 ms.
    await expect(copyBtn).toHaveAttribute('data-state', 'copied', { timeout: 500 })
    // The button text changes too — assert it is non-empty and changed from idle.
    const copiedText = await copyBtn.textContent()
    expect(
      copiedText?.trim().length,
      'Copy button text should be non-empty after click',
    ).toBeGreaterThan(0)
  })

  // ── Test 8 — No console errors / hydration warnings ─────────────────────
  // Capture console messages during the full page load; fail if any `error`
  // or `warn` mentioning hydration / mismatch / "did not match" surfaces.
  // This catches RSC ↔ client hydration drifts introduced by the refactor.
  test('no hydration errors or console errors on /docs/components/button', async ({ page }) => {
    const errors: string[] = []
    const hydrationWarnings: string[] = []

    page.on('console', (msg) => {
      const type = msg.type()
      const text = msg.text()
      if (type === 'error') {
        errors.push(text)
      }
      if (type === 'warning' && /hydrat|mismatch|did not match/i.test(text)) {
        hydrationWarnings.push(text)
      }
    })

    page.on('pageerror', (err) => {
      errors.push(err.message)
    })

    // Navigate fresh (beforeEach already loaded the page, but we need
    // the listener active before navigation to catch early console output).
    await page.goto('/docs/components/button')
    await page.waitForLoadState('networkidle')

    expect(errors, `Console errors were thrown: ${errors.join('\n')}`).toHaveLength(0)
    expect(
      hydrationWarnings,
      `Hydration warnings were thrown: ${hydrationWarnings.join('\n')}`,
    ).toHaveLength(0)
  })
})
