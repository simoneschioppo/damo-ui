import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { I18nProvider } from '../../lib/i18n'
import { Spinner } from './spinner'

describe('Spinner i18n', () => {
  it('uses English label when rendered without provider (default)', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading…')
  })

  it('uses English label inside <I18nProvider locale="en">', () => {
    render(
      <I18nProvider locale="en">
        <Spinner />
      </I18nProvider>,
    )
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading…')
  })

  it('uses Italian label inside <I18nProvider locale="it">', () => {
    render(
      <I18nProvider locale="it">
        <Spinner />
      </I18nProvider>,
    )
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Caricamento…')
  })

  it('caller-passed label always wins over dictionary', () => {
    render(
      <I18nProvider locale="it">
        <Spinner label="Custom" />
      </I18nProvider>,
    )
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Custom')
  })
})
