import { describe, it, expect, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { ThemeSwitcher } from './theme-switcher'

describe('ThemeSwitcher', () => {
  afterEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-palette')
  })

  it('renders default Light and Dark buttons', () => {
    const { getByRole } = render(<ThemeSwitcher />)
    expect(getByRole('button', { name: 'Light' })).toBeTruthy()
    expect(getByRole('button', { name: 'Dark' })).toBeTruthy()
  })

  it('clicking a button sets data-theme on documentElement', () => {
    const { getByRole } = render(<ThemeSwitcher />)
    fireEvent.click(getByRole('button', { name: 'Dark' }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('clicking persists selection to localStorage under the storageKey', () => {
    const { getByRole } = render(<ThemeSwitcher />)
    fireEvent.click(getByRole('button', { name: 'Dark' }))
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('honors a custom storageKey', () => {
    const { getByRole } = render(<ThemeSwitcher storageKey="my-theme" />)
    fireEvent.click(getByRole('button', { name: 'Dark' }))
    expect(localStorage.getItem('my-theme')).toBe('dark')
    expect(localStorage.getItem('theme')).toBeNull()
  })

  it('honors a custom attribute', () => {
    const { getByRole } = render(<ThemeSwitcher attribute="data-mode" />)
    fireEvent.click(getByRole('button', { name: 'Dark' }))
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark')
  })

  it('renders custom options with custom labels', () => {
    const options = [
      { value: 'solar', label: 'Solar' },
      { value: 'lunar', label: 'Lunar' },
      { value: 'eclipse', label: 'Eclipse' },
    ]
    const { getByRole } = render(
      <ThemeSwitcher options={options} defaultValue="solar" />,
    )
    expect(getByRole('button', { name: 'Solar' })).toBeTruthy()
    expect(getByRole('button', { name: 'Lunar' })).toBeTruthy()
    expect(getByRole('button', { name: 'Eclipse' })).toBeTruthy()
  })

  it('forwards className to the root wrapper', () => {
    const { container } = render(<ThemeSwitcher className="custom-extra" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-extra')
  })

  it('applies selected styling to the active option', () => {
    localStorage.setItem('theme', 'dark')
    const { getByRole } = render(<ThemeSwitcher />)
    const darkBtn = getByRole('button', { name: 'Dark' }) as HTMLButtonElement
    const lightBtn = getByRole('button', { name: 'Light' }) as HTMLButtonElement
    expect(darkBtn.className).toContain('bg-plum-500')
    expect(darkBtn.className).toContain('text-paper-50')
    expect(lightBtn.className).toContain('bg-surface')
    expect(lightBtn.className).toContain('text-ink')
  })
})
