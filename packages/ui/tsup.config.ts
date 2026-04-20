import { defineConfig } from 'tsup'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
  entry: ['src/index.ts', 'src/mocks/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  splitting: false,
  minify: false,
  async onSuccess() {
    for (const relative of ['dist/index.js', 'dist/mocks/index.js']) {
      const absolute = resolve(relative)
      const current = readFileSync(absolute, 'utf8')
      if (!current.startsWith('"use client"')) {
        writeFileSync(absolute, `"use client";\n${current}`)
      }
    }
  },
})
