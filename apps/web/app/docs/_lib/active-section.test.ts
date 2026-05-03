import { describe, it, expect } from 'vitest'
import { computeActiveSection } from './active-section'

const SECTIONS = [
  { id: 'colors', num: '01', title: 'Colori' },
  { id: 'type', num: '02', title: 'Tipografia' },
  { id: 'buttons', num: '03', title: 'Bottoni' },
  { id: 'patterns', num: '10', title: 'Pattern Memphis' },
] as const

describe('computeActiveSection', () => {
  it('returns current when visibleIds is empty', () => {
    expect(computeActiveSection(SECTIONS, 'buttons', [])).toBe('buttons')
  })

  it('returns the first section in SECTIONS order among visible ids', () => {
    expect(computeActiveSection(SECTIONS, 'colors', ['buttons', 'type'])).toBe('type')
  })

  it('picks first-declared when multiple visible', () => {
    expect(computeActiveSection(SECTIONS, 'patterns', ['patterns', 'buttons', 'type'])).toBe('type')
  })

  it('returns current when no visible id matches known sections', () => {
    expect(computeActiveSection(SECTIONS, 'colors', ['zzzz', 'not-a-section'])).toBe('colors')
  })

  it('returns the one visible id when single match', () => {
    expect(computeActiveSection(SECTIONS, 'colors', ['patterns'])).toBe('patterns')
  })
})
