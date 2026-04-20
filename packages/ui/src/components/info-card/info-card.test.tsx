import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { InfoCard } from './info-card'

describe('InfoCard', () => {
  it('renders the label, title and body', () => {
    const { getByText } = render(
      <InfoCard label="TOOLTIP" title="Aiuto" body="Spiegazione rapida" />,
    )
    expect(getByText('TOOLTIP')).toBeTruthy()
    expect(getByText('Aiuto')).toBeTruthy()
    expect(getByText('Spiegazione rapida')).toBeTruthy()
  })

  it('renders a diamond badge (rotated square with gold-500 bg)', () => {
    const { container } = render(
      <InfoCard label="TOOLTIP" title="Aiuto" body="Spiegazione rapida" />,
    )
    const badge = container.querySelector('[data-slot="diamond"]') as HTMLElement
    expect(badge).not.toBeNull()
    expect(badge.className).toContain('bg-gold-500')
    expect(badge.className).toContain('border-2')
    expect(badge.className).toContain('border-border-memphis')
    // rotated via inline style or class
    const rotated =
      badge.style.transform.includes('rotate(45deg)') || badge.className.includes('rotate-45')
    expect(rotated).toBe(true)
  })

  it('applies Memphis frame on the content surface', () => {
    const { container } = render(
      <InfoCard label="TOOLTIP" title="Aiuto" body="Spiegazione rapida" />,
    )
    const surface = container.querySelector('[data-slot="surface"]') as HTMLElement
    expect(surface).not.toBeNull()
    expect(surface.className).toContain('border-2')
    expect(surface.className).toContain('border-border-memphis')
    expect(surface.className).toContain('bg-surface')
  })

  it('renders the eyebrow label in mono font', () => {
    const { getByText } = render(
      <InfoCard label="TOOLTIP" title="Aiuto" body="Spiegazione rapida" />,
    )
    const label = getByText('TOOLTIP')
    expect(label.className).toContain('font-mono')
    expect(label.className).toContain('uppercase')
  })

  it('forwards className to the outer wrapper', () => {
    const { container } = render(
      <InfoCard
        label="TOOLTIP"
        title="Aiuto"
        body="Spiegazione rapida"
        className="custom-info"
      />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-info')
  })
})
