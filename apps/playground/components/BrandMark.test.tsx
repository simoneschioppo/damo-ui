import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrandMark } from './BrandMark'
import { BRAND } from '../lib/brand'

describe('BrandMark', () => {
  it('renders a link to the home page with the site name as accessible name', () => {
    render(<BrandMark />)
    const link = screen.getByRole('link', { name: new RegExp(`${BRAND.name} home`, 'i') })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('renders the mascot image with empty alt when accompanied by visible wordmark', () => {
    render(<BrandMark />)
    const img = document.querySelector('img[src="/mascot.png"]')
    expect(img).not.toBeNull()
    expect(img).toHaveAttribute('alt', '')
  })

  it('shows the site name as a visible wordmark by default', () => {
    render(<BrandMark />)
    expect(screen.getByText(BRAND.name)).toBeInTheDocument()
  })

  it('hides the wordmark when compact prop is set, exposing it via aria-label only', () => {
    render(<BrandMark compact />)
    expect(screen.queryByText(BRAND.name)).toBeNull()
    const link = screen.getByRole('link')
    expect(link).toHaveAccessibleName(new RegExp(`${BRAND.name} home`, 'i'))
  })

  it('uses the mascot dimensions from BRAND for layout stability', () => {
    render(<BrandMark />)
    const img = document.querySelector('img[src="/mascot.png"]') as HTMLImageElement | null
    expect(img).not.toBeNull()
    expect(img!.getAttribute('width')).not.toBeNull()
    expect(img!.getAttribute('height')).not.toBeNull()
    const ratio = Number(img!.getAttribute('width')) / Number(img!.getAttribute('height'))
    const expected = BRAND.mascotWidth / BRAND.mascotHeight
    expect(Math.abs(ratio - expected)).toBeLessThan(0.05)
  })

  it('renders the mascot at a height that reads well inside a 56px navbar', () => {
    // The AppTopBar is fixed at --header-height: 56px. Anything under ~36px
    // looks lost; anything over ~48px crowds the bar. Target 38–48px.
    render(<BrandMark />)
    const img = document.querySelector('img[src="/mascot.png"]') as HTMLImageElement | null
    expect(img).not.toBeNull()
    const heightPx = Number(img!.getAttribute('height'))
    expect(heightPx).toBeGreaterThanOrEqual(36)
    expect(heightPx).toBeLessThanOrEqual(48)
  })

  it('vertically centers its children via inline-flex + items-center', () => {
    render(<BrandMark />)
    const link = screen.getByRole('link')
    expect(link.className).toMatch(/\binline-flex\b/)
    expect(link.className).toMatch(/\bitems-center\b/)
  })

  it('keeps the wordmark on the same baseline as the mascot (no leading newline / block)', () => {
    render(<BrandMark />)
    const link = screen.getByRole('link')
    const wordmark = screen.getByText(BRAND.name)
    expect(wordmark.tagName.toLowerCase()).toBe('span')
    expect(link.contains(wordmark)).toBe(true)
  })
})
