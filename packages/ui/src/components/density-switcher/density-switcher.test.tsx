import { describe, it, expect, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { DensitySwitcher } from './density-switcher'

describe('DensitySwitcher', () => {
  afterEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-density')
  })

  it('renders Compatta, Normale and Ampia buttons by default', () => {
    const { getByRole } = render(<DensitySwitcher />)
    expect(getByRole('button', { name: 'Compatta' })).toBeTruthy()
    expect(getByRole('button', { name: 'Normale' })).toBeTruthy()
    expect(getByRole('button', { name: 'Ampia' })).toBeTruthy()
  })

  it('clicking Compatta sets data-density="compact" on documentElement', () => {
    const { getByRole } = render(<DensitySwitcher />)
    fireEvent.click(getByRole('button', { name: 'Compatta' }))
    expect(document.documentElement.getAttribute('data-density')).toBe('compact')
  })

  it('clicking Ampia sets data-density="comfortable" on documentElement', () => {
    const { getByRole } = render(<DensitySwitcher />)
    fireEvent.click(getByRole('button', { name: 'Ampia' }))
    expect(document.documentElement.getAttribute('data-density')).toBe('comfortable')
  })

  it('persists selection to localStorage under key "density"', () => {
    const { getByRole } = render(<DensitySwitcher />)
    fireEvent.click(getByRole('button', { name: 'Compatta' }))
    expect(localStorage.getItem('density')).toBe('compact')
  })

  it('honors a custom storageKey', () => {
    const { getByRole } = render(<DensitySwitcher storageKey="my-density" />)
    fireEvent.click(getByRole('button', { name: 'Ampia' }))
    expect(localStorage.getItem('my-density')).toBe('comfortable')
    expect(localStorage.getItem('density')).toBeNull()
  })

  it('honors a custom attribute', () => {
    const { getByRole } = render(<DensitySwitcher attribute="data-spacing" />)
    fireEvent.click(getByRole('button', { name: 'Compatta' }))
    expect(document.documentElement.getAttribute('data-spacing')).toBe('compact')
  })

  it('renders custom options with custom labels', () => {
    const options = [
      { value: 'tight', label: 'Tight' },
      { value: 'loose', label: 'Loose' },
    ]
    const { getByRole } = render(<DensitySwitcher options={options} defaultValue="tight" />)
    expect(getByRole('button', { name: 'Tight' })).toBeTruthy()
    expect(getByRole('button', { name: 'Loose' })).toBeTruthy()
  })

  it('forwards className to the root wrapper', () => {
    const { container } = render(<DensitySwitcher className="custom-x" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-x')
  })

  it('applies active styling to the currently-selected option', () => {
    localStorage.setItem('density', 'compact')
    const { getByRole } = render(<DensitySwitcher />)
    const compactBtn = getByRole('button', { name: 'Compatta' }) as HTMLButtonElement
    const normalBtn = getByRole('button', { name: 'Normale' }) as HTMLButtonElement
    expect(compactBtn.className).toContain('bg-secondary')
    expect(compactBtn.className).toContain('text-secondary-foreground')
    expect(normalBtn.className).toContain('bg-card')
    expect(normalBtn.className).toContain('text-card-foreground')
  })

  it('shows "Density" eyebrow label', () => {
    const { getByText } = render(<DensitySwitcher />)
    expect(getByText('Density')).toBeTruthy()
  })

  it('exposes aria-pressed on each option so SRs announce active state', () => {
    localStorage.setItem('density', 'compact')
    const { getByRole } = render(<DensitySwitcher />)
    expect(getByRole('button', { name: 'Compatta' }).getAttribute('aria-pressed')).toBe('true')
    expect(getByRole('button', { name: 'Normale' }).getAttribute('aria-pressed')).toBe('false')
    expect(getByRole('button', { name: 'Ampia' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('wraps buttons in a labeled role=group landmark', () => {
    const { getByRole } = render(<DensitySwitcher />)
    const group = getByRole('group', { name: 'Density' })
    expect(group).toBeTruthy()
  })
})
