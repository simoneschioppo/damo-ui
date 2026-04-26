import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  Sidebar,
  SidebarHeader,
  SidebarBrand,
  SidebarSubtitle,
  SidebarBody,
  SidebarFooter,
} from './sidebar'

describe('Sidebar', () => {
  it('renders as an aside element by default', () => {
    const { container } = render(<Sidebar>content</Sidebar>)
    const aside = container.querySelector('aside')
    expect(aside).not.toBeNull()
  })

  it('applies the Memphis chrome classes', () => {
    const { container } = render(<Sidebar>x</Sidebar>)
    const aside = container.querySelector('aside')!
    expect(aside.className).toContain('flex')
    expect(aside.className).toContain('flex-col')
    expect(aside.className).toContain('bg-muted')
    expect(aside.className).toContain('text-foreground')
    expect(aside.className).toContain('overflow-hidden')
  })

  it('is sticky by default and uses --header-height offset', () => {
    const { container } = render(<Sidebar>x</Sidebar>)
    const aside = container.querySelector('aside')!
    expect(aside.className).toContain('sticky')
    expect(aside.className).toContain('top-[var(--header-height)]')
    expect(aside.className).toContain('h-[calc(100vh-var(--header-height))]')
  })

  it('omits sticky classes when sticky={false}', () => {
    const { container } = render(<Sidebar sticky={false}>x</Sidebar>)
    const aside = container.querySelector('aside')!
    expect(aside.className).not.toContain('sticky')
    expect(aside.className).not.toContain('top-[var(--header-height)]')
  })

  it('applies border-right-2 border-memphis by default', () => {
    const { container } = render(<Sidebar>x</Sidebar>)
    const aside = container.querySelector('aside')!
    expect(aside.className).toContain('border-r-2')
    expect(aside.className).toContain('border-memphis')
  })

  it('applies border-left when border="left"', () => {
    const { container } = render(<Sidebar border="left">x</Sidebar>)
    const aside = container.querySelector('aside')!
    expect(aside.className).toContain('border-l-2')
    expect(aside.className).toContain('border-memphis')
    expect(aside.className).not.toContain('border-r-2')
  })

  it('omits border when border="none"', () => {
    const { container } = render(<Sidebar border="none">x</Sidebar>)
    const aside = container.querySelector('aside')!
    expect(aside.className).not.toContain('border-r-2')
    expect(aside.className).not.toContain('border-l-2')
  })

  it('applies a numeric width as inline style', () => {
    const { container } = render(<Sidebar width={320}>x</Sidebar>)
    const aside = container.querySelector('aside')!
    expect(aside.style.width).toBe('320px')
  })

  it('applies a string width as inline style', () => {
    const { container } = render(<Sidebar width="18rem">x</Sidebar>)
    const aside = container.querySelector('aside')!
    expect(aside.style.width).toBe('18rem')
  })

  it('forwards className onto the aside', () => {
    const { container } = render(<Sidebar className="extra-class">x</Sidebar>)
    const aside = container.querySelector('aside')!
    expect(aside.className).toContain('extra-class')
    expect(aside.className).toContain('flex-col')
  })

  it('forwards ref to the aside element', () => {
    const ref = createRef<HTMLElement>()
    render(<Sidebar ref={ref}>x</Sidebar>)
    expect(ref.current).not.toBeNull()
    expect(ref.current!.tagName.toLowerCase()).toBe('aside')
  })

  it('spreads additional props onto the aside', () => {
    const { container } = render(
      <Sidebar data-testid="sb" aria-label="side nav">
        x
      </Sidebar>,
    )
    const aside = container.querySelector('aside')!
    expect(aside.getAttribute('data-testid')).toBe('sb')
    expect(aside.getAttribute('aria-label')).toBe('side nav')
  })
})

describe('SidebarHeader', () => {
  it('renders children in a flex column stack', () => {
    const { container } = render(<SidebarHeader>x</SidebarHeader>)
    const el = container.firstElementChild!
    expect(el.className).toContain('flex')
    expect(el.className).toContain('flex-col')
  })

  it('forwards className and ref', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(
      <SidebarHeader ref={ref} className="hdr-x">
        y
      </SidebarHeader>,
    )
    expect(ref.current).not.toBeNull()
    expect(container.firstElementChild!.className).toContain('hdr-x')
  })
})

describe('SidebarBrand', () => {
  it('applies display font, tracking and accent color', () => {
    const { container } = render(<SidebarBrand>DAMO · UI</SidebarBrand>)
    const el = container.firstElementChild!
    expect(el.className).toContain('font-display')
    expect(el.className).toContain('tracking-[0.12em]')
    expect(el.className).toContain('text-primary')
  })

  it('renders as a div by default', () => {
    const { container } = render(<SidebarBrand>x</SidebarBrand>)
    expect(container.firstElementChild!.tagName.toLowerCase()).toBe('div')
  })
})

describe('SidebarSubtitle', () => {
  it('applies mono font, uppercase and accent color', () => {
    const { container } = render(<SidebarSubtitle>THEME</SidebarSubtitle>)
    const el = container.firstElementChild!
    expect(el.className).toContain('font-mono')
    expect(el.className).toContain('uppercase')
    expect(el.className).toContain('text-primary')
  })
})

describe('SidebarBody', () => {
  it('fills remaining space between header and footer and scrolls internally', () => {
    const { container } = render(<SidebarBody>x</SidebarBody>)
    const el = container.firstElementChild!
    expect(el.className).toContain('flex-1')
    expect(el.className).toContain('min-h-0')
    expect(el.className).toContain('overflow-y-auto')
    expect(el.className).toContain('pr-3')
  })
})

describe('SidebarFooter', () => {
  it('sticks to the bottom with memphis top border and padding-top', () => {
    const { container } = render(<SidebarFooter>x</SidebarFooter>)
    const el = container.firstElementChild!
    expect(el.className).toContain('mt-auto')
    expect(el.className).toContain('border-t-2')
    expect(el.className).toContain('border-memphis')
    expect(el.className).toContain('pt-5')
    expect(el.className).toContain('flex')
    expect(el.className).toContain('flex-col')
  })
})
