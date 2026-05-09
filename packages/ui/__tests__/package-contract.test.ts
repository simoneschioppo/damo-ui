import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Static contract checks on packages/ui/package.json. Guards against
 * accidental drift in the consumer-facing dependency surface.
 */
describe('package.json — peer dependencies', () => {
  const pkgPath = resolve(__dirname, '..', 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
    peerDependencies?: Record<string, string>
  }

  it('declares the documented peer set (react, react-dom, tailwindcss)', () => {
    const peers = pkg.peerDependencies ?? {}
    // Each entry must be a non-empty version range string — empty strings
    // would silently satisfy a `toBeTruthy()` check but break consumer
    // installs.
    expect(peers.react).toMatch(/\d/)
    expect(peers['react-dom']).toMatch(/\d/)
    expect(peers.tailwindcss).toMatch(/\d/)
  })

  // Regression: the lib's overlays and menus use animate-in / fade-in-0 /
  // zoom-in-95 / slide-in-from-* classes that ship from the
  // tailwindcss-animate plugin. Without declaring it as a peer, consumers
  // pulling damo-ui would see Dialog/Drawer/Popover/Tooltip/DropdownMenu/
  // ContextMenu/Toast/Accordion mount with no entrance animations (the
  // classes silently emit nothing in their Tailwind build).
  it('declares tailwindcss-animate as a peer dependency', () => {
    const peers = pkg.peerDependencies ?? {}
    expect(peers['tailwindcss-animate']).toMatch(/\d/)
  })
})
