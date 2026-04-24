import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Chip } from './chip'

describe('Chip', () => {
  it('renders without dot by default', () => {
    const { container } = render(<Chip>Tag</Chip>)
    const root = container.firstChild as HTMLElement
    expect(root).toBeTruthy()
    // No preceding <span> before the text node
    const innerSpans = root.querySelectorAll('span')
    expect(innerSpans.length).toBe(0)
    expect(root.textContent).toBe('Tag')
  })

  it('renders a dot when dotColor is set', () => {
    const { container } = render(<Chip dotColor="var(--gold-500)">Tag</Chip>)
    const root = container.firstChild as HTMLElement
    const dot = root.querySelector('span[data-chip-dot]') as HTMLElement | null
    expect(dot).not.toBeNull()
    // Inline style should set background to the passed color
    expect(dot!.style.background).toContain('var(--gold-500)')
  })

  it('accepts hex color values for dotColor', () => {
    const { container } = render(<Chip dotColor="#fff">Tag</Chip>)
    const dot = container.querySelector('span[data-chip-dot]') as HTMLElement
    expect(dot).toBeTruthy()
    // jsdom normalises "#fff" → "rgb(255, 255, 255)"
    expect(dot.style.background).toMatch(/#fff|rgb\(255,\s*255,\s*255\)/i)
  })

  it('applies active styling when active', () => {
    const { container } = render(<Chip active>Rapid</Chip>)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('bg-gold-500')
    expect(root.className).toContain('text-white')
  })

  it('does not apply active styling by default', () => {
    const { container } = render(<Chip>Rapid</Chip>)
    const root = container.firstChild as HTMLElement
    expect(root.className).not.toContain('bg-gold-500')
  })

  it('uses memphis border color for dot when inactive', () => {
    const { container } = render(<Chip dotColor="var(--plum-500)">Primary</Chip>)
    const dot = container.querySelector('span[data-chip-dot]') as HTMLElement
    expect(dot.style.borderColor).toContain('var(--border-memphis)')
  })

  it('flips dot border to white when both active and dotColor set', () => {
    const { container } = render(
      <Chip active dotColor="#fff">
        Rapid
      </Chip>,
    )
    const dot = container.querySelector('span[data-chip-dot]') as HTMLElement
    expect(dot).toBeTruthy()
    // jsdom normalises "white" → "rgb(255, 255, 255)"
    expect(dot.style.borderColor).toMatch(/^(white|rgb\(255,\s*255,\s*255\)|#fff)$/i)
  })

  it('forwards children', () => {
    const { container } = render(<Chip>hello world</Chip>)
    expect(container.firstChild?.textContent).toBe('hello world')
  })

  it('forwards className', () => {
    const { container } = render(<Chip className="custom-extra">x</Chip>)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-extra')
  })

  it('forwards children alongside the dot', () => {
    const { container } = render(<Chip dotColor="var(--success)">Component</Chip>)
    const root = container.firstChild as HTMLElement
    expect(root.textContent).toBe('Component')
    expect(root.querySelector('span[data-chip-dot]')).toBeTruthy()
  })
})
