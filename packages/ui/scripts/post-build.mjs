#!/usr/bin/env node
/**
 * Post-build cleanup for damo-ui dist files.
 *
 * What it does:
 *   1. Dedups `//# sourceMappingURL=` directives. tsup occasionally emits
 *      two of them when both the ESM and DTS passes touch the same file,
 *      which is harmless to tooling (readers honor the last one) but ships
 *      as published junk. We keep the first occurrence, drop the rest.
 *   2. Prepends `"use client";` to the consumer-facing entry points
 *      (`dist/index.js` and `dist/mocks/index.js`) so RSC consumers don't
 *      try to evaluate the lib on the server.
 *
 * Usage:
 *   node scripts/post-build.mjs dist/index.js dist/mocks/index.js dist/tailwind.preset.js
 *
 * Paths are resolved relative to the CWD (which is `packages/ui/` when
 * called from tsup's `onSuccess` or from package.json scripts).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const USE_CLIENT_ENTRIES = new Set(['dist/index.js', 'dist/mocks/index.js'])

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('post-build.mjs: no files specified')
  process.exit(1)
}

for (const relative of files) {
  const absolute = resolve(relative)
  let content = readFileSync(absolute, 'utf8')

  // Dedup //# sourceMappingURL= directives — keep the first.
  let seenSourceMap = false
  content = content
    .split('\n')
    .filter((line) => {
      if (line.startsWith('//# sourceMappingURL=')) {
        if (seenSourceMap) return false
        seenSourceMap = true
      }
      return true
    })
    .join('\n')

  // Prepend "use client" for RSC compat on consumer entry points.
  if (USE_CLIENT_ENTRIES.has(relative) && !content.startsWith('"use client"')) {
    content = `"use client";\n${content}`
  }

  writeFileSync(absolute, content)
}
