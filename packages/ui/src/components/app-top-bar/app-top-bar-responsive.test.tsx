import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppTopBar } from './app-top-bar'

afterEach(() => {
  cleanup()
})

describe('AppTopBar — responsive nav', () => {
  it('does not wrap the header (no flex-wrap → no mobile spill)', () => {
    const { container } = render(<AppTopBar logo={<span>L</span>} nav={<a href="/a">A</a>} />)
    const header = container.querySelector('header')!
    expect(header.className.split(/\s+/)).not.toContain('flex-wrap')
  })

  it('reveals the inline nav only at/above the breakpoint (md by default)', () => {
    const { container } = render(<AppTopBar logo={<span>L</span>} nav={<a href="/a">A</a>} />)
    const nav = container.querySelector('nav')!
    const classes = nav.className.split(/\s+/)
    expect(classes).toContain('hidden')
    expect(classes).toContain('md:flex')
  })

  it('renders a mobile menu button (md:hidden) when nav is provided', () => {
    render(<AppTopBar logo={<span>L</span>} nav={<a href="/a">A</a>} />)
    const menuBtn = screen.getByRole('button', { name: 'Open menu' })
    expect(menuBtn.className.split(/\s+/)).toContain('md:hidden')
  })

  it('does not render a mobile menu button when nav is absent', () => {
    render(<AppTopBar logo={<span>L</span>} actions={<button>Act</button>} />)
    expect(screen.queryByRole('button', { name: 'Open menu' })).toBeNull()
  })

  it('opens a drawer containing the nav when the menu button is clicked', async () => {
    const user = userEvent.setup()
    render(<AppTopBar logo={<span>L</span>} nav={<a href="/docs">Docs</a>} />)
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('link', { name: 'Docs' })).toBeInTheDocument()
  })

  it('maps a custom mobileBreakpoint onto the toggle classes', () => {
    const { container } = render(
      <AppTopBar logo={<span>L</span>} nav={<a href="/a">A</a>} mobileBreakpoint="lg" />,
    )
    const nav = container.querySelector('nav')!
    expect(nav.className.split(/\s+/)).toContain('lg:flex')
    const menuBtn = screen.getByRole('button', { name: 'Open menu' })
    expect(menuBtn.className.split(/\s+/)).toContain('lg:hidden')
  })
})
