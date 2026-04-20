import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hint } from './hint'

describe('Hint', () => {
  it('renders the number inside the icon block', () => {
    const { container } = render(
      <Hint num={3} title="Setup">
        Body text
      </Hint>,
    )
    // First child of root is the icon block containing the number
    const root = container.firstChild as HTMLElement
    const icon = root.firstChild as HTMLElement
    expect(icon).toBeTruthy()
    expect(icon.textContent).toBe('3')
  })

  it('renders the title', () => {
    render(
      <Hint num={1} title="Install the plugin">
        body
      </Hint>,
    )
    expect(screen.getByText('Install the plugin')).toBeInTheDocument()
  })

  it('renders the body children', () => {
    render(
      <Hint num={1} title="t">
        <span>Look at this hint content</span>
      </Hint>,
    )
    expect(screen.getByText('Look at this hint content')).toBeInTheDocument()
  })

  it('renders title as an h4 heading', () => {
    render(
      <Hint num={1} title="Heading text">
        body
      </Hint>,
    )
    const heading = screen.getByRole('heading', { level: 4, name: 'Heading text' })
    expect(heading).toBeInTheDocument()
  })

  it('forwards className to the root element', () => {
    const { container } = render(
      <Hint num={1} title="t" className="custom-class">
        body
      </Hint>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-class')
  })

  it('applies default spacing + Memphis frame classes on the root', () => {
    const { container } = render(
      <Hint num={1} title="t">
        body
      </Hint>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('flex')
    expect(root.className).toContain('gap-4')
    expect(root.className).toContain('p-5')
    expect(root.className).toContain('items-start')
    expect(root.className).toContain('mb-6')
    expect(root.className).toContain('border-2')
    expect(root.className).toContain('border-border-memphis')
  })

  it('applies icon block styling (size, bg, border, typography)', () => {
    const { container } = render(
      <Hint num={7} title="t">
        body
      </Hint>,
    )
    const root = container.firstChild as HTMLElement
    const icon = root.firstChild as HTMLElement
    expect(icon.className).toContain('w-10')
    expect(icon.className).toContain('h-10')
    expect(icon.className).toContain('border-2')
    expect(icon.className).toContain('border-border-memphis')
    expect(icon.className).toContain('bg-plum-500')
    expect(icon.className).toContain('text-paper-50')
    expect(icon.className).toContain('font-display')
    expect(icon.className).toContain('text-lg')
  })

  it('applies title typography classes', () => {
    render(
      <Hint num={1} title="Title text">
        body
      </Hint>,
    )
    const heading = screen.getByRole('heading', { level: 4, name: 'Title text' })
    expect(heading.className).toContain('font-display')
    expect(heading.className).toContain('text-base')
    expect(heading.className).toContain('mb-1')
    expect(heading.className).toContain('text-ink')
  })

  it('applies body typography classes', () => {
    render(
      <Hint num={1} title="t">
        Body paragraph content
      </Hint>,
    )
    const body = screen.getByText('Body paragraph content')
    expect(body.className).toContain('text-sm')
    expect(body.className).toContain('text-ink-soft')
    expect(body.className).toContain('leading-relaxed')
    expect(body.className).toContain('m-0')
  })

  it('sets color-mix background via inline style on the root', () => {
    const { container } = render(
      <Hint num={1} title="t">
        body
      </Hint>,
    )
    const root = container.firstChild as HTMLElement
    // jsdom exposes inline styles via the style attribute
    const styleAttr = root.getAttribute('style') ?? ''
    expect(styleAttr).toContain('color-mix')
    expect(styleAttr).toContain('--plum-500')
    expect(styleAttr).toContain('--surface')
  })

  it('sets 4px solid shadow using --shadow-memphis-color on the root', () => {
    const { container } = render(
      <Hint num={1} title="t">
        body
      </Hint>,
    )
    const root = container.firstChild as HTMLElement
    const styleAttr = root.getAttribute('style') ?? ''
    expect(styleAttr).toContain('4px 4px 0')
    expect(styleAttr).toContain('--shadow-memphis-color')
  })
})
