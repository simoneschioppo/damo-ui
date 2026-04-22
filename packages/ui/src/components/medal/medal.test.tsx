import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Medal, type MedalRank } from './medal'

const RANKS: ReadonlyArray<MedalRank> = [
  'bronze',
  'silver',
  'gold',
  'master',
  'grandmaster',
]

describe('Medal', () => {
  it('renders an SVG for each rank with the outer polygon using the rank token', () => {
    for (const rank of RANKS) {
      const { container, unmount } = render(<Medal rank={rank} />)
      const svg = container.querySelector('svg')
      expect(svg, `rank ${rank} should render an svg`).not.toBeNull()
      const polygons = svg!.querySelectorAll('polygon')
      expect(polygons.length, `rank ${rank} should have two polygons`).toBe(2)
      const outerFill = polygons[0]!.getAttribute('fill')
      expect(
        outerFill,
        `rank ${rank} outer polygon fill should reference --medal-${rank}-outer`,
      ).toBe(`var(--medal-${rank}-outer)`)
      unmount()
    }
  })

  it('uses the inner polygon fill from the rank token', () => {
    for (const rank of RANKS) {
      const { container, unmount } = render(<Medal rank={rank} />)
      const polygons = container.querySelectorAll('polygon')
      const innerFill = polygons[1]!.getAttribute('fill')
      expect(innerFill, `rank ${rank} inner polygon fill`).toBe(`var(--medal-${rank}-inner)`)
      unmount()
    }
  })

  it('applies a thin memphis border stroke only on the outer polygon', () => {
    const { container } = render(<Medal rank="gold" />)
    const polygons = container.querySelectorAll('polygon')
    expect(polygons[0]!.getAttribute('stroke')).toBe('var(--border-memphis)')
    expect(polygons[0]!.getAttribute('stroke-width')).toBe('0.5')
    expect(polygons[1]!.getAttribute('stroke')).toBeNull()
  })

  it('renders the label as a text node below the medal when provided', () => {
    const { getByText } = render(<Medal rank="gold" label="ORO" />)
    expect(getByText('ORO')).toBeTruthy()
  })

  it('does not render a label element when label prop is not set', () => {
    const { container } = render(<Medal rank="bronze" />)
    // Wrapper > svg only; no text node sibling with label text
    const root = container.firstChild as HTMLElement
    expect(root.children.length).toBe(1)
    expect(root.children[0]!.tagName.toLowerCase()).toBe('svg')
  })

  it('renders numeric value inside the svg when provided', () => {
    const { container } = render(<Medal rank="master" value={7} />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    const text = svg!.querySelector('text')
    expect(text).not.toBeNull()
    expect(text!.textContent).toBe('7')
    expect(text!.getAttribute('fill')).toBe('var(--medal-master-text)')
  })

  it('renders a letter value inside the svg (e.g. "M")', () => {
    const { container } = render(<Medal rank="master" value="M" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    const text = svg!.querySelector('text')
    expect(text).not.toBeNull()
    expect(text!.textContent).toBe('M')
  })

  it('renders a multi-letter value (e.g. "GM")', () => {
    const { container } = render(<Medal rank="grandmaster" value="GM" />)
    const text = container.querySelector('svg text')
    expect(text).not.toBeNull()
    expect(text!.textContent).toBe('GM')
  })

  it('does not render a text element inside the svg without value', () => {
    const { container } = render(<Medal rank="silver" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg!.querySelector('text')).toBeNull()
  })

  it('accepts and forwards className to the wrapper', () => {
    const { container } = render(<Medal rank="bronze" className="custom-extra" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-extra')
    // base wrapper layout classes still present
    expect(root.className).toContain('inline-flex')
    expect(root.className).toContain('flex-col')
  })

  it('defaults size to 96px', () => {
    const { container } = render(<Medal rank="gold" />)
    const svg = container.querySelector('svg') as SVGSVGElement
    expect(svg.getAttribute('width')).toBe('96')
    expect(svg.getAttribute('height')).toBe('96')
  })

  it('honors a custom size prop', () => {
    const { container } = render(<Medal rank="grandmaster" size={64} />)
    const svg = container.querySelector('svg') as SVGSVGElement
    expect(svg.getAttribute('width')).toBe('64')
    expect(svg.getAttribute('height')).toBe('64')
  })
})
