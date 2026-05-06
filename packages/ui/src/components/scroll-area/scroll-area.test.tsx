import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ScrollArea } from './scroll-area'

describe('ScrollArea', () => {
  it('renders the viewport with children', () => {
    const { getByText } = render(
      <ScrollArea className="h-32 w-32">
        <div>scroll content</div>
      </ScrollArea>,
    )
    expect(getByText('scroll content')).toBeInTheDocument()
  })

  // Regression: the scrollbar thumb used `hover:bg-ink-muted`, but
  // `--color-ink-muted` is not declared in the lib's Tailwind theme
  // bridge — the hover color silently failed to apply, leaving the
  // thumb static on hover. The lib's neutral semantic for a darker-
  // than-border hover surface is `--muted-foreground`. Switching to
  // `hover:bg-muted-foreground` makes the hover affordance visible
  // out of the box for any consumer.
  //
  // jsdom's ResizeObserver shim is a no-op, so Radix's ScrollAreaThumb
  // does not always mount in unit tests. Assert against the source
  // file content instead — this is a static contract check that's
  // resilient to Radix's runtime gating.
  it('uses a resolved muted-foreground hover token on the thumb (source contract)', async () => {
    const { readFileSync } = await import('node:fs')
    const { resolve, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const here = dirname(fileURLToPath(import.meta.url))
    const source = readFileSync(resolve(here, 'scroll-area.tsx'), 'utf8')
    expect(source).toContain('hover:bg-muted-foreground')
    expect(source).not.toContain('hover:bg-ink-muted')
  })
})
