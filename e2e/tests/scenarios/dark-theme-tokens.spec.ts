import { test, expect, type Page } from '@playwright/test'

/**
 * Runtime regression guard for issue #91 — Plum+Gold dark mode refinement.
 *
 * Asserts the post-PR token values resolve in dark mode under
 * `:root[data-theme='dark']`. The source-contract counterpart lives at
 * `apps/web/app/styles/__tests__/theme-css-dark-block.test.ts` (regex
 * against the CSS file); this spec is the truer end-to-end check —
 * it actually reads `getComputedStyle` after the cascade resolves.
 *
 * See `_bmad-output/implementation-artifacts/spec-gh-91-plum-gold-dark-refinement.md`.
 */

const parseRgbTriplet = (value: string): [number, number, number] | null => {
  const m = value
    .trim()
    .match(/rgba?\(\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)/i)
  if (!m) return null
  return [Number(m[1]), Number(m[2]), Number(m[3])]
}

const parseLastNonTransparentRgb = (shadow: string): [number, number, number] | null => {
  const triplets: Array<{ r: number; g: number; b: number; alpha: number | null }> = []
  const re =
    /rgba?\(\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)(?:\s*[,/]\s*(\d+(?:\.\d+)?))?\s*\)/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(shadow)) !== null) {
    triplets.push({
      r: Number(m[1]),
      g: Number(m[2]),
      b: Number(m[3]),
      alpha: m[4] !== undefined ? Number(m[4]) : null,
    })
  }
  for (let i = triplets.length - 1; i >= 0; i--) {
    if (triplets[i].alpha === 0) continue
    return [triplets[i].r, triplets[i].g, triplets[i].b]
  }
  return null
}

const expectChannelsClose = (
  actual: [number, number, number] | null,
  expected: readonly [number, number, number],
  label: string,
  tolerance = 2,
) => {
  expect(actual, `${label}: expected an rgb triplet, got null`).not.toBeNull()
  const [ar, ag, ab] = actual!
  const [er, eg, eb] = expected
  expect(
    Math.abs(ar - er),
    `${label} R: got ${ar}, expected ${er}±${tolerance}`,
  ).toBeLessThanOrEqual(tolerance)
  expect(
    Math.abs(ag - eg),
    `${label} G: got ${ag}, expected ${eg}±${tolerance}`,
  ).toBeLessThanOrEqual(tolerance)
  expect(
    Math.abs(ab - eb),
    `${label} B: got ${ab}, expected ${eb}±${tolerance}`,
  ).toBeLessThanOrEqual(tolerance)
}

async function enableDarkTheme(page: Page) {
  // The docs site hydrates with `usePersistedAttr('theme', 'data-theme', 'light')`,
  // which reads localStorage in a `useEffect` and re-applies `data-theme`
  // on the post-hydration tick. Seed storage, reload, then wait for the
  // effect to flip the attribute to 'dark' before reading any token.
  await page.evaluate(() => {
    window.localStorage.setItem('theme', 'dark')
  })
  await page.reload()
  await page.waitForFunction(
    () => document.documentElement.getAttribute('data-theme') === 'dark',
    null,
    { timeout: 5000 },
  )
}

async function readRootVar(page: Page, name: string): Promise<string> {
  return page.evaluate(
    (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
    name,
  )
}

test.describe('Plum+Gold dark mode tokens (#91)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await enableDarkTheme(page)
  })

  test('--primary resolves to brand.400 (#d5a845) in dark', async ({ page }) => {
    const color = await page.evaluate(() => {
      const el = document.createElement('div')
      el.style.color = 'var(--primary)'
      document.body.appendChild(el)
      const c = getComputedStyle(el).color
      el.remove()
      return c
    })
    expectChannelsClose(parseRgbTriplet(color), [213, 168, 69], '--primary')
  })

  test('--warning resolves to custom amber #e8a435 (decoupled from --primary)', async ({
    page,
  }) => {
    const probe = await page.evaluate(() => {
      const a = document.createElement('div')
      a.style.color = 'var(--warning)'
      const b = document.createElement('div')
      b.style.color = 'var(--primary)'
      document.body.appendChild(a)
      document.body.appendChild(b)
      const out = { warning: getComputedStyle(a).color, primary: getComputedStyle(b).color }
      a.remove()
      b.remove()
      return out
    })
    expectChannelsClose(parseRgbTriplet(probe.warning), [232, 164, 53], '--warning')
    expect(probe.warning).not.toBe(probe.primary)
  })

  test('--ring follows primary (brand.400)', async ({ page }) => {
    const ring = await page.evaluate(() => {
      const p = document.createElement('div')
      p.style.color = 'var(--ring)'
      document.body.appendChild(p)
      const c = getComputedStyle(p).color
      p.remove()
      return c
    })
    expectChannelsClose(parseRgbTriplet(ring), [213, 168, 69], '--ring')
  })

  test('--medal-gold-outer resolves to paper.50 (visible frame on dark bg)', async ({ page }) => {
    const c = await page.evaluate(() => {
      const p = document.createElement('div')
      p.style.color = 'var(--medal-gold-outer)'
      document.body.appendChild(p)
      const out = getComputedStyle(p).color
      p.remove()
      return out
    })
    // paper.50 = #fbf7ee
    expectChannelsClose(parseRgbTriplet(c), [251, 247, 238], '--medal-gold-outer')
  })

  test('--medal-master-outer resolves to paper.50 (visible frame on dark bg)', async ({ page }) => {
    const c = await page.evaluate(() => {
      const p = document.createElement('div')
      p.style.color = 'var(--medal-master-outer)'
      document.body.appendChild(p)
      const out = getComputedStyle(p).color
      p.remove()
      return out
    })
    expectChannelsClose(parseRgbTriplet(c), [251, 247, 238], '--medal-master-outer')
  })

  test('--chart-1 resolves to ink.300 (#c590c9) in dark — high-contrast plum', async ({ page }) => {
    const c = await page.evaluate(() => {
      const p = document.createElement('div')
      p.style.color = 'var(--chart-1)'
      document.body.appendChild(p)
      const out = getComputedStyle(p).color
      p.remove()
      return out
    })
    expectChannelsClose(parseRgbTriplet(c), [197, 144, 201], '--chart-1')
  })

  test('--chart-5 resolves to ink.100 (#e0c6e2) in dark — high-contrast pale plum', async ({
    page,
  }) => {
    const c = await page.evaluate(() => {
      const p = document.createElement('div')
      p.style.color = 'var(--chart-5)'
      document.body.appendChild(p)
      const out = getComputedStyle(p).color
      p.remove()
      return out
    })
    expectChannelsClose(parseRgbTriplet(c), [224, 198, 226], '--chart-5')
  })

  test('Ghost button paints box-shadow with brand.400 (Memphis legibility on dark plum)', async ({
    page,
  }) => {
    // The home page renders `<Button asChild variant="ghost"><Link href="/theme-generator">…</Link></Button>`.
    // `asChild` flattens Button's className onto the anchor, so we target the
    // anchor that actually carries the Memphis ghost class — there may be
    // unstyled nav links to the same href elsewhere on the page.
    const ghost = page.locator('a[href="/theme-generator"].shadow-memphis-primary').first()
    await ghost.waitFor({ state: 'visible', timeout: 10_000 })
    const shadow = await ghost.evaluate((el) => getComputedStyle(el).boxShadow)
    const rgb = parseLastNonTransparentRgb(shadow)
    expectChannelsClose(rgb, [213, 168, 69], 'ghost.boxShadow', 4)
  })
})
