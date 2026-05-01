import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TokenSwatch } from './token-swatch'

describe('TokenSwatch', () => {
  it('renders the name', () => {
    render(<TokenSwatch name="Background" cssVar="--bg" usage="Sfondo principale dell'app" />)
    expect(screen.getByText('Background')).toBeInTheDocument()
  })

  it('renders the cssVar label', () => {
    render(<TokenSwatch name="Background" cssVar="--bg" usage="x" />)
    expect(screen.getByText('--bg')).toBeInTheDocument()
  })

  it('renders the usage caption', () => {
    render(<TokenSwatch name="Background" cssVar="--bg" usage="Sfondo principale dell'app" />)
    expect(screen.getByText("Sfondo principale dell'app")).toBeInTheDocument()
  })

  it('uses the correct CSS var as inline background on the swatch tile', () => {
    const { container } = render(<TokenSwatch name="Accent" cssVar="--accent" usage="brand" />)
    const tile = container.querySelector('[data-token-swatch-tile]') as HTMLElement
    expect(tile).toBeTruthy()
    const style = tile.getAttribute('style') ?? ''
    expect(style).toContain('var(--accent)')
  })

  it('forwards className to the root element', () => {
    const { container } = render(
      <TokenSwatch name="Background" cssVar="--bg" usage="x" className="custom-token" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-token')
  })
})
