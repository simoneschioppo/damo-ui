import { describe, expect, it } from 'vitest'
import { existsSync, statSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import sharp from 'sharp'

const PUBLIC_DIR = resolve(__dirname, '..', '..', 'public')

describe('favicon icon set (#78)', () => {
  it.each([
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
  ])('emits %s into apps/web/public', (name) => {
    const p = resolve(PUBLIC_DIR, name)
    expect(existsSync(p), `missing ${name}`).toBe(true)
    expect(statSync(p).size).toBeGreaterThan(0)
  })

  it('keeps the editable source SVG under public/icons/source/', () => {
    const p = resolve(PUBLIC_DIR, 'icons', 'source', 'favicon-source.svg')
    expect(existsSync(p)).toBe(true)
    const svg = readFileSync(p, 'utf8')
    expect(svg).toMatch(/<svg/)
    expect(svg).toMatch(/viewBox="0 0 32 32"/)
  })

  it('PNG outputs start with the PNG magic bytes (\\x89PNG)', () => {
    const names = [
      'favicon-16x16.png',
      'favicon-32x32.png',
      'apple-touch-icon.png',
      'android-chrome-192x192.png',
      'android-chrome-512x512.png',
    ]
    for (const n of names) {
      const buf = readFileSync(resolve(PUBLIC_DIR, n))
      expect(buf[0]).toBe(0x89)
      expect(buf.subarray(1, 4).toString('ascii')).toBe('PNG')
    }
  })

  it.each([
    ['favicon-16x16.png', 16],
    ['favicon-32x32.png', 32],
    ['apple-touch-icon.png', 180],
    ['android-chrome-192x192.png', 192],
    ['android-chrome-512x512.png', 512],
  ])('%s has the declared pixel dimensions (%dx%d)', async (name, expected) => {
    const meta = await sharp(resolve(PUBLIC_DIR, name)).metadata()
    expect(meta.width).toBe(expected)
    expect(meta.height).toBe(expected)
  })

  it('ICO output is a valid 3-image multi-resolution container (16/32/48)', () => {
    const buf = readFileSync(resolve(PUBLIC_DIR, 'favicon.ico'))
    expect(buf.readUInt16LE(0)).toBe(0)
    expect(buf.readUInt16LE(2)).toBe(1)
    expect(buf.readUInt16LE(4)).toBe(3)
    const widths = [buf.readUInt8(6), buf.readUInt8(6 + 16), buf.readUInt8(6 + 32)]
    expect(new Set(widths)).toEqual(new Set([16, 32, 48]))
  })
})

describe('site.webmanifest (#78)', () => {
  const manifestPath = resolve(PUBLIC_DIR, 'site.webmanifest')

  it('exists at public/site.webmanifest', () => {
    expect(existsSync(manifestPath)).toBe(true)
  })

  it('parses as JSON with all required PWA fields', () => {
    const raw = readFileSync(manifestPath, 'utf8')
    const m = JSON.parse(raw) as Record<string, unknown>
    expect(typeof m.name).toBe('string')
    expect(typeof m.short_name).toBe('string')
    expect(m.theme_color).toBe('#7a3980')
    expect(m.background_color).toBe('#ffffff')
    expect(m.display).toBe('standalone')
    expect(m.start_url).toBe('/')
  })

  it('declares the 192 + 512 android-chrome PNGs in icons[]', () => {
    const m = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      icons: Array<{ src: string; sizes: string; type: string }>
    }
    const sizes = new Set(m.icons.map((i) => i.sizes))
    expect(sizes.has('192x192')).toBe(true)
    expect(sizes.has('512x512')).toBe(true)
    for (const i of m.icons) {
      expect(i.type).toBe('image/png')
      expect(i.src.startsWith('/')).toBe(true)
    }
  })
})
