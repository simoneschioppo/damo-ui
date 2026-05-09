import { readFile, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const HERE = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = resolve(HERE, '..', 'public')
const SOURCE_SVG = resolve(PUBLIC_DIR, 'icons', 'source', 'favicon-source.svg')

interface PngTarget {
  readonly file: string
  readonly size: number
  readonly flatten: boolean
}

const PNG_TARGETS: readonly PngTarget[] = [
  { file: 'favicon-16x16.png', size: 16, flatten: false },
  { file: 'favicon-32x32.png', size: 32, flatten: false },
  { file: 'apple-touch-icon.png', size: 180, flatten: true },
  { file: 'android-chrome-192x192.png', size: 192, flatten: false },
  { file: 'android-chrome-512x512.png', size: 512, flatten: false },
]

const ICO_SIZES: readonly number[] = [16, 32, 48]

// Rasterise the SVG at a density that produces an internal raster ~2× the
// target size (good downsampling margin without exploding memory). Sharp
// reads `density` as dpi against a 72-dpi reference; for the 32-px viewBox
// the internal raster is `32 × density / 72`. Capping at 1440 dpi keeps the
// 512-px target's intermediate at ~640 px instead of >2700 px.
function densityFor(size: number): number {
  return Math.min(1440, Math.max(384, size * 5))
}

async function renderPng(svg: Buffer, size: number, flatten: boolean): Promise<Buffer> {
  const pipeline = sharp(svg, { density: densityFor(size) }).resize(size, size, { fit: 'contain' })
  if (flatten) {
    pipeline.flatten({ background: '#ffffff' })
  }
  return pipeline.png({ compressionLevel: 9 }).toBuffer()
}

// Encode a multi-resolution ICO from an array of PNG buffers (Vista+ format,
// supported by every browser shipped in the last 15 years). Inline avoids a
// transitive dep chain (`to-ico` → `resize-img` → `jimp@0.2`) carrying CVEs
// that pnpm audit flags as critical, even though the script is dev-time only.
function encodePngsAsIco(pngs: readonly Buffer[]): Buffer {
  const ICONDIR = 6
  const ICONDIRENTRY = 16
  const headerSize = ICONDIR + ICONDIRENTRY * pngs.length
  const buffers: Buffer[] = []

  const dir = Buffer.alloc(ICONDIR)
  dir.writeUInt16LE(0, 0)
  dir.writeUInt16LE(1, 2)
  dir.writeUInt16LE(pngs.length, 4)
  buffers.push(dir)

  let offset = headerSize
  for (let i = 0; i < pngs.length; i++) {
    const png = pngs[i]!
    const { width, height } = readPngDimensions(png)
    const entry = Buffer.alloc(ICONDIRENTRY)
    entry.writeUInt8(width >= 256 ? 0 : width, 0)
    entry.writeUInt8(height >= 256 ? 0 : height, 1)
    entry.writeUInt8(0, 2)
    entry.writeUInt8(0, 3)
    // For PNG-embedded entries Microsoft's ICO spec says wPlanes and
    // wBitCount should be 0 (not 1/32 as for raw-bitmap entries). Browsers
    // tolerate the wrong values, but strict ICO validators (ImageMagick
    // identify, W3C's favicon checker) reject them.
    entry.writeUInt16LE(0, 4)
    entry.writeUInt16LE(0, 6)
    entry.writeUInt32LE(png.byteLength, 8)
    entry.writeUInt32LE(offset, 12)
    buffers.push(entry)
    offset += png.byteLength
  }
  for (const png of pngs) buffers.push(png)
  return Buffer.concat(buffers)
}

function readPngDimensions(png: Buffer): { width: number; height: number } {
  if (png.byteLength < 24 || png[0] !== 0x89 || png.subarray(1, 4).toString('ascii') !== 'PNG') {
    throw new Error('Not a PNG buffer (bad magic)')
  }
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) }
}

async function main(): Promise<void> {
  const svg = await readFile(SOURCE_SVG)

  for (const { file, size, flatten } of PNG_TARGETS) {
    const buf = await renderPng(svg, size, flatten)
    const out = resolve(PUBLIC_DIR, file)
    await writeFile(out, buf)
    console.log(`✓ ${file} (${size}×${size}, ${buf.byteLength} bytes)`)
  }

  const icoSources = await Promise.all(ICO_SIZES.map((size) => renderPng(svg, size, false)))
  const ico = encodePngsAsIco(icoSources)
  await writeFile(resolve(PUBLIC_DIR, 'favicon.ico'), ico)
  console.log(`✓ favicon.ico (${ICO_SIZES.join(',')}, ${ico.byteLength} bytes)`)
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
