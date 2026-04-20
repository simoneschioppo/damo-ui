import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SubPanel } from './sub-panel'

describe('SubPanel', () => {
  it('renders the label', () => {
    render(
      <SubPanel label="SAMPLE">
        <p>content</p>
      </SubPanel>,
    )
    expect(screen.getByText('SAMPLE')).toBeInTheDocument()
  })

  it('renders the children', () => {
    render(
      <SubPanel label="SAMPLE">
        <p>Inner paragraph</p>
      </SubPanel>,
    )
    expect(screen.getByText('Inner paragraph')).toBeInTheDocument()
  })

  it('renders the label with monospace + uppercase + tracking classes', () => {
    render(
      <SubPanel label="LABEL">
        <p>x</p>
      </SubPanel>,
    )
    const label = screen.getByText('LABEL')
    expect(label.className).toContain('font-mono')
    expect(label.className).toContain('uppercase')
  })

  it('applies dashed 2px border and paper-50 bg to the root', () => {
    const { container } = render(
      <SubPanel label="x">
        <p>y</p>
      </SubPanel>,
    )
    const root = container.firstChild as HTMLElement
    const styleAttr = root.getAttribute('style') ?? ''
    expect(styleAttr).toContain('dashed')
    expect(styleAttr).toContain('--border-strong')
    expect(styleAttr).toContain('--paper-50')
  })

  it('applies p-4 padding on the root', () => {
    const { container } = render(
      <SubPanel label="x">
        <p>y</p>
      </SubPanel>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('p-4')
  })

  it('forwards className to the root element', () => {
    const { container } = render(
      <SubPanel label="x" className="custom-panel">
        <p>y</p>
      </SubPanel>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-panel')
  })
})
