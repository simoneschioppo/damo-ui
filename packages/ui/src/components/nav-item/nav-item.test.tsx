import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { NavItem } from './nav-item'

describe('NavItem', () => {
  it('renders an anchor by default', () => {
    const { container } = render(<NavItem href="#">Home</NavItem>)
    const anchor = container.querySelector('a')
    expect(anchor).not.toBeNull()
    expect(anchor!.getAttribute('href')).toBe('#')
  })

  it('renders the requested element when `as` is provided', () => {
    const { container } = render(
      <NavItem as="button" type="button">
        Home
      </NavItem>,
    )
    expect(container.querySelector('button')).not.toBeNull()
    expect(container.querySelector('a')).toBeNull()
  })

  it('marks the active item with aria-current="page"', () => {
    const { container } = render(
      <NavItem href="#" active>
        Home
      </NavItem>,
    )
    const anchor = container.querySelector('a')!
    expect(anchor.getAttribute('aria-current')).toBe('page')
  })

  it('omits aria-current when not active', () => {
    const { container } = render(<NavItem href="#">Home</NavItem>)
    const anchor = container.querySelector('a')!
    expect(anchor.getAttribute('aria-current')).toBeNull()
  })

  it('renders provided icon and end adornment slots', () => {
    const { container, getByText } = render(
      <NavItem href="#" icon={<span data-testid="icon">i</span>} endAdornment={<span>END</span>}>
        Home
      </NavItem>,
    )
    expect(container.querySelector('[data-testid="icon"]')).not.toBeNull()
    expect(getByText('END')).toBeInTheDocument()
  })

  it('forwards ref and arbitrary props to the rendered element', () => {
    const ref = createRef<HTMLAnchorElement>()
    const { container } = render(
      <NavItem ref={ref} href="#" data-testid="nav" className="extra-class">
        x
      </NavItem>,
    )
    expect(ref.current).not.toBeNull()
    const anchor = container.querySelector('a')!
    expect(anchor.getAttribute('data-testid')).toBe('nav')
    expect(anchor.className).toContain('extra-class')
  })
})

describe('NavItem default tone — selection chrome', () => {
  it('applies gradient background, inset outline, and ::before accent bar when active', () => {
    // Active item in default (light) tone should mirror the reference design:
    // subtle gradient + 1px inset border + 3px vertical accent bar on the left.
    const { container } = render(
      <NavItem href="#" active>
        Introduction
      </NavItem>,
    )
    const anchor = container.querySelector('a')!
    const cls = anchor.className

    // Gradient background bound to aria-current=page (replaces the previous
    // flat bg-muted treatment so the selection stands out).
    expect(cls).toMatch(/aria-\[current=page\]:bg-\[linear-gradient\(/)
    // Inset 1px outline using the primary accent.
    expect(cls).toMatch(/aria-\[current=page\]:shadow-\[inset_0_0_0_1px_/)
    // Pseudo-element ::before forms the vertical bar.
    expect(cls).toContain('aria-[current=page]:before:content-[""]')
    expect(cls).toContain('aria-[current=page]:before:absolute')
    expect(cls).toContain('aria-[current=page]:before:w-[3px]')
    expect(cls).toContain('aria-[current=page]:before:bg-primary')
    // New `selection` radius token — drives the chrome rounding through the
    // theme generator instead of being hardcoded.
    expect(cls).toContain('aria-[current=page]:rounded-selection')
  })

  it('does NOT apply selection chrome when inactive', () => {
    const { container } = render(<NavItem href="#">Tokens</NavItem>)
    const cls = container.querySelector('a')!.className
    // The ::before bar is gated entirely on aria-current=page, but when the
    // attribute isn't present we still want the *base* class to require it
    // (no orphan content quotes leaking onto idle items).
    // We assert by rendering and checking the rendered element actually has
    // aria-current absent — the active styling won't apply at runtime, which
    // keeps inactive items visually clean. The classlist still contains the
    // utility tokens (CSS gates them on the attribute), so we only verify the
    // attribute itself is missing.
    expect(container.querySelector('a')!.getAttribute('aria-current')).toBeNull()
    // Sanity: the classlist still embeds the aria-current selector. This
    // guards against accidentally moving the rule out of the attribute gate.
    expect(cls).toContain('aria-[current=page]')
  })
})

describe('NavItem onDark tone — preserved behavior', () => {
  it('still applies the onDark gradient + accent bar when active', () => {
    const { container } = render(
      <NavItem href="#" tone="onDark" active>
        Home
      </NavItem>,
    )
    const cls = container.querySelector('a')!.className
    expect(cls).toContain('aria-[current=page]:text-[var(--nav-on-dark-accent)]')
    expect(cls).toContain('aria-[current=page]:before:bg-[var(--nav-on-dark-accent-strong)]')
  })

  it('idle + hover text colours read from the nav-on-dark identity tokens', () => {
    // Regression: previously hardcoded to rgba(255,255,255,0.72) / text-white,
    // which made the theme generator's "Nav on dark / foreground(-strong)"
    // controls visually no-ops. Wiring them through the variants makes those
    // tokens actually theme the navbar.
    const { container } = render(
      <NavItem href="#" tone="onDark">
        Home
      </NavItem>,
    )
    const cls = container.querySelector('a')!.className
    expect(cls).toContain('text-[var(--nav-on-dark-foreground)]')
    expect(cls).toContain('hover:text-[var(--nav-on-dark-foreground-strong)]')
    // Old hardcoded colours must not survive.
    expect(cls).not.toContain('text-[rgba(255,255,255,0.72)]')
    expect(cls).not.toContain('hover:text-white')
  })
})
