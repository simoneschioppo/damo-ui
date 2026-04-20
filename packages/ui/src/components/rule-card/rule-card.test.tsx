import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RuleCard } from './rule-card'

describe('RuleCard', () => {
  it('renders the title', () => {
    const { getByText } = render(
      <RuleCard title="Regola base">
        <p>Testo della regola</p>
      </RuleCard>,
    )
    expect(getByText('Regola base')).toBeTruthy()
  })

  it('renders the children body', () => {
    const { getByText } = render(
      <RuleCard title="Regola base">
        <p>Testo della regola</p>
      </RuleCard>,
    )
    expect(getByText('Testo della regola')).toBeTruthy()
  })

  it('renders the optional eyebrow label when provided', () => {
    const { getByText } = render(
      <RuleCard label="REGOLA" title="Regola base">
        <p>Testo</p>
      </RuleCard>,
    )
    const label = getByText('REGOLA')
    expect(label).toBeTruthy()
    expect(label.className).toContain('font-mono')
    expect(label.className).toContain('uppercase')
  })

  it('does not render an eyebrow when label is omitted', () => {
    const { queryByTestId } = render(
      <RuleCard title="Regola base">
        <p>Testo</p>
      </RuleCard>,
    )
    expect(queryByTestId('rule-card-label')).toBeNull()
  })

  it('applies the display font to the title', () => {
    const { getByText } = render(
      <RuleCard title="Regola base">
        <p>Testo</p>
      </RuleCard>,
    )
    const title = getByText('Regola base')
    expect(title.className).toContain('font-display')
  })

  it('applies Memphis frame + surface classes to the root', () => {
    const { container } = render(
      <RuleCard title="Regola base">
        <p>Testo</p>
      </RuleCard>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('border-2')
    expect(root.className).toContain('border-border-memphis')
    expect(root.className).toContain('bg-surface')
  })

  it('caps the maxWidth to 420px via inline style', () => {
    const { container } = render(
      <RuleCard title="Regola base">
        <p>Testo</p>
      </RuleCard>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.style.maxWidth).toBe('420px')
  })

  it('forwards className', () => {
    const { container } = render(
      <RuleCard title="Regola base" className="custom-rule">
        <p>Testo</p>
      </RuleCard>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-rule')
  })
})
