import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { PlayerCard } from './player-card'

describe('PlayerCard', () => {
  it('renders the player name', () => {
    const { getByText } = render(
      <PlayerCard name="Marini" elo={1842} mode="RAPID" clock="05:42" />,
    )
    expect(getByText(/Marini/)).toBeTruthy()
  })

  it('renders the mono meta line with ELO and mode', () => {
    const { getByText } = render(
      <PlayerCard name="Marini" elo={1842} mode="RAPID" clock="05:42" />,
    )
    expect(getByText(/ELO\s+1842\s*·\s*RAPID/)).toBeTruthy()
  })

  it('renders the clock value', () => {
    const { getByText } = render(
      <PlayerCard name="Marini" elo={1842} mode="RAPID" clock="05:42" />,
    )
    expect(getByText('05:42')).toBeTruthy()
  })

  it('renders color suffix when color prop is provided', () => {
    const { getByText } = render(
      <PlayerCard name="Marini" elo={1842} mode="RAPID" clock="05:42" color="bianco" />,
    )
    expect(getByText(/Marini\s*·\s*Bianco/i)).toBeTruthy()
  })

  it('falls back to the first letter avatar when no avatar prop', () => {
    const { container } = render(
      <PlayerCard name="Marini" elo={1842} mode="RAPID" clock="05:42" />,
    )
    // default avatar renders an uppercase "M"
    const avatar = container.querySelector('[data-slot="avatar"]')
    expect(avatar).not.toBeNull()
    expect(avatar!.textContent).toBe('M')
  })

  it('renders a custom avatar when provided', () => {
    const { getByTestId } = render(
      <PlayerCard
        name="Marini"
        elo={1842}
        mode="RAPID"
        clock="05:42"
        avatar={<span data-testid="custom-avatar">X</span>}
      />,
    )
    expect(getByTestId('custom-avatar')).toBeTruthy()
  })

  it('applies Memphis frame classes on the root', () => {
    const { container } = render(
      <PlayerCard name="Marini" elo={1842} mode="RAPID" clock="05:42" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('border-2')
    expect(root.className).toContain('border-border-memphis')
    expect(root.className).toContain('bg-surface')
  })

  it('forwards className to the root', () => {
    const { container } = render(
      <PlayerCard
        name="Marini"
        elo={1842}
        mode="RAPID"
        clock="05:42"
        className="custom-player"
      />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-player')
  })

  it('uses gold border and shadow on the clock box', () => {
    const { container } = render(
      <PlayerCard name="Marini" elo={1842} mode="RAPID" clock="05:42" />,
    )
    const clock = container.querySelector('[data-slot="clock"]') as HTMLElement
    expect(clock).not.toBeNull()
    expect(clock.className).toContain('border-gold-500')
    expect(clock.className).toContain('bg-paper-50')
  })
})
