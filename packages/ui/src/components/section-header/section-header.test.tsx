import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionHeader } from './section-header'

describe('SectionHeader', () => {
  it('renders the num as a mono eyebrow', () => {
    render(<SectionHeader num="02" title="Tipografia" desc="Typography description" />)
    expect(screen.getByText('02')).toBeInTheDocument()
  })

  it('renders the title as an h2', () => {
    render(<SectionHeader num="02" title="Tipografia" desc="Typography description" />)
    const heading = screen.getByRole('heading', { level: 2, name: 'Tipografia' })
    expect(heading).toBeInTheDocument()
  })

  it('renders the desc', () => {
    render(
      <SectionHeader
        num="02"
        title="Tipografia"
        desc="Audiowide per display, Exo 2 per body."
      />,
    )
    expect(screen.getByText('Audiowide per display, Exo 2 per body.')).toBeInTheDocument()
  })

  it('renders the num with primary inline color', () => {
    render(<SectionHeader num="01" title="Colori" desc="Color palette" />)
    const numEl = screen.getByText('01')
    const styleAttr = numEl.getAttribute('style') ?? ''
    expect(styleAttr).toContain('--primary')
  })

  it('renders the title with 44px display font', () => {
    render(<SectionHeader num="01" title="Colori" desc="Color palette" />)
    const heading = screen.getByRole('heading', { level: 2, name: 'Colori' })
    expect(heading.className).toContain('font-display')
    expect(heading.className).toContain('text-[44px]')
  })

  it('renders the desc with ink-soft color', () => {
    render(<SectionHeader num="01" title="Colori" desc="Color palette" />)
    const desc = screen.getByText('Color palette')
    expect(desc.className).toContain('text-muted-foreground')
  })

  it('applies flex wrap layout on the root', () => {
    const { container } = render(
      <SectionHeader num="01" title="Colori" desc="Color palette" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('flex')
    expect(root.className).toContain('flex-wrap')
  })

  it('forwards className to the root element', () => {
    const { container } = render(
      <SectionHeader
        num="01"
        title="Colori"
        desc="Color palette"
        className="custom-header"
      />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-header')
  })
})
