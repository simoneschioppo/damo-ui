import { createRef } from 'react'
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AttrToggleGroup } from './attr-toggle-group'

const OPTIONS = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'gamma', label: 'Gamma' },
] as const

afterEach(() => {
  localStorage.clear()
  const html = document.documentElement
  // Clear every test attribute we use across the file.
  html.removeAttribute('data-attr-test')
  html.removeAttribute('data-attr-other')
  html.removeAttribute('data-attr-x')
})

describe('AttrToggleGroup — segmented variant', () => {
  it('renders one button per option', () => {
    render(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
      />,
    )
    expect(screen.getByRole('button', { name: 'Alpha' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Beta' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Gamma' })).toBeTruthy()
  })

  it('declares rounded-none on the segmented frame so --radius-none themes it', () => {
    const { container } = render(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
      />,
    )
    const frame = container.querySelector('[role="group"]') as HTMLElement
    expect(frame).not.toBeNull()
    expect(frame.className).toContain('rounded-none')
  })

  it('clicking a button mirrors the value onto the configured attribute', () => {
    render(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Beta' }))
    expect(document.documentElement.getAttribute('data-attr-test')).toBe('beta')
  })

  it('clicking persists the value under the configured storageKey', () => {
    render(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Gamma' }))
    expect(localStorage.getItem('attr-test')).toBe('gamma')
  })

  it('reads a valid persisted value on mount', () => {
    localStorage.setItem('attr-test', 'beta')
    render(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
      />,
    )
    expect(document.documentElement.getAttribute('data-attr-test')).toBe('beta')
    expect(screen.getByRole('button', { name: 'Beta' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('sanitises an unknown persisted value back to defaultValue', () => {
    localStorage.setItem('attr-test', 'totally-unknown')
    render(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
      />,
    )
    expect(localStorage.getItem('attr-test')).toBe('alpha')
    expect(document.documentElement.getAttribute('data-attr-test')).toBe('alpha')
    expect(screen.getByRole('button', { name: 'Alpha' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('renders the optional eyebrow label only when label prop is set', () => {
    const { rerender, container } = render(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
      />,
    )
    expect(container.querySelector('.eyebrow')).toBeNull()

    rerender(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
        label="Theme"
      />,
    )
    expect(screen.getByText('Theme')).toBeTruthy()
  })

  it('wraps buttons in a role=group landmark labelled by the eyebrow when label provided', () => {
    render(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
        label="Density"
      />,
    )
    const group = screen.getByRole('group', { name: 'Density' })
    expect(group).toBeTruthy()
  })

  it('exposes aria-pressed reflecting active state', () => {
    localStorage.setItem('attr-test', 'beta')
    render(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
      />,
    )
    expect(screen.getByRole('button', { name: 'Alpha' }).getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByRole('button', { name: 'Beta' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Gamma' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('applies the active styling tokens (bg-secondary / text-secondary-foreground) to the selected option', () => {
    localStorage.setItem('attr-test', 'beta')
    render(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
      />,
    )
    const beta = screen.getByRole('button', { name: 'Beta' }) as HTMLButtonElement
    const alpha = screen.getByRole('button', { name: 'Alpha' }) as HTMLButtonElement
    expect(beta.className).toContain('bg-secondary')
    expect(beta.className).toContain('text-secondary-foreground')
    expect(alpha.className).toContain('bg-card')
    expect(alpha.className).toContain('text-card-foreground')
  })

  it('forwards className to the root wrapper', () => {
    const { container } = render(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
        className="custom-extra"
      />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-extra')
  })

  it('forwards arbitrary HTML attributes to the root wrapper', () => {
    const { container } = render(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
        data-testid="atg-root"
      />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.getAttribute('data-testid')).toBe('atg-root')
  })

  it('forwards ref to the root div', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <AttrToggleGroup
        ref={ref}
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
      />,
    )
    expect(ref.current).not.toBeNull()
    expect(ref.current!.tagName.toLowerCase()).toBe('div')
  })

  it('honors a custom storageKey without writing the legacy default', () => {
    render(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="my-key"
        attribute="data-attr-test"
        defaultValue="alpha"
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Beta' }))
    expect(localStorage.getItem('my-key')).toBe('beta')
    expect(localStorage.getItem('attr-test')).toBeNull()
  })

  it('honors a custom attribute without writing other axes', () => {
    render(
      <AttrToggleGroup
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-other"
        defaultValue="alpha"
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Gamma' }))
    expect(document.documentElement.getAttribute('data-attr-other')).toBe('gamma')
    expect(document.documentElement.getAttribute('data-attr-test')).toBeNull()
  })

  it('falls back to the first option when defaultValue is omitted', () => {
    render(<AttrToggleGroup options={OPTIONS} storageKey="attr-test" attribute="data-attr-test" />)
    expect(document.documentElement.getAttribute('data-attr-test')).toBe('alpha')
    expect(screen.getByRole('button', { name: 'Alpha' }).getAttribute('aria-pressed')).toBe('true')
  })
})

describe('AttrToggleGroup — select variant', () => {
  it('renders a combobox trigger showing the current label', () => {
    render(
      <AttrToggleGroup
        variant="select"
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="beta"
      />,
    )
    const trigger = screen.getByRole('combobox')
    expect(trigger.textContent).toContain('Beta')
  })

  it('mirrors the current value onto the configured attribute on mount', () => {
    render(
      <AttrToggleGroup
        variant="select"
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="gamma"
      />,
    )
    expect(document.documentElement.getAttribute('data-attr-test')).toBe('gamma')
  })

  it('sanitises an unknown persisted value back to defaultValue', () => {
    localStorage.setItem('attr-test', 'legacy-value')
    render(
      <AttrToggleGroup
        variant="select"
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
      />,
    )
    const trigger = screen.getByRole('combobox')
    expect(trigger.textContent).toContain('Alpha')
    expect(localStorage.getItem('attr-test')).toBe('alpha')
    expect(document.documentElement.getAttribute('data-attr-test')).toBe('alpha')
  })

  it('changing selection mirrors and persists', async () => {
    const user = userEvent.setup()
    render(
      <AttrToggleGroup
        variant="select"
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
      />,
    )
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Gamma' }))
    expect(document.documentElement.getAttribute('data-attr-test')).toBe('gamma')
    expect(localStorage.getItem('attr-test')).toBe('gamma')
  })

  it('reads a valid persisted value on mount', () => {
    localStorage.setItem('attr-test', 'gamma')
    render(
      <AttrToggleGroup
        variant="select"
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
      />,
    )
    const trigger = screen.getByRole('combobox')
    expect(trigger.textContent).toContain('Gamma')
  })

  it('renders the eyebrow label when provided', () => {
    render(
      <AttrToggleGroup
        variant="select"
        options={OPTIONS}
        storageKey="attr-test"
        attribute="data-attr-test"
        defaultValue="alpha"
        label="Palette"
      />,
    )
    expect(screen.getByText('Palette')).toBeTruthy()
  })
})
