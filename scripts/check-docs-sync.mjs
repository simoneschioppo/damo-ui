#!/usr/bin/env node
/**
 * scripts/check-docs-sync.mjs
 *
 * Guardrail that fails CI when the public surface of damo-ui drifts away from
 * the docs site. Two checks:
 *
 *   1. Every component folder under packages/ui/src/components/<name>/ that is
 *      part of the public export (i.e. referenced from packages/ui/src/index.ts)
 *      MUST have a matching apps/web/app/docs/components/<name>/page.tsx.
 *
 *   2. Every doc page under apps/web/app/docs/components/<name>/ must point at
 *      a component folder that still exists in packages/ui/src/components.
 *      (This catches removed / renamed components whose docs were forgotten.)
 *
 * Exit codes:
 *   0 — all good
 *   1 — drift detected, prints a diff
 *
 * Usage:
 *   node scripts/check-docs-sync.mjs
 *   pnpm check:docs-sync     # via root package.json
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const LIB_COMPONENTS_DIR = join(ROOT, 'packages/ui/src/components')
const DOCS_COMPONENTS_DIR = join(ROOT, 'apps/web/app/docs/components')
const LIB_INDEX = join(ROOT, 'packages/ui/src/index.ts')

// Components that intentionally do not have a dedicated docs page.
// The map value is the "host" page where the component IS documented — the
// guardrail asserts the host page exists, so renaming or deleting the host
// surfaces as a loud failure rather than a silent ALLOWLIST drift.
//
// Add an entry only after you've convinced yourself that the component
// genuinely should not be documented standalone (e.g. a thin variant of a
// host component, or an internal helper that leaked into the public surface).
const ALLOWLIST = new Map([
  // IconButton is a thin Button preset (size="icon" + aria-label requirement)
  // and is documented inside /docs/components/button so users find it next to
  // Button rather than on a standalone page.
  ['icon-button', 'button'],
])

function listDirEntries(absPath) {
  let entries
  try {
    entries = readdirSync(absPath)
  } catch {
    return []
  }
  return entries.filter((name) => {
    if (name.startsWith('_') || name.startsWith('.')) return false
    if (name.startsWith('[')) return false // skip Next.js dynamic segments
    const full = join(absPath, name)
    try {
      return statSync(full).isDirectory()
    } catch {
      return false
    }
  })
}

function readLibIndex() {
  try {
    return readFileSync(LIB_INDEX, 'utf8')
  } catch (err) {
    throw new Error(`Cannot read ${LIB_INDEX}: ${err.message}`)
  }
}

function isPublicComponent(name, indexSource) {
  // The component is considered public if its folder appears in any
  // `from './components/<name>...'` line in the lib index.
  const re = new RegExp(`['"]\\./components/${escapeRegex(name)}(?:[/'"])`, 'm')
  return re.test(indexSource)
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function hasDocPage(name) {
  const pagePath = join(DOCS_COMPONENTS_DIR, name, 'page.tsx')
  try {
    return statSync(pagePath).isFile()
  } catch {
    return false
  }
}

function main() {
  const indexSource = readLibIndex()
  const libComponents = listDirEntries(LIB_COMPONENTS_DIR)
  const docComponents = listDirEntries(DOCS_COMPONENTS_DIR)

  const publicLibComponents = libComponents.filter((name) => isPublicComponent(name, indexSource))

  const missingDocs = publicLibComponents
    .filter((name) => !ALLOWLIST.has(name) && !hasDocPage(name))
    .sort()

  const orphanedDocs = docComponents.filter((name) => !publicLibComponents.includes(name)).sort()

  // For each ALLOWLIST entry, ensure the host page it points to still exists.
  // This converts "rename Button without remembering to update the merged
  // page" from a silent drift into a loud failure.
  const brokenAllowlist = []
  for (const [name, hostPage] of ALLOWLIST) {
    if (publicLibComponents.includes(name) && !hasDocPage(hostPage)) {
      brokenAllowlist.push({ name, hostPage })
    }
  }

  let failed = false

  if (missingDocs.length > 0) {
    failed = true
    console.error('❌ Public components missing docs pages:')
    for (const name of missingDocs) {
      console.error(`   • packages/ui/src/components/${name}/`)
      console.error(`     → expected apps/web/app/docs/components/${name}/page.tsx`)
    }
    console.error('')
  }

  if (orphanedDocs.length > 0) {
    failed = true
    console.error('❌ Orphaned docs pages (no matching component in packages/ui):')
    for (const name of orphanedDocs) {
      console.error(`   • apps/web/app/docs/components/${name}/`)
      console.error(`     → component folder packages/ui/src/components/${name}/ not found`)
    }
    console.error('')
  }

  if (brokenAllowlist.length > 0) {
    failed = true
    console.error('❌ ALLOWLIST host page missing:')
    for (const { name, hostPage } of brokenAllowlist) {
      console.error(`   • '${name}' is allowlisted to be documented inside '${hostPage}',`)
      console.error(`     but apps/web/app/docs/components/${hostPage}/page.tsx does not exist.`)
    }
    console.error('')
  }

  if (failed) {
    console.error('Fix the drift then re-run `pnpm check:docs-sync`.')
    console.error(
      'If a component is intentionally undocumented, add it to ALLOWLIST in scripts/check-docs-sync.mjs.',
    )
    process.exit(1)
  }

  const total = publicLibComponents.length
  console.log(`✓ docs-sync OK — ${total} public components, ${total} docs pages.`)
}

main()
