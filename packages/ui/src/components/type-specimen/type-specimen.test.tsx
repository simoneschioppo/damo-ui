import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TypeSpecimen } from './type-specimen'

describe('TypeSpecimen', () => {
  it('renders the name as a mono eyebrow', () => {
    render(
      <TypeSpecimen name="Display / Audiowide" sample="Damo UI" fontFamily="var(--font-display)" />,
    )
    expect(screen.getByText('Display / Audiowide')).toBeInTheDocument()
  })

  it('renders the sample text', () => {
    render(
      <TypeSpecimen
        name="Display / Audiowide"
        sample="Damo UI · token e componenti"
        fontFamily="var(--font-display)"
      />,
    )
    expect(screen.getByText('Damo UI · token e componenti')).toBeInTheDocument()
  })

  it('applies the target fontFamily inline on the sample element', () => {
    render(
      <TypeSpecimen name="Display / Audiowide" sample="Damo UI" fontFamily="var(--font-display)" />,
    )
    const sample = screen.getByText('Damo UI')
    const styleAttr = sample.getAttribute('style') ?? ''
    expect(styleAttr).toContain('font-family')
    expect(styleAttr).toContain('--font-display')
  })

  it('defaults sampleSize to 28px when not specified', () => {
    render(<TypeSpecimen name="Body / Exo 2" sample="Hello" fontFamily="var(--font-body)" />)
    const sample = screen.getByText('Hello')
    const styleAttr = sample.getAttribute('style') ?? ''
    expect(styleAttr).toContain('font-size: 28px')
  })

  it('honors a custom sampleSize', () => {
    render(
      <TypeSpecimen name="Display" sample="Big" fontFamily="var(--font-display)" sampleSize={72} />,
    )
    const sample = screen.getByText('Big')
    const styleAttr = sample.getAttribute('style') ?? ''
    expect(styleAttr).toContain('font-size: 72px')
  })

  it('renders scale rows when a scale array is provided', () => {
    render(
      <TypeSpecimen
        name="Display"
        sample="Big"
        fontFamily="var(--font-display)"
        scale={[
          { label: 'Display XL', size: 68 },
          { label: 'Display L', size: 48 },
        ]}
      />,
    )
    expect(screen.getByText('Display XL')).toBeInTheDocument()
    expect(screen.getByText('Display L')).toBeInTheDocument()
    expect(screen.getByText(/68/)).toBeInTheDocument()
    expect(screen.getByText(/48/)).toBeInTheDocument()
  })

  it('does not render the scale table when scale is omitted', () => {
    const { container } = render(
      <TypeSpecimen name="Display" sample="Big" fontFamily="var(--font-display)" />,
    )
    // No row labels present
    expect(container.textContent).not.toMatch(/Display XL/)
  })

  it('renders weight alongside size when weight is provided', () => {
    render(
      <TypeSpecimen
        name="Display"
        sample="Big"
        fontFamily="var(--font-display)"
        scale={[{ label: 'Display XL', size: 68, weight: 400 }]}
      />,
    )
    expect(screen.getByText(/400/)).toBeInTheDocument()
  })

  it('applies Memphis card frame (2px border + 6px shadow) via inline style', () => {
    const { container } = render(
      <TypeSpecimen name="Display" sample="Big" fontFamily="var(--font-display)" />,
    )
    const root = container.firstChild as HTMLElement
    const styleAttr = root.getAttribute('style') ?? ''
    expect(styleAttr).toContain('--memphis-border-color')
    expect(styleAttr).toContain('6px 6px 0')
  })

  it('forwards className to the root element', () => {
    const { container } = render(
      <TypeSpecimen
        name="Display"
        sample="Big"
        fontFamily="var(--font-display)"
        className="custom-specimen"
      />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-specimen')
  })
})
