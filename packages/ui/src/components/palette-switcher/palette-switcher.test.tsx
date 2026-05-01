import { describe, it, expect, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PaletteSwitcher } from './palette-switcher'

const OPTIONS = [
  { value: 'plum-gold', label: 'Plum+Gold' },
  { value: 'neon', label: 'Neon' },
  { value: 'sunset', label: 'Sunset' },
]

describe('PaletteSwitcher', () => {
  afterEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-palette')
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-colors')
  })

  it('renders a combobox trigger showing the current label', () => {
    render(<PaletteSwitcher options={OPTIONS} defaultValue="plum-gold" />)
    const trigger = screen.getByRole('combobox')
    expect(trigger.textContent).toContain('Plum+Gold')
  })

  it('renders the "Palette" eyebrow label', () => {
    render(<PaletteSwitcher options={OPTIONS} defaultValue="plum-gold" />)
    expect(screen.getByText('Palette')).toBeTruthy()
  })

  it('mirrors the current value onto the <html> data attribute', () => {
    render(<PaletteSwitcher options={OPTIONS} defaultValue="plum-gold" />)
    expect(document.documentElement.getAttribute('data-palette')).toBe('plum-gold')
  })

  it('sanitizes an unknown persisted value back to the defaultValue', () => {
    localStorage.setItem('palette', 'some-legacy-palette')
    render(<PaletteSwitcher options={OPTIONS} defaultValue="plum-gold" />)
    const trigger = screen.getByRole('combobox')
    expect(trigger.textContent).toContain('Plum+Gold')
    expect(localStorage.getItem('palette')).toBe('plum-gold')
    expect(document.documentElement.getAttribute('data-palette')).toBe('plum-gold')
  })

  it('defaults to the first option when defaultValue is not provided', () => {
    render(<PaletteSwitcher options={OPTIONS} />)
    const trigger = screen.getByRole('combobox')
    expect(trigger.textContent).toContain('Plum+Gold')
    expect(document.documentElement.getAttribute('data-palette')).toBe('plum-gold')
  })

  it('writes sanitized values under a custom storageKey', () => {
    localStorage.setItem('my-palette', 'legacy-value')
    render(<PaletteSwitcher options={OPTIONS} defaultValue="sunset" storageKey="my-palette" />)
    expect(localStorage.getItem('my-palette')).toBe('sunset')
    expect(localStorage.getItem('palette')).toBeNull()
  })

  it('mirrors the current value onto a custom attribute', () => {
    render(<PaletteSwitcher options={OPTIONS} defaultValue="neon" attribute="data-colors" />)
    expect(document.documentElement.getAttribute('data-colors')).toBe('neon')
    expect(document.documentElement.getAttribute('data-palette')).toBeNull()
  })

  it('reads a valid persisted value on mount', () => {
    localStorage.setItem('palette', 'sunset')
    render(<PaletteSwitcher options={OPTIONS} defaultValue="plum-gold" />)
    const trigger = screen.getByRole('combobox')
    expect(trigger.textContent).toContain('Sunset')
    expect(document.documentElement.getAttribute('data-palette')).toBe('sunset')
  })

  it('forwards className to the root wrapper', () => {
    const { container } = render(
      <PaletteSwitcher options={OPTIONS} defaultValue="plum-gold" className="custom-extra" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-extra')
  })
})
