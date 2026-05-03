import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { FeatureCard } from './feature-card'

describe('FeatureCard', () => {
  it('renders the title uppercased in the display font', () => {
    const { getByText } = render(<FeatureCard title="CLASSICO" desc="Esempio descrizione" />)
    const heading = getByText('CLASSICO')
    expect(heading).toBeTruthy()
    expect(heading.className).toContain('font-display')
    expect(heading.className).toContain('uppercase')
  })

  it('renders the description', () => {
    const { getByText } = render(<FeatureCard title="CLASSICO" desc="Esempio descrizione" />)
    expect(getByText('Esempio descrizione')).toBeTruthy()
  })

  it('renders the meta when provided', () => {
    const { getByText } = render(
      <FeatureCard title="CLASSICO" desc="Esempio descrizione" meta="15+10" />,
    )
    expect(getByText('15+10')).toBeTruthy()
  })

  it('does not render a meta node when meta not provided', () => {
    const { queryByTestId } = render(<FeatureCard title="CLASSICO" desc="Esempio descrizione" />)
    expect(queryByTestId('feature-card-meta')).toBeNull()
  })

  it('renders optional icon', () => {
    const { getByTestId } = render(
      <FeatureCard
        title="CLASSICO"
        desc="Esempio descrizione"
        icon={<span data-testid="feature-icon">→</span>}
      />,
    )
    expect(getByTestId('feature-icon')).toBeTruthy()
  })

  it('applies Memphis frame + gold shadow on the root', () => {
    const { container } = render(<FeatureCard title="CLASSICO" desc="Esempio descrizione" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('border-2')
    expect(root.className).toContain('border-memphis')
    expect(root.className).toContain('bg-card')
  })

  it('has a fixed width of 280px via inline style', () => {
    const { container } = render(<FeatureCard title="CLASSICO" desc="Esempio descrizione" />)
    const root = container.firstChild as HTMLElement
    expect(root.style.width).toBe('280px')
  })

  it('uses the Memphis card shadow token recoloured via --memphis-shadow-color override', () => {
    const { container } = render(<FeatureCard title="CLASSICO" desc="Esempio descrizione" />)
    const root = container.firstChild as HTMLElement
    expect(root.style.boxShadow).toContain('var(--shadow-memphis-card)')
    expect(root.style.getPropertyValue('--memphis-shadow-color')).toContain('var(--primary)')
    // Guard against the previous hardcoded shadow regressing back.
    expect(root.getAttribute('style') ?? '').not.toMatch(/box-shadow:\s*\d+px\s+\d+px\s+0/)
  })

  it('forwards className', () => {
    const { container } = render(
      <FeatureCard title="CLASSICO" desc="Esempio descrizione" className="extra-feature" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('extra-feature')
  })
})
