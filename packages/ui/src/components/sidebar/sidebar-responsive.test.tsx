import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar, SidebarBody } from './sidebar'
import { SidebarProvider, useSidebar } from './sidebar-context'
import { SidebarTrigger } from './sidebar-trigger'

/** Force `window.matchMedia` to a fixed `matches` value (desktop=false, mobile=true). */
function setMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

afterEach(() => {
  cleanup()
})

describe('Sidebar — responsive on desktop', () => {
  it('renders a sticky aside, flash-guarded to hidden below the breakpoint', () => {
    setMatchMedia(false)
    const { container } = render(
      <SidebarProvider>
        <Sidebar responsive>
          <SidebarBody>nav</SidebarBody>
        </Sidebar>
      </SidebarProvider>,
    )
    const aside = container.querySelector('aside')
    expect(aside).not.toBeNull()
    const classes = aside!.className.split(/\s+/)
    // tailwind-merge resolves the base `flex` against `hidden` + `lg:flex`
    expect(classes).toContain('hidden')
    expect(classes).toContain('lg:flex')
    expect(classes).not.toContain('flex')
  })

  it('falls back to a plain aside (no reveal classes) without a provider', () => {
    setMatchMedia(false)
    const { container } = render(
      <Sidebar responsive>
        <SidebarBody>nav</SidebarBody>
      </Sidebar>,
    )
    const aside = container.querySelector('aside')
    expect(aside).not.toBeNull()
    expect(aside!.className).not.toContain('lg:flex')
  })

  it('still renders a normal aside when responsive is not set', () => {
    setMatchMedia(false)
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarBody>nav</SidebarBody>
        </Sidebar>
      </SidebarProvider>,
    )
    const aside = container.querySelector('aside')
    expect(aside).not.toBeNull()
    const classes = aside!.className.split(/\s+/)
    expect(classes).not.toContain('hidden')
    expect(classes).not.toContain('lg:flex')
    expect(classes).toContain('flex')
  })
})

describe('Sidebar — responsive on mobile', () => {
  it('does not render an inline aside, and keeps the drawer closed initially', () => {
    setMatchMedia(true)
    const { container } = render(
      <SidebarProvider>
        <Sidebar responsive>
          <SidebarBody>nav-content</SidebarBody>
        </Sidebar>
      </SidebarProvider>,
    )
    expect(container.querySelector('aside')).toBeNull()
    expect(screen.queryByText('nav-content')).toBeNull()
  })

  it('opens the nav inside a drawer when the trigger is clicked', async () => {
    setMatchMedia(true)
    const user = userEvent.setup()
    render(
      <SidebarProvider>
        <SidebarTrigger />
        <Sidebar responsive>
          <SidebarBody>nav-content</SidebarBody>
        </Sidebar>
      </SidebarProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('nav-content')).toBeInTheDocument()
  })
})

describe('SidebarTrigger', () => {
  it('is auto-hidden at/above the breakpoint and is labelled', () => {
    setMatchMedia(false)
    render(
      <SidebarProvider>
        <SidebarTrigger />
      </SidebarProvider>,
    )
    const btn = screen.getByRole('button', { name: 'Toggle navigation' })
    expect(btn.className).toContain('lg:hidden')
    expect(btn.getAttribute('aria-expanded')).toBe('false')
  })

  it('reflects open state through aria-expanded', async () => {
    setMatchMedia(true)
    const user = userEvent.setup()
    render(
      <SidebarProvider>
        <SidebarTrigger />
        <Sidebar responsive>
          <SidebarBody>x</SidebarBody>
        </Sidebar>
      </SidebarProvider>,
    )
    const btn = screen.getByRole('button', { name: 'Toggle navigation' })
    expect(btn.getAttribute('aria-expanded')).toBe('false')
    await user.click(btn)
    expect(btn.getAttribute('aria-expanded')).toBe('true')
  })

  it('honors a custom breakpoint from the provider (md:hidden)', () => {
    setMatchMedia(false)
    render(
      <SidebarProvider breakpoint="md">
        <SidebarTrigger />
      </SidebarProvider>,
    )
    const btn = screen.getByRole('button', { name: 'Toggle navigation' })
    expect(btn.className).toContain('md:hidden')
  })
})

describe('useSidebar', () => {
  it('throws when used outside a SidebarProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useSidebar())).toThrow(/SidebarProvider/)
    spy.mockRestore()
  })
})
