import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ShowcaseCard } from './showcase-card'

describe('ShowcaseCard', () => {
  it('renders the children', () => {
    render(
      <ShowcaseCard>
        <p>Inner content</p>
      </ShowcaseCard>,
    )
    expect(screen.getByText('Inner content')).toBeInTheDocument()
  })

  it('renders the label when provided', () => {
    render(
      <ShowcaseCard label="PRIMARY">
        <p>x</p>
      </ShowcaseCard>,
    )
    expect(screen.getByText('PRIMARY')).toBeInTheDocument()
  })

  it('does not render a label element when label prop is not set', () => {
    const { container } = render(
      <ShowcaseCard>
        <p>only children</p>
      </ShowcaseCard>,
    )
    const root = container.firstChild as HTMLElement
    // Only one child — the paragraph — when no label
    expect(root.children.length).toBe(1)
    expect(root.children[0]!.tagName.toLowerCase()).toBe('p')
  })

  it('renders label with mono + uppercase + accent typography', () => {
    render(
      <ShowcaseCard label="LABEL">
        <p>x</p>
      </ShowcaseCard>,
    )
    const label = screen.getByText('LABEL')
    expect(label.className).toContain('font-mono')
    expect(label.className).toContain('uppercase')
    expect(label.className).toContain('text-primary')
  })

  it('applies white surface bg, 2px border-memphis, 4px black shadow via inline style', () => {
    const { container } = render(
      <ShowcaseCard>
        <p>x</p>
      </ShowcaseCard>,
    )
    const root = container.firstChild as HTMLElement
    const styleAttr = root.getAttribute('style') ?? ''
    expect(styleAttr).toContain('--card')
    expect(styleAttr).toContain('--memphis-border-color')
    expect(styleAttr).toContain('4px 4px 0')
  })

  it('applies p-7 (28px) padding class on the root', () => {
    const { container } = render(
      <ShowcaseCard>
        <p>x</p>
      </ShowcaseCard>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('p-7')
  })

  it('forwards className to the root element', () => {
    const { container } = render(
      <ShowcaseCard className="custom-card">
        <p>x</p>
      </ShowcaseCard>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-card')
  })

  it('merges custom style onto the root element', () => {
    const { container } = render(
      <ShowcaseCard style={{ marginTop: 42 }}>
        <p>x</p>
      </ShowcaseCard>,
    )
    const root = container.firstChild as HTMLElement
    const styleAttr = root.getAttribute('style') ?? ''
    expect(styleAttr).toContain('margin-top: 42px')
  })
})
