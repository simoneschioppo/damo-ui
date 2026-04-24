import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { AppTopBar } from './app-top-bar'

describe('AppTopBar', () => {
  it('renders logo, nav, and actions slots', () => {
    const { getByText } = render(
      <AppTopBar
        logo={<span>LOGO</span>}
        nav={<a href="/x">Nav Link</a>}
        actions={<button>Act</button>}
      />,
    )
    expect(getByText('LOGO')).toBeTruthy()
    expect(getByText('Nav Link')).toBeTruthy()
    expect(getByText('Act')).toBeTruthy()
  })

  it('renders only the logo when nav and actions are not passed', () => {
    const { container, getByText } = render(<AppTopBar logo={<span>LOGO</span>} />)
    expect(getByText('LOGO')).toBeTruthy()
    // No nav element when nav prop missing
    expect(container.querySelector('nav')).toBeNull()
  })

  it('omits nav wrapper when nav is not provided', () => {
    const { container } = render(
      <AppTopBar logo={<span>L</span>} actions={<button>A</button>} />,
    )
    expect(container.querySelector('nav')).toBeNull()
  })

  it('renders a nav element when nav is provided', () => {
    const { container } = render(
      <AppTopBar logo={<span>L</span>} nav={<a href="/a">A</a>} />,
    )
    const nav = container.querySelector('nav')
    expect(nav).not.toBeNull()
    expect(nav!.className).toContain('flex')
    expect(nav!.className).toContain('gap-6')
  })

  it('is sticky by default', () => {
    const { container } = render(<AppTopBar logo={<span>L</span>} />)
    const header = container.querySelector('header')
    expect(header).not.toBeNull()
    expect(header!.className).toContain('sticky')
    expect(header!.className).toContain('top-0')
    expect(header!.className).toContain('z-header')
  })

  it('omits sticky classes when sticky={false}', () => {
    const { container } = render(<AppTopBar logo={<span>L</span>} sticky={false} />)
    const header = container.querySelector('header')
    expect(header).not.toBeNull()
    expect(header!.className).not.toContain('sticky')
    expect(header!.className).not.toContain('z-header')
  })

  it('applies the Memphis chrome classes on the header', () => {
    const { container } = render(<AppTopBar logo={<span>L</span>} />)
    const header = container.querySelector('header')!
    expect(header.className).toContain('flex')
    expect(header.className).toContain('items-center')
    expect(header.className).toContain('justify-between')
    expect(header.className).toContain('gap-6')
    expect(header.className).toContain('flex-wrap')
    expect(header.className).toContain('px-6')
    expect(header.className).toContain('h-[var(--header-height)]')
    expect(header.className).toContain('min-h-[var(--header-height)]')
    expect(header.className).toContain('border-b-2')
    expect(header.className).toContain('border-memphis')
    expect(header.className).toContain('bg-card')
    expect(header.className).toContain('text-foreground')
  })

  it('applies the logo wrapper typography classes', () => {
    const { getByText } = render(<AppTopBar logo={<span>BRAND</span>} />)
    const logoWrapper = getByText('BRAND').parentElement!
    expect(logoWrapper.className).toContain('font-display')
    expect(logoWrapper.className).toContain('text-xl')
    expect(logoWrapper.className).toContain('tracking-wider')
  })

  it('applies actions wrapper layout classes', () => {
    const { getByText } = render(
      <AppTopBar logo={<span>L</span>} actions={<button>Do</button>} />,
    )
    const actionsWrapper = getByText('Do').parentElement!
    expect(actionsWrapper.className).toContain('flex')
    expect(actionsWrapper.className).toContain('gap-4')
    expect(actionsWrapper.className).toContain('items-center')
    expect(actionsWrapper.className).toContain('flex-wrap')
  })

  it('forwards className to the header', () => {
    const { container } = render(
      <AppTopBar logo={<span>L</span>} className="extra-class" />,
    )
    const header = container.querySelector('header')!
    expect(header.className).toContain('extra-class')
    // Base classes still present
    expect(header.className).toContain('flex')
  })

  it('forwards ref to the header element', () => {
    const ref = createRef<HTMLElement>()
    render(<AppTopBar ref={ref} logo={<span>L</span>} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current!.tagName.toLowerCase()).toBe('header')
  })

  it('spreads additional props onto the header', () => {
    const { container } = render(
      <AppTopBar logo={<span>L</span>} data-testid="topbar" aria-label="site header" />,
    )
    const header = container.querySelector('header')!
    expect(header.getAttribute('data-testid')).toBe('topbar')
    expect(header.getAttribute('aria-label')).toBe('site header')
  })
})
