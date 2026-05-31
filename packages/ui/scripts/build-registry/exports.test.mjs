import { describe, it, expect } from 'vitest'
import { parseExports, exportedName, itemNameForPath } from './exports.mjs'

describe('exportedName', () => {
  it('strips a leading type keyword', () => {
    expect(exportedName('type ButtonProps')).toBe('ButtonProps')
  })
  it('resolves "X as Y" to the exported alias', () => {
    expect(exportedName('Foo as Bar')).toBe('Bar')
  })
  it('trims plain names', () => {
    expect(exportedName('  Button  ')).toBe('Button')
  })
  it('returns empty for blanks', () => {
    expect(exportedName('')).toBe('')
    expect(exportedName('  ')).toBe('')
  })
})

describe('parseExports', () => {
  it('parses single-line named re-exports', () => {
    const r = parseExports(`export { Button, type ButtonProps } from './components/button'`)
    expect(r).toEqual([
      { names: ['Button', 'ButtonProps'], from: './components/button', star: false },
    ])
  })

  it('parses multiline named re-exports', () => {
    const src = `export {\n  Dialog,\n  DialogTrigger,\n  type DialogProps,\n} from './components/dialog'`
    const r = parseExports(src)
    expect(r[0].names).toEqual(['Dialog', 'DialogTrigger', 'DialogProps'])
    expect(r[0].from).toBe('./components/dialog')
  })

  it('parses star re-exports', () => {
    const r = parseExports(`export * from './icons'`)
    expect(r).toEqual([{ names: [], from: './icons', star: true }])
  })

  it('parses a mixed barrel', () => {
    const src = [
      `export { cn } from './lib/cn'`,
      `export * from './icons'`,
      `export { Card, CardHeader } from './components/card'`,
    ].join('\n')
    const r = parseExports(src)
    expect(r.filter((e) => e.star)).toHaveLength(1)
    expect(r.find((e) => e.from === './components/card').names).toEqual(['Card', 'CardHeader'])
  })
})

describe('itemNameForPath', () => {
  it('maps component / lib / hook / icons paths', () => {
    expect(itemNameForPath('./components/dialog')).toBe('dialog')
    expect(itemNameForPath('./lib/cn')).toBe('cn')
    expect(itemNameForPath('./lib/i18n')).toBe('i18n')
    expect(itemNameForPath('./hooks/use-persisted-attr')).toBe('use-persisted-attr')
    expect(itemNameForPath('./icons')).toBe('icons')
  })
  it('returns null for unrecognised paths', () => {
    expect(itemNameForPath('./lib')).toBeNull()
    expect(itemNameForPath('react')).toBeNull()
  })
})
