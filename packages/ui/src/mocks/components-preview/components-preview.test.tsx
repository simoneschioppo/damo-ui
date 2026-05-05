import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { ComponentsPreview } from './components-preview'

afterEach(() => {
  cleanup()
})

describe('ComponentsPreview', () => {
  it('renders every category section', () => {
    render(<ComponentsPreview />)
    for (const id of [
      'buttons',
      'cards',
      'banners',
      'overlays',
      'form',
      'feedback',
      'navigation',
      'data',
      'layout',
    ]) {
      expect(document.getElementById(id), `section #${id}`).not.toBeNull()
    }
  })

  it('renders the four banner status variants', () => {
    render(<ComponentsPreview />)
    const banners = document.getElementById('banners') as HTMLElement
    expect(banners).not.toBeNull()
    const scoped = within(banners)
    // Each variant has a unique title
    expect(scoped.getByText('Info')).toBeInTheDocument()
    expect(scoped.getByText('Success')).toBeInTheDocument()
    expect(scoped.getByText('Warning')).toBeInTheDocument()
    expect(scoped.getByText('Danger')).toBeInTheDocument()
  })

  it('renders the seven post-audit Badge variants', () => {
    render(<ComponentsPreview />)
    const feedback = document.getElementById('feedback') as HTMLElement
    const scoped = within(feedback)
    // Some labels (default, success, warning) are reused by Chip too, so
    // assert each label appears at least once inside the feedback section.
    for (const label of [
      'default',
      'featured',
      'success',
      'warning',
      'info',
      'destructive',
      'outline',
    ]) {
      expect(scoped.getAllByText(label).length, `badge ${label}`).toBeGreaterThan(0)
    }
  })

  it('renders all five medal ranks under data display', () => {
    render(<ComponentsPreview />)
    const data = document.getElementById('data') as HTMLElement
    const scoped = within(data)
    // Each rank uses a unique label string, so a single text query suffices.
    expect(scoped.getByText('Bronze')).toBeInTheDocument()
    expect(scoped.getByText('Silver')).toBeInTheDocument()
    expect(scoped.getByText('Gold')).toBeInTheDocument()
    expect(scoped.getByText('Master')).toBeInTheDocument()
    // The "GM" label appears once below the medal; the "GM" value renders
    // inside the SVG too — assert at least one occurrence.
    expect(scoped.getAllByText('GM').length).toBeGreaterThanOrEqual(1)
  })

  it('renders a Charts subgroup with a bar per --chart-N token', () => {
    render(<ComponentsPreview />)
    const data = document.getElementById('data') as HTMLElement
    expect(data).not.toBeNull()
    const scoped = within(data)
    expect(scoped.getByText('Charts')).toBeInTheDocument()
    // Five bars, each labelled chart-1..chart-5 — the nav target a consumer
    // would themselves use to verify the chart palette swap.
    for (const i of [1, 2, 3, 4, 5]) {
      const bar = data.querySelector(`[data-chart-bar="${i}"]`)
      expect(bar, `bar ${i}`).not.toBeNull()
    }
  })

  it('renders an App pattern swatch consuming --app-pattern-* CSS variables', () => {
    render(<ComponentsPreview />)
    const layout = document.getElementById('layout') as HTMLElement
    expect(layout).not.toBeNull()
    const scoped = within(layout)
    expect(scoped.getByText('App pattern')).toBeInTheDocument()
    const swatch = layout.querySelector('[data-testid="app-pattern-swatch"]')
    expect(swatch).not.toBeNull()
    const bg = (swatch as HTMLElement).style.backgroundImage
    // The swatch interpolates the three pattern colour variables via inline
    // style so the test confirms each one is read at render time.
    expect(bg).toContain('--app-pattern-color-1')
    expect(bg).toContain('--app-pattern-color-2')
    expect(bg).toContain('--app-pattern-color-3')
    const size = (swatch as HTMLElement).style.backgroundSize
    expect(size).toContain('--app-pattern-size')
  })

  it('renders a ContextMenu trigger area in the navigation section', () => {
    render(<ComponentsPreview />)
    const navigation = document.getElementById('navigation') as HTMLElement
    expect(navigation).not.toBeNull()
    const scoped = within(navigation)
    expect(scoped.getByText('Context menu')).toBeInTheDocument()
    // The trigger is an interactive surface that announces its right-click
    // affordance via aria-label so screen-reader users know what it does.
    expect(scoped.getByLabelText(/right-click for menu/i)).toBeInTheDocument()
  })

  it('exposes a Toast trigger that pops a toast with title + description', () => {
    render(<ComponentsPreview />)
    const feedback = document.getElementById('feedback') as HTMLElement
    const trigger = within(feedback).getByRole('button', { name: /show toast/i })
    fireEvent.click(trigger)
    // Toast lives in the Radix portal, query the document.
    expect(screen.getByText('Modifiche salvate')).toBeInTheDocument()
    expect(screen.getByText('Il tuo theme è stato applicato.')).toBeInTheDocument()
  })

  it('renders both NavItem tones (default + onDark)', () => {
    render(<ComponentsPreview />)
    // The tone subgroup label, plus per-panel labels for each tone.
    expect(
      screen.getByText('NavItem · default + onDark tones', { exact: false }),
    ).toBeInTheDocument()
    expect(screen.getByText('default tone')).toBeInTheDocument()
    expect(screen.getByText('onDark tone')).toBeInTheDocument()
  })
})
