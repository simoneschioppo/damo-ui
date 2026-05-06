import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Static smoke check: every CSS import in `.ladle/components.tsx`
 * must resolve to a real file on disk.
 *
 * Regression: the file historically imported `../src/styles/themes.css`
 * (typo for `theme.css`) and `../src/styles/patterns.css` (a file that
 * lives in the consumer app, not the lib). Both broke `pnpm dev`
 * (Ladle serve) on cold start.
 */
describe('.ladle/components.tsx imports', () => {
  const componentsPath = resolve(__dirname, 'components.tsx')
  const source = readFileSync(componentsPath, 'utf8')
  const importRegex = /^\s*import\s+['"]([^'"]+)['"]/gm
  const imports: string[] = []
  for (const match of source.matchAll(importRegex)) imports.push(match[1])

  it('imports at least one stylesheet', () => {
    const cssImports = imports.filter((spec) => spec.endsWith('.css'))
    expect(cssImports.length).toBeGreaterThan(0)
  })

  it('every relative CSS import resolves to a real file on disk', () => {
    const cssImports = imports.filter((spec) => spec.endsWith('.css'))
    for (const spec of cssImports) {
      // skip non-relative specifiers (none expected today, future-proof)
      if (!spec.startsWith('.')) continue
      const abs = resolve(__dirname, spec)
      expect(existsSync(abs), `Ladle CSS import does not exist on disk: ${spec}`).toBe(true)
    }
  })

  it('does not reference the dropped themes.css / patterns.css filenames', () => {
    const joined = imports.join('\n')
    expect(joined).not.toMatch(/styles\/themes\.css/)
    expect(joined).not.toMatch(/styles\/patterns\.css/)
  })
})
