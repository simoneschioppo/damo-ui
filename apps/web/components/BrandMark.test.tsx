import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrandMark } from './BrandMark'
import { BRAND } from '../lib/brand'

describe('BrandMark', () => {
  it('renders a link to the home page with the library name as accessible name', () => {
    render(<BrandMark />)
    const link = screen.getByRole('link', { name: new RegExp(`${BRAND.libName} home`, 'i') })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('renders the mascot image with empty alt — the link aria-label carries the name', () => {
    render(<BrandMark />)
    const img = document.querySelector('img[src="/mascot.png"]')
    expect(img).not.toBeNull()
    expect(img).toHaveAttribute('alt', '')
  })

  it('does not surface a textual wordmark — the mascot is the brand mark', () => {
    render(<BrandMark />)
    const link = screen.getByRole('link')
    // Anything other than the <img> child would be a textual element.
    const textualChildren = Array.from(link.children).filter((c) => c.tagName !== 'IMG')
    expect(textualChildren).toHaveLength(0)
  })

  it('uses the mascot dimensions from BRAND for layout stability', () => {
    render(<BrandMark />)
    const img = document.querySelector('img[src="/mascot.png"]') as HTMLImageElement | null
    expect(img).not.toBeNull()
    const ratio = Number(img!.getAttribute('width')) / Number(img!.getAttribute('height'))
    const expected = BRAND.mascotWidth / BRAND.mascotHeight
    expect(Math.abs(ratio - expected)).toBeLessThan(0.05)
  })

  it('renders the mascot at a height that reads well inside a 56px navbar', () => {
    render(<BrandMark />)
    const img = document.querySelector('img[src="/mascot.png"]') as HTMLImageElement | null
    expect(img).not.toBeNull()
    const heightPx = Number(img!.getAttribute('height'))
    expect(heightPx).toBeGreaterThanOrEqual(36)
    expect(heightPx).toBeLessThanOrEqual(48)
  })

  it('vertically centers its child via inline-flex + items-center', () => {
    render(<BrandMark />)
    const link = screen.getByRole('link')
    expect(link.className).toMatch(/\binline-flex\b/)
    expect(link.className).toMatch(/\bitems-center\b/)
  })
})
