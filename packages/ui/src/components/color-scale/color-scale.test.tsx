import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ColorScale } from './color-scale'

describe('ColorScale', () => {
  beforeEach(() => {
    document.documentElement.style.setProperty('--plum-500', '#6d2f6a')
    document.documentElement.style.setProperty('--plum-400', '#8a4a87')
    document.documentElement.style.setProperty('--plum-300', '#a364a0')
  })

  afterEach(() => {
    document.documentElement.style.removeProperty('--plum-500')
    document.documentElement.style.removeProperty('--plum-400')
    document.documentElement.style.removeProperty('--plum-300')
  })

  it('renders the scale name', () => {
    render(
      <ColorScale
        name="Plum"
        token="plum"
        stops={[{ k: 500 }]}
      />,
    )
    expect(screen.getByText('Plum')).toBeInTheDocument()
  })

  it('renders the token label prefixed with -- and * suffix', () => {
    render(
      <ColorScale name="Plum" token="plum" stops={[{ k: 500 }]} />,
    )
    expect(screen.getByText('--plum-*')).toBeInTheDocument()
  })

  it('renders the optional description', () => {
    render(
      <ColorScale
        name="Plum"
        token="plum"
        desc="Ink base for Damo UI"
        stops={[{ k: 500 }]}
      />,
    )
    expect(screen.getByText('Ink base for Damo UI')).toBeInTheDocument()
  })

  it('renders one stop per entry', () => {
    render(
      <ColorScale
        name="Plum"
        token="plum"
        stops={[{ k: 300 }, { k: 400 }, { k: 500 }]}
      />,
    )
    expect(screen.getByText('plum-300')).toBeInTheDocument()
    expect(screen.getByText('plum-400')).toBeInTheDocument()
    expect(screen.getByText('plum-500')).toBeInTheDocument()
  })

  it('uses the correct CSS var as inline background for each stop', () => {
    const { container } = render(
      <ColorScale
        name="Plum"
        token="plum"
        stops={[{ k: 300 }, { k: 500 }]}
      />,
    )
    const stopLabels = container.querySelectorAll('[data-color-scale-stop]')
    expect(stopLabels.length).toBe(2)
    const first = stopLabels[0] as HTMLElement
    const second = stopLabels[1] as HTMLElement
    expect(first.getAttribute('style') ?? '').toContain('var(--plum-300)')
    expect(second.getAttribute('style') ?? '').toContain('var(--plum-500)')
  })

  it('forwards className to the root element', () => {
    const { container } = render(
      <ColorScale
        name="Plum"
        token="plum"
        stops={[{ k: 500 }]}
        className="custom-scale"
      />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-scale')
  })

  it('uses grid layout with one column per stop', () => {
    const { container } = render(
      <ColorScale
        name="Plum"
        token="plum"
        stops={[{ k: 100 }, { k: 200 }, { k: 300 }, { k: 400 }]}
      />,
    )
    const grid = container.querySelector('[data-color-scale-grid]') as HTMLElement
    expect(grid).toBeTruthy()
    const style = grid.getAttribute('style') ?? ''
    expect(style).toContain('repeat(4')
  })
})
