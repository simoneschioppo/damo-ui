import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ModeCard } from './mode-card'

describe('ModeCard', () => {
  it('renders the title uppercased in the display font', () => {
    const { getByText } = render(
      <ModeCard title="CLASSICO" desc="Scacchi ortodossi" />,
    )
    const heading = getByText('CLASSICO')
    expect(heading).toBeTruthy()
    expect(heading.className).toContain('font-display')
    expect(heading.className).toContain('uppercase')
  })

  it('renders the description', () => {
    const { getByText } = render(
      <ModeCard title="CLASSICO" desc="Scacchi ortodossi" />,
    )
    expect(getByText('Scacchi ortodossi')).toBeTruthy()
  })

  it('renders the meta when provided', () => {
    const { getByText } = render(
      <ModeCard title="CLASSICO" desc="Scacchi ortodossi" meta="15+10" />,
    )
    expect(getByText('15+10')).toBeTruthy()
  })

  it('does not render a meta node when meta not provided', () => {
    const { queryByTestId } = render(
      <ModeCard title="CLASSICO" desc="Scacchi ortodossi" />,
    )
    expect(queryByTestId('mode-card-meta')).toBeNull()
  })

  it('renders optional icon', () => {
    const { getByTestId } = render(
      <ModeCard
        title="CLASSICO"
        desc="Scacchi ortodossi"
        icon={<span data-testid="mode-icon">→</span>}
      />,
    )
    expect(getByTestId('mode-icon')).toBeTruthy()
  })

  it('applies Memphis frame + gold shadow on the root', () => {
    const { container } = render(
      <ModeCard title="CLASSICO" desc="Scacchi ortodossi" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('border-2')
    expect(root.className).toContain('border-border-memphis')
    expect(root.className).toContain('bg-surface')
  })

  it('has a fixed width of 280px via inline style', () => {
    const { container } = render(
      <ModeCard title="CLASSICO" desc="Scacchi ortodossi" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.style.width).toBe('280px')
  })

  it('uses the gold-500 CSS var for the shadow', () => {
    const { container } = render(
      <ModeCard title="CLASSICO" desc="Scacchi ortodossi" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.style.boxShadow).toContain('var(--gold-500)')
  })

  it('forwards className', () => {
    const { container } = render(
      <ModeCard title="CLASSICO" desc="Scacchi ortodossi" className="extra-mode" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('extra-mode')
  })
})
