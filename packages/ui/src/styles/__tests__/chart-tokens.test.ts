import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * AC-4 (J-08a) — chart token bridge regression guard.
 *
 * The lib already exposes `--color-chart-1..5` via @theme inline so
 * `bg-chart-1`, `text-chart-1`, `border-chart-1`, etc. utilities work
 * for consumers. The trace audit flagged J-08a as NONE-coverage
 * because no test guards this bridge — a future refactor could remove
 * a chart entry silently and consumers would only notice when their
 * dashboards stopped tinting.
 *
 * This is a regression-guard add-only test (the source contract is
 * already correct).
 */
describe('AC-4 — Chart tokens are bridged for Tailwind utilities', () => {
  const themeCss = readFileSync(
    resolve(__dirname, '..', 'theme.css'),
    'utf8',
  )

  const CHART_KEYS = ['1', '2', '3', '4', '5'] as const

  it.each(CHART_KEYS)(
    '@theme inline declares --color-chart-%s: var(--chart-%s)',
    (key) => {
      const compact = themeCss.replace(/\s+/g, ' ')
      const pattern = new RegExp(
        `--color-chart-${key}\\s*:\\s*var\\(--chart-${key}\\b`,
      )
      expect(compact).toMatch(pattern)
    },
  )
})
