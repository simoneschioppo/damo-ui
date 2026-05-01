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
})
