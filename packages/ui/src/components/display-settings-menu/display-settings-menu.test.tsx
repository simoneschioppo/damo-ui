import { createRef } from 'react'
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DisplaySettingsMenu } from './display-settings-menu'

const PALETTE_OPTIONS = [
  { value: 'default', label: 'Plum+Gold' },
  { value: 'neon', label: 'Neon' },
  { value: 'sunset', label: 'Sunset' },
]

async function openMenu(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Display settings' }))
}

describe('DisplaySettingsMenu', () => {
  afterEach(() => {
    cleanup()
    localStorage.clear()
    const html = document.documentElement
    html.removeAttribute('data-theme')
    html.removeAttribute('data-palette')
    html.removeAttribute('data-density')
    html.removeAttribute('data-mode')
    html.removeAttribute('data-colors')
    html.removeAttribute('data-spacing')
    html.removeAttribute('data-custom-theme')
    html.removeAttribute('data-story-theme')
    html.removeAttribute('data-story-palette')
    html.removeAttribute('data-story-density')
  })

  it('renders an IconButton trigger with the default aria-label and a cog icon', () => {
    render(<DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} />)
    const trigger = screen.getByRole('button', { name: 'Display settings' })
    expect(trigger).toBeInTheDocument()
    expect(trigger.querySelector('svg')).not.toBeNull()
  })

  it('keeps the menu closed by default', () => {
    render(<DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} />)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('opens the menu on trigger click and shows the three group labels', async () => {
    const user = userEvent.setup()
    render(<DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} />)
    await openMenu(user)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByText('Theme')).toBeInTheDocument()
    expect(screen.getByText('Palette')).toBeInTheDocument()
    expect(screen.getByText('Density')).toBeInTheDocument()
  })

  it('renders the expected number of radio items per group', async () => {
    const user = userEvent.setup()
    render(<DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} />)
    await openMenu(user)
    const items = screen.getAllByRole('menuitemradio')
    // 2 theme (Light/Dark) + 3 palette + 3 density (Compatta/Normale/Ampia) = 8
    expect(items.length).toBe(8)
  })

  it('selecting Dark sets data-theme and persists in localStorage', async () => {
    const user = userEvent.setup()
    render(<DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} />)
    await openMenu(user)
    await user.click(screen.getByRole('menuitemradio', { name: 'Dark' }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('selecting Neon sets data-palette and persists', async () => {
    const user = userEvent.setup()
    render(<DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} />)
    await openMenu(user)
    await user.click(screen.getByRole('menuitemradio', { name: 'Neon' }))
    expect(document.documentElement.getAttribute('data-palette')).toBe('neon')
    expect(localStorage.getItem('palette')).toBe('neon')
  })

  it('selecting Compatta sets data-density and persists', async () => {
    const user = userEvent.setup()
    render(<DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} />)
    await openMenu(user)
    await user.click(screen.getByRole('menuitemradio', { name: 'Compatta' }))
    expect(document.documentElement.getAttribute('data-density')).toBe('compact')
    expect(localStorage.getItem('density')).toBe('compact')
  })

  it('selecting a theme does not affect palette or density', async () => {
    const user = userEvent.setup()
    render(
      <DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} paletteDefaultValue="default" />,
    )
    await openMenu(user)
    await user.click(screen.getByRole('menuitemradio', { name: 'Dark' }))
    expect(document.documentElement.getAttribute('data-palette')).toBe('default')
    expect(document.documentElement.getAttribute('data-density')).toBe('normal')
    expect(localStorage.getItem('palette')).toBeNull()
    expect(localStorage.getItem('density')).toBeNull()
  })

  it('reads a valid persisted theme on mount', async () => {
    localStorage.setItem('theme', 'dark')
    const user = userEvent.setup()
    render(<DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} />)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    await openMenu(user)
    const dark = screen.getByRole('menuitemradio', { name: 'Dark' })
    expect(dark).toHaveAttribute('aria-checked', 'true')
  })

  it('sanitizes an unknown persisted palette to the configured default', () => {
    localStorage.setItem('palette', 'totally-unknown')
    render(
      <DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} paletteDefaultValue="default" />,
    )
    expect(localStorage.getItem('palette')).toBe('default')
    expect(document.documentElement.getAttribute('data-palette')).toBe('default')
  })

  it('sanitizes an unknown persisted theme back to the configured default', () => {
    localStorage.setItem('theme', 'sepia')
    render(<DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} themeDefaultValue="light" />)
    expect(localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('sanitizes an unknown persisted density back to the configured default', () => {
    localStorage.setItem('density', 'extra-cosy')
    render(<DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} />)
    expect(localStorage.getItem('density')).toBe('normal')
    expect(document.documentElement.getAttribute('data-density')).toBe('normal')
  })

  it('honors a custom themeStorageKey without writing the default key', async () => {
    const user = userEvent.setup()
    render(
      <DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} themeStorageKey="my-theme" />,
    )
    await openMenu(user)
    await user.click(screen.getByRole('menuitemradio', { name: 'Dark' }))
    expect(localStorage.getItem('my-theme')).toBe('dark')
    expect(localStorage.getItem('theme')).toBeNull()
  })

  it('honors a custom densityAttribute', async () => {
    const user = userEvent.setup()
    render(
      <DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} densityAttribute="data-spacing" />,
    )
    await openMenu(user)
    await user.click(screen.getByRole('menuitemradio', { name: 'Compatta' }))
    expect(document.documentElement.getAttribute('data-spacing')).toBe('compact')
    expect(document.documentElement.getAttribute('data-density')).toBeNull()
  })

  it('forwards className to the root wrapper', () => {
    const { container } = render(
      <DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} className="custom-extra" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-extra')
  })

  it('forwards arbitrary HTML attributes to the root wrapper', () => {
    const { container } = render(
      <DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} data-testid="dsm-root" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.getAttribute('data-testid')).toBe('dsm-root')
  })

  it('forwards ref to the root div', () => {
    const ref = createRef<HTMLDivElement>()
    render(<DisplaySettingsMenu ref={ref} paletteOptions={PALETTE_OPTIONS} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current!.getAttribute('data-component')).toBe('display-settings-menu')
  })

  it('defaults: theme=light, density=normal, palette=first option', () => {
    render(<DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} />)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(document.documentElement.getAttribute('data-density')).toBe('normal')
    expect(document.documentElement.getAttribute('data-palette')).toBe('default')
  })

  it('honors a custom triggerLabel', () => {
    render(
      <DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} triggerLabel="Settings" />,
    )
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })

  it('honors custom group labels', async () => {
    const user = userEvent.setup()
    render(
      <DisplaySettingsMenu
        paletteOptions={PALETTE_OPTIONS}
        themeLabel="Modalità"
        paletteLabel="Schema"
        densityLabel="Spaziatura"
      />,
    )
    await openMenu(user)
    expect(screen.getByText('Modalità')).toBeInTheDocument()
    expect(screen.getByText('Schema')).toBeInTheDocument()
    expect(screen.getByText('Spaziatura')).toBeInTheDocument()
  })

  it('renders custom theme options and selects the configured default', async () => {
    const themeOptions = [
      { value: 'solar', label: 'Solar' },
      { value: 'lunar', label: 'Lunar' },
      { value: 'eclipse', label: 'Eclipse' },
    ]
    const user = userEvent.setup()
    render(
      <DisplaySettingsMenu
        paletteOptions={PALETTE_OPTIONS}
        themeOptions={themeOptions}
        themeDefaultValue="solar"
      />,
    )
    await openMenu(user)
    expect(screen.getByRole('menuitemradio', { name: 'Solar' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(screen.getByRole('menuitemradio', { name: 'Lunar' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
    expect(screen.getByRole('menuitemradio', { name: 'Eclipse' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
  })

  it('reads a valid persisted palette on mount and shows it as checked', async () => {
    localStorage.setItem('palette', 'sunset')
    const user = userEvent.setup()
    render(<DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} />)
    expect(document.documentElement.getAttribute('data-palette')).toBe('sunset')
    await openMenu(user)
    const sunset = screen.getByRole('menuitemradio', { name: 'Sunset' })
    expect(sunset).toHaveAttribute('aria-checked', 'true')
  })

  it('groups items consistently — first 2 items match theme labels', async () => {
    const user = userEvent.setup()
    render(<DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} />)
    await openMenu(user)
    const items = screen.getAllByRole('menuitemradio')
    const labels = items.map((el) => el.textContent)
    expect(labels.slice(0, 2)).toEqual(['Light', 'Dark'])
  })

  it('associates each radio group with its labelled header via aria-labelledby', async () => {
    const user = userEvent.setup()
    render(<DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} />)
    await openMenu(user)
    const groups = screen.getAllByRole('group')
    expect(groups.length).toBeGreaterThanOrEqual(3)
    for (const group of groups.slice(0, 3)) {
      const labelId = group.getAttribute('aria-labelledby')
      expect(labelId).not.toBeNull()
      const label = document.getElementById(labelId!)
      expect(label).not.toBeNull()
      expect(label!.textContent).toMatch(/^(Theme|Palette|Density)$/)
    }
  })
})
