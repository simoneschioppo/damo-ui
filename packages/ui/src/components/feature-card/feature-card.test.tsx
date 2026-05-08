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

  it('applies Memphis frame classes via Card composition', () => {
    const { container } = render(<FeatureCard title="CLASSICO" desc="Esempio descrizione" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('border-2')
    expect(root.className).toContain('border-memphis')
    expect(root.className).toContain('bg-card')
  })

  it('declares rounded-none so --radius-none token theming reaches the frame', () => {
    const { container } = render(<FeatureCard title="CLASSICO" desc="Esempio descrizione" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('rounded-none')
  })

  it('has a fixed width of 280px via w-[280px] className', () => {
    const { container } = render(<FeatureCard title="CLASSICO" desc="Esempio descrizione" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('w-[280px]')
  })

  it('uses Card variant="featured" so --memphis-shadow-color is wired to var(--primary)', () => {
    const { container } = render(<FeatureCard title="CLASSICO" desc="Esempio descrizione" />)
    const root = container.firstChild as HTMLElement
    // The featured Card variant adds the arbitrary `[--memphis-shadow-color:var(--primary)]`
    // utility, which Tailwind compiles into a class that sets the CSS custom property.
    expect(root.className).toContain('[--memphis-shadow-color:var(--primary)]')
    // Shadow utility is the standard Memphis shadow, recoloured by the override above.
    expect(root.className).toContain('shadow-memphis')
    // Guard against the previous inline-style approach regressing back.
    expect(root.style.boxShadow).toBe('')
  })

  it('applies Card padding="md" (p-5) by default', () => {
    const { container } = render(<FeatureCard title="CLASSICO" desc="Esempio descrizione" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('p-5')
  })

  it('forwards className', () => {
    const { container } = render(
      <FeatureCard title="CLASSICO" desc="Esempio descrizione" className="extra-feature" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('extra-feature')
  })
})
