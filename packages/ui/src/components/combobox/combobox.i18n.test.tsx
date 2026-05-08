import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { I18nProvider } from '../../lib/i18n'
import { Combobox } from './combobox'

const OPTIONS = [{ value: 'a', label: 'Alpha' }]

describe('Combobox i18n', () => {
  it('shows English placeholder by default (no provider)', () => {
    render(<Combobox options={OPTIONS} />)
    expect(screen.getByRole('button')).toHaveTextContent('Choose…')
  })

  it('shows Italian placeholder under <I18nProvider locale="it">', () => {
    render(
      <I18nProvider locale="it">
        <Combobox options={OPTIONS} />
      </I18nProvider>,
    )
    expect(screen.getByRole('button')).toHaveTextContent('Scegli…')
  })

  it('caller placeholder overrides dictionary', () => {
    render(
      <I18nProvider locale="it">
        <Combobox options={OPTIONS} placeholder="Custom" />
      </I18nProvider>,
    )
    expect(screen.getByRole('button')).toHaveTextContent('Custom')
  })
})
