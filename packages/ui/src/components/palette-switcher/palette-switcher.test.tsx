import { describe, it, expect, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
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
  })

  it('renders a select populated from the provided options', () => {
    const { container } = render(
      <PaletteSwitcher options={OPTIONS} defaultValue="plum-gold" />,
    )
    const select = container.querySelector('select')
    expect(select).not.toBeNull()
    const optionEls = select!.querySelectorAll('option')
    expect(optionEls.length).toBe(3)
    expect(optionEls[0]!.getAttribute('value')).toBe('plum-gold')
    expect(optionEls[0]!.textContent).toBe('Plum+Gold')
    expect(optionEls[1]!.getAttribute('value')).toBe('neon')
    expect(optionEls[2]!.getAttribute('value')).toBe('sunset')
  })

  it('renders the "Palette" eyebrow label', () => {
    const { getByText } = render(
      <PaletteSwitcher options={OPTIONS} defaultValue="plum-gold" />,
    )
    expect(getByText('Palette')).toBeTruthy()
  })

  it('updates the persisted value and the data-palette attribute on change', () => {
    const { container } = render(
      <PaletteSwitcher options={OPTIONS} defaultValue="plum-gold" />,
    )
    const select = container.querySelector('select') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'neon' } })
    expect(localStorage.getItem('palette')).toBe('neon')
    expect(document.documentElement.getAttribute('data-palette')).toBe('neon')
  })

  it('sanitizes an unknown persisted value back to the defaultValue', () => {
    localStorage.setItem('palette', 'some-legacy-palette')
    const { container } = render(
      <PaletteSwitcher options={OPTIONS} defaultValue="plum-gold" />,
    )
    const select = container.querySelector('select') as HTMLSelectElement
    expect(select.value).toBe('plum-gold')
    expect(localStorage.getItem('palette')).toBe('plum-gold')
    expect(document.documentElement.getAttribute('data-palette')).toBe('plum-gold')
  })

  it('defaults defaultValue to the first option when not provided', () => {
    const { container } = render(<PaletteSwitcher options={OPTIONS} />)
    const select = container.querySelector('select') as HTMLSelectElement
    expect(select.value).toBe('plum-gold')
  })

  it('honors a custom storageKey', () => {
    const { container } = render(
      <PaletteSwitcher
        options={OPTIONS}
        defaultValue="plum-gold"
        storageKey="my-palette"
      />,
    )
    const select = container.querySelector('select') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'sunset' } })
    expect(localStorage.getItem('my-palette')).toBe('sunset')
    expect(localStorage.getItem('palette')).toBeNull()
  })

  it('honors a custom attribute', () => {
    const { container } = render(
      <PaletteSwitcher
        options={OPTIONS}
        defaultValue="plum-gold"
        attribute="data-colors"
      />,
    )
    const select = container.querySelector('select') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'neon' } })
    expect(document.documentElement.getAttribute('data-colors')).toBe('neon')
  })

  it('reads a valid persisted value on mount', () => {
    localStorage.setItem('palette', 'sunset')
    const { container } = render(
      <PaletteSwitcher options={OPTIONS} defaultValue="plum-gold" />,
    )
    const select = container.querySelector('select') as HTMLSelectElement
    expect(select.value).toBe('sunset')
    expect(document.documentElement.getAttribute('data-palette')).toBe('sunset')
  })

  it('forwards className to the root wrapper', () => {
    const { container } = render(
      <PaletteSwitcher
        options={OPTIONS}
        defaultValue="plum-gold"
        className="custom-extra"
      />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-extra')
  })
})
