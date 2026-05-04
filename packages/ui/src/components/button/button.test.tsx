import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders primary variant with semantic tokens', () => {
    const { getByRole } = render(<Button variant="primary">Click</Button>)
    const btn = getByRole('button')
    expect(btn.className).toContain('bg-primary')
    expect(btn.className).toContain('text-primary-foreground')
  })

  it('renders primary variant base classes', () => {
    const { getByRole } = render(<Button variant="primary">Click</Button>)
    const btn = getByRole('button')
    expect(btn.className).toContain('border-2')
    expect(btn.className).toContain('border-memphis')
    expect(btn.className).toContain('shadow-memphis')
    expect(btn.className).toContain('rounded-none')
  })

  it('renders ghost variant', () => {
    const { getByRole } = render(<Button variant="ghost">Click</Button>)
    const btn = getByRole('button')
    expect(btn.className).toContain('bg-card')
    expect(btn.className).toContain('text-card-foreground')
    expect(btn.className).toContain('border-memphis')
  })

  it('renders outline variant', () => {
    const { getByRole } = render(<Button variant="outline">Click</Button>)
    const btn = getByRole('button')
    expect(btn.className).toContain('bg-card')
    expect(btn.className).toContain('border-memphis')
  })

  it('renders link variant', () => {
    const { getByRole } = render(<Button variant="link">Click</Button>)
    const btn = getByRole('button')
    expect(btn.className).toContain('bg-transparent')
    expect(btn.className).toContain('text-primary')
    expect(btn.className).toContain('underline')
  })

  it('defaults to primary variant', () => {
    const { getByRole } = render(<Button>Click</Button>)
    const btn = getByRole('button')
    expect(btn.className).toContain('bg-primary')
  })

  it('defaults to md size', () => {
    const { getByRole } = render(<Button>Click</Button>)
    const btn = getByRole('button')
    expect(btn.className).toContain('px-5')
    expect(btn.className).toContain('py-2.5')
    expect(btn.className).toContain('text-base')
  })

  it('renders sm size', () => {
    const { getByRole } = render(<Button size="sm">Click</Button>)
    const btn = getByRole('button')
    expect(btn.className).toContain('px-3')
    expect(btn.className).toContain('py-1.5')
    expect(btn.className).toContain('text-sm')
  })

  it('renders lg size', () => {
    const { getByRole } = render(<Button size="lg">Click</Button>)
    const btn = getByRole('button')
    expect(btn.className).toContain('px-7')
    expect(btn.className).toContain('py-3.5')
    expect(btn.className).toContain('text-lg')
  })

  it('renders icon size', () => {
    const { getByRole } = render(
      <Button size="icon" aria-label="icon">
        X
      </Button>,
    )
    const btn = getByRole('button')
    expect(btn.className).toContain('h-10')
    expect(btn.className).toContain('w-10')
  })

  it('renders fullWidth', () => {
    const { getByRole } = render(<Button fullWidth>Click</Button>)
    const btn = getByRole('button')
    expect(btn.className).toContain('w-full')
  })

  it('forwards children', () => {
    const { getByRole } = render(<Button>Hello World</Button>)
    expect(getByRole('button').textContent).toBe('Hello World')
  })

  it('forwards className', () => {
    const { getByRole } = render(<Button className="custom-class">Click</Button>)
    expect(getByRole('button').className).toContain('custom-class')
  })

  it('is disabled when disabled prop is set', () => {
    const { getByRole } = render(<Button disabled>Click</Button>)
    expect(getByRole('button')).toBeDisabled()
  })

  it('renders secondary variant (renamed from accent)', () => {
    const { getByRole } = render(<Button variant="secondary">Click</Button>)
    const btn = getByRole('button')
    expect(btn.className).toContain('bg-secondary')
    expect(btn.className).toContain('text-secondary-foreground')
  })

  it('renders destructive variant (renamed from danger)', () => {
    const { getByRole } = render(<Button variant="destructive">Delete</Button>)
    const btn = getByRole('button')
    expect(btn.className).toContain('bg-destructive')
    expect(btn.className).toContain('text-destructive-foreground')
  })

  describe('data-[state=open] press affordance', () => {
    // Radix Popper triggers (DropdownMenu, Popover, etc.) set data-state="open"
    // on the trigger while the surface is visible. Mirroring the :active press
    // styles via data-[state=open] keeps the button visually engaged for the
    // full lifetime of the menu instead of snapping back when the browser
    // releases :active as focus moves into the portal.
    for (const variant of ['primary', 'secondary', 'ghost', 'destructive'] as const) {
      it(`mirrors the active press transform on data-[state=open] for ${variant}`, () => {
        const { getByRole } = render(<Button variant={variant}>Open menu</Button>)
        const btn = getByRole('button')
        expect(btn.className).toContain('data-[state=open]:translate-x-[3px]')
        expect(btn.className).toContain('data-[state=open]:translate-y-[3px]')
        expect(btn.className).toContain('data-[state=open]:shadow-memphis-active')
      })
    }

    it('does not apply the data-[state=open] press to the outline variant', () => {
      const { getByRole } = render(<Button variant="outline">Open menu</Button>)
      const btn = getByRole('button')
      // Outline has no :active press to mirror — keep parity by skipping it
      expect(btn.className).not.toContain('data-[state=open]:translate-x-[3px]')
    })

    it('does not apply the data-[state=open] press to the link variant', () => {
      const { getByRole } = render(<Button variant="link">Open menu</Button>)
      const btn = getByRole('button')
      expect(btn.className).not.toContain('data-[state=open]:translate-x-[3px]')
    })
  })

  describe('asChild', () => {
    it('renders the child element instead of a <button>', () => {
      const { getByRole, queryByRole } = render(
        <Button asChild>
          <a href="/docs">Browse</a>
        </Button>,
      )
      expect(getByRole('link')).toBeTruthy()
      expect(queryByRole('button')).toBeNull()
    })

    it('applies the primary variant classes to the child <a>', () => {
      const { getByRole } = render(
        <Button asChild variant="primary">
          <a href="/docs">Browse</a>
        </Button>,
      )
      const link = getByRole('link')
      expect(link.className).toContain('bg-primary')
      expect(link.className).toContain('text-primary-foreground')
      expect(link.className).toContain('border-2')
      expect(link.className).toContain('border-memphis')
      expect(link.className).toContain('shadow-memphis')
    })

    it('applies hover animation classes to the child', () => {
      const { getByRole } = render(
        <Button asChild>
          <a href="/docs">Browse</a>
        </Button>,
      )
      const link = getByRole('link')
      expect(link.className).toContain('hover:-translate-x-px')
      expect(link.className).toContain('hover:-translate-y-px')
      expect(link.className).toContain('hover:shadow-memphis-hover')
    })

    it('applies the Memphis active press classes to the child', () => {
      const { getByRole } = render(
        <Button asChild>
          <a href="/docs">Browse</a>
        </Button>,
      )
      const link = getByRole('link')
      expect(link.className).toContain('active:translate-x-[3px]')
      expect(link.className).toContain('active:translate-y-[3px]')
      expect(link.className).toContain('active:shadow-memphis-active')
    })

    it('merges consumer className with variant classes on the child', () => {
      const { getByRole } = render(
        <Button asChild className="custom-cta">
          <a href="/docs">Browse</a>
        </Button>,
      )
      const link = getByRole('link')
      expect(link.className).toContain('bg-primary')
      expect(link.className).toContain('custom-cta')
    })

    it('forwards ref to the rendered child element', () => {
      const ref = createRef<HTMLAnchorElement>()
      render(
        <Button asChild ref={ref as unknown as React.Ref<HTMLButtonElement>}>
          <a href="/docs">Browse</a>
        </Button>,
      )
      expect(ref.current).not.toBeNull()
      expect(ref.current!.tagName.toLowerCase()).toBe('a')
    })

    it("preserves the child's own attributes", () => {
      const { getByRole } = render(
        <Button asChild>
          <a href="/x" data-testid="cta">
            Browse
          </a>
        </Button>,
      )
      const link = getByRole('link')
      expect(link.getAttribute('href')).toBe('/x')
      expect(link.getAttribute('data-testid')).toBe('cta')
    })

    it('applies size=lg padding/text classes to the child', () => {
      const { getByRole } = render(
        <Button asChild size="lg">
          <a href="/docs">Browse</a>
        </Button>,
      )
      const link = getByRole('link')
      expect(link.className).toContain('px-7')
      expect(link.className).toContain('py-3.5')
      expect(link.className).toContain('text-lg')
    })

    it('does not propagate type="button" to the child', () => {
      const { getByRole } = render(
        <Button asChild>
          <a href="/docs">Browse</a>
        </Button>,
      )
      const link = getByRole('link')
      expect(link.hasAttribute('type')).toBe(false)
    })

    it('default asChild=false still renders a <button>', () => {
      const { getByRole, queryByRole } = render(<Button>Click</Button>)
      expect(getByRole('button')).toBeTruthy()
      expect(queryByRole('link')).toBeNull()
    })
  })
})
