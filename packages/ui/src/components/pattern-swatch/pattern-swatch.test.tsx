import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PatternSwatch } from './pattern-swatch'

describe('PatternSwatch', () => {
  it('renders the name in the header', () => {
    render(<PatternSwatch name="STRIPES 45°" />)
    expect(screen.getByText('STRIPES 45°')).toBeInTheDocument()
  })

  it('applies eyebrow typography classes to header', () => {
    render(<PatternSwatch name="DOTS" />)
    const header = screen.getByText('DOTS')
    expect(header.className).toContain('font-mono')
    expect(header.className).toContain('uppercase')
    expect(header.className).toContain('font-bold')
    expect(header.className).toContain('text-primary')
  })

  it('applies Memphis border styling to the root', () => {
    const { container } = render(<PatternSwatch name="GRID" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('border-2')
    expect(root.className).toContain('border-memphis')
    expect(root.className).toContain('inline-flex')
    expect(root.className).toContain('flex-col')
  })

  it('applies header border-bottom to separate from tile', () => {
    render(<PatternSwatch name="X" />)
    const header = screen.getByText('X')
    expect(header.className).toContain('border-b-2')
    expect(header.className).toContain('border-memphis')
    expect(header.className).toContain('px-3')
    expect(header.className).toContain('py-2')
  })

  it('renders a tile child with aspect-square and default bg', () => {
    const { container } = render(<PatternSwatch name="X" />)
    const root = container.firstChild as HTMLElement
    // second child is the tile (after header)
    const tile = root.children[1] as HTMLElement
    expect(tile).toBeTruthy()
    expect(tile.className).toContain('aspect-square')
    expect(tile.className).toContain('bg-background')
  })

  it('forwards background prop to tile inline style', () => {
    const { container } = render(
      <PatternSwatch
        name="STRIPES"
        background="repeating-linear-gradient(45deg, red 0 6px, transparent 6px 14px)"
      />,
    )
    const root = container.firstChild as HTMLElement
    const tile = root.children[1] as HTMLElement
    const styleAttr = tile.getAttribute('style') ?? ''
    expect(styleAttr).toContain('repeating-linear-gradient')
  })

  it('forwards backgroundSize prop to tile inline style', () => {
    const { container } = render(
      <PatternSwatch
        name="DOTS"
        background="radial-gradient(#000 2px, transparent 2px)"
        backgroundSize="14px 14px"
      />,
    )
    const root = container.firstChild as HTMLElement
    const tile = root.children[1] as HTMLElement
    const styleAttr = tile.getAttribute('style') ?? ''
    expect(styleAttr).toContain('14px 14px')
  })

  it('forwards backgroundColor prop to tile inline style', () => {
    const { container } = render(<PatternSwatch name="X" backgroundColor="rgb(255, 0, 0)" />)
    const root = container.firstChild as HTMLElement
    const tile = root.children[1] as HTMLElement
    const styleAttr = tile.getAttribute('style') ?? ''
    expect(styleAttr).toContain('rgb(255, 0, 0)')
  })

  it('renders children inside the tile as overlay', () => {
    const { container } = render(
      <PatternSwatch name="WAVES">
        <svg data-testid="overlay-svg" width="100%" height="100%" />
      </PatternSwatch>,
    )
    const overlay = screen.getByTestId('overlay-svg')
    expect(overlay).toBeInTheDocument()
    // overlay should be inside the tile, not the header
    const root = container.firstChild as HTMLElement
    const tile = root.children[1] as HTMLElement
    expect(tile.contains(overlay)).toBe(true)
  })

  it('forwards className to the root element', () => {
    const { container } = render(<PatternSwatch name="X" className="custom-swatch" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-swatch')
  })

  it('renders without children when none are passed', () => {
    const { container } = render(<PatternSwatch name="PLAIN" />)
    const root = container.firstChild as HTMLElement
    const tile = root.children[1] as HTMLElement
    expect(tile.children.length).toBe(0)
  })
})
