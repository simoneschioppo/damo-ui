import { defineConfig } from 'tsup'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  splitting: false,
  minify: false,
  async onSuccess() {
    const distIndex = resolve('dist/index.js')
    const current = readFileSync(distIndex, 'utf8')
    if (!current.startsWith('"use client"')) {
      writeFileSync(distIndex, `"use client";\n${current}`)
    }
  },
})
