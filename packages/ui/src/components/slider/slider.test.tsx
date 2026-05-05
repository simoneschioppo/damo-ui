import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Slider } from './slider'

describe('Slider', () => {
  it('renders a single thumb when defaultValue has one entry', () => {
    const { container } = render(<Slider defaultValue={[40]} max={100} />)
    const thumbs = container.querySelectorAll('[role="slider"]')
    expect(thumbs).toHaveLength(1)
  })

  it('declares rounded-none on track and thumb so --radius-none themes them', () => {
    const { container } = render(<Slider defaultValue={[40]} max={100} />)
    // Track is the only role-less child of the root with bg-card
    const track = container.querySelector('.bg-card') as HTMLElement
    expect(track).not.toBeNull()
    expect(track.className).toContain('rounded-none')
    const thumb = container.querySelector('[role="slider"]') as HTMLElement
    expect(thumb).not.toBeNull()
    expect(thumb.className).toContain('rounded-none')
  })

  it('renders two thumbs for a range slider with two values', () => {
    const { container } = render(<Slider defaultValue={[20, 80]} max={100} />)
    const thumbs = container.querySelectorAll('[role="slider"]')
    expect(thumbs).toHaveLength(2)
  })

  it('renders three thumbs for a triple-range slider', () => {
    const { container } = render(<Slider defaultValue={[10, 50, 90]} max={100} />)
    const thumbs = container.querySelectorAll('[role="slider"]')
    expect(thumbs).toHaveLength(3)
  })

  it('honors a controlled `value` for thumb count', () => {
    const { container } = render(<Slider value={[5, 25, 75]} max={100} />)
    const thumbs = container.querySelectorAll('[role="slider"]')
    expect(thumbs).toHaveLength(3)
  })

  it('falls back to a single thumb when neither value nor defaultValue is provided', () => {
    const { container } = render(<Slider max={100} />)
    const thumbs = container.querySelectorAll('[role="slider"]')
    expect(thumbs).toHaveLength(1)
  })

  it('applies horizontal orientation by default', () => {
    const { container } = render(<Slider defaultValue={[40]} max={100} />)
    const root = container.firstChild as HTMLElement
    expect(root.getAttribute('data-orientation')).toBe('horizontal')
  })

  it('applies vertical orientation when requested', () => {
    const { container } = render(
      <Slider defaultValue={[40]} max={100} orientation="vertical" className="h-32" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.getAttribute('data-orientation')).toBe('vertical')
  })

  it('the vertical Root class list does not force `w-full`', () => {
    // Forcing horizontal width on the Root collapses the vertical track.
    // The component must keep w-full conditional on horizontal orientation.
    const { container } = render(
      <Slider defaultValue={[40]} max={100} orientation="vertical" className="h-32" />,
    )
    const root = container.firstChild as HTMLElement
    // Sanity: the className string must not unconditionally include `w-full`.
    expect(root.className).not.toContain(' w-full ')
    expect(root.className.startsWith('w-full ')).toBe(false)
    expect(root.className.endsWith(' w-full')).toBe(false)
  })

  it('forwards ref to the Slider Root element', () => {
    const ref = createRef<HTMLSpanElement>()
    const { container } = render(<Slider ref={ref} defaultValue={[40]} max={100} />)
    expect(ref.current).not.toBeNull()
    // Radix renders the Root as the first child of the wrapper.
    expect(ref.current).toBe(container.firstChild)
  })

  it('forwards className onto the Root', () => {
    const { container } = render(<Slider defaultValue={[40]} max={100} className="custom-extra" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-extra')
  })

  it('marks every thumb as data-disabled when disabled is set', () => {
    const { container } = render(<Slider defaultValue={[20, 80]} max={100} disabled />)
    const thumbs = container.querySelectorAll('[role="slider"]')
    expect(thumbs.length).toBe(2)
    for (const thumb of thumbs) {
      // Radix surfaces the disabled state via `data-disabled` on each thumb;
      // it does not set `aria-disabled`. Asserting the data attr is the
      // correct contract.
      expect(thumb.hasAttribute('data-disabled')).toBe(true)
    }
  })
})
