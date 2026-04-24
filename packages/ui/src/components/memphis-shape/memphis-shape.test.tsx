import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemphisShape, type MemphisShapeVariant } from './memphis-shape'

const ALL_VARIANTS: MemphisShapeVariant[] = [
  'diamond',
  'circle',
  'triangle',
  'zigzag',
  'blob',
  'wave',
  'star',
  'lbar',
]

const FILLED_VARIANTS: MemphisShapeVariant[] = ['diamond', 'circle', 'triangle', 'blob', 'star', 'lbar']
const STROKE_ONLY_VARIANTS: MemphisShapeVariant[] = ['zigzag', 'wave']

describe('MemphisShape', () => {
  it.each(ALL_VARIANTS)('renders an SVG for variant %s', (variant) => {
    const { container } = render(<MemphisShape variant={variant} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  it('uses viewBox 0 0 100 100 for all variants', () => {
    for (const variant of ALL_VARIANTS) {
      const { container } = render(<MemphisShape variant={variant} />)
      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('viewBox')).toBe('0 0 100 100')
    }
  })

  it('applies default size of 64 to width and height', () => {
    const { container } = render(<MemphisShape variant="circle" />)
    const svg = container.querySelector('svg') as SVGElement
    expect(svg.getAttribute('width')).toBe('64')
    expect(svg.getAttribute('height')).toBe('64')
  })

  it('applies custom size to width and height', () => {
    const { container } = render(<MemphisShape variant="circle" size={128} />)
    const svg = container.querySelector('svg') as SVGElement
    expect(svg.getAttribute('width')).toBe('128')
    expect(svg.getAttribute('height')).toBe('128')
  })

  it('uses default color var(--secondary)', () => {
    const { container } = render(<MemphisShape variant="circle" />)
    const filled = container.querySelector('[fill]') as SVGElement
    expect(filled.getAttribute('fill')).toBe('var(--secondary)')
  })

  it.each(FILLED_VARIANTS)('applies color as fill on filled variant %s', (variant) => {
    const { container } = render(<MemphisShape variant={variant} color="red" />)
    const filled = container.querySelector('[fill="red"]')
    expect(filled).toBeTruthy()
  })

  it.each(STROKE_ONLY_VARIANTS)('applies color as stroke on stroke-only variant %s', (variant) => {
    const { container } = render(<MemphisShape variant={variant} color="blue" />)
    const stroked = container.querySelector('[stroke="blue"]')
    expect(stroked).toBeTruthy()
    // stroke-only variants: the stroked element should have fill="none"
    expect(stroked?.getAttribute('fill')).toBe('none')
  })

  it('forwards className to the svg', () => {
    const { container } = render(<MemphisShape variant="circle" className="my-shape" />)
    const svg = container.querySelector('svg') as SVGElement
    expect(svg.getAttribute('class')).toContain('my-shape')
  })

  it('renders circle variant with cx=50 cy=50 r=44', () => {
    const { container } = render(<MemphisShape variant="circle" />)
    const circle = container.querySelector('circle')
    expect(circle?.getAttribute('cx')).toBe('50')
    expect(circle?.getAttribute('cy')).toBe('50')
    expect(circle?.getAttribute('r')).toBe('44')
  })

  it('renders triangle variant with polygon points', () => {
    const { container } = render(<MemphisShape variant="triangle" />)
    const polygon = container.querySelector('polygon')
    expect(polygon?.getAttribute('points')).toBe('50,10 90,90 10,90')
  })

  it('renders diamond variant with polygon', () => {
    const { container } = render(<MemphisShape variant="diamond" />)
    const polygon = container.querySelector('polygon')
    expect(polygon).toBeTruthy()
  })

  it('renders star variant with polygon (5 points = 10 vertices)', () => {
    const { container } = render(<MemphisShape variant="star" />)
    const polygon = container.querySelector('polygon')
    expect(polygon).toBeTruthy()
    const points = polygon?.getAttribute('points') ?? ''
    // 10 coordinate pairs for a 5-pointed star
    const pairs = points.trim().split(/\s+/)
    expect(pairs.length).toBe(10)
  })

  it('renders wave variant with path and fill=none', () => {
    const { container } = render(<MemphisShape variant="wave" />)
    const path = container.querySelector('path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('fill')).toBe('none')
  })

  it('renders zigzag variant with polyline/path and fill=none', () => {
    const { container } = render(<MemphisShape variant="zigzag" />)
    const el = container.querySelector('polyline, path')
    expect(el).toBeTruthy()
    expect(el?.getAttribute('fill')).toBe('none')
  })

  it('renders blob variant with path', () => {
    const { container } = render(<MemphisShape variant="blob" />)
    const path = container.querySelector('path')
    expect(path).toBeTruthy()
  })

  it('renders lbar variant with path or multiple rects', () => {
    const { container } = render(<MemphisShape variant="lbar" />)
    const el = container.querySelector('path, rect')
    expect(el).toBeTruthy()
  })
})
