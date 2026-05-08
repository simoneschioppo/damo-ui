import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { I18nProvider } from '../../lib/i18n'
import { Banner } from './banner'

describe('Banner i18n', () => {
  it('uses English dismiss aria-label by default (no provider)', () => {
    render(
      <Banner dismissible title="Hello">
        body
      </Banner>,
    )
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
  })

  it('uses Italian dismiss aria-label inside <I18nProvider locale="it">', () => {
    render(
      <I18nProvider locale="it">
        <Banner dismissible title="Hello">
          body
        </Banner>
      </I18nProvider>,
    )
    expect(screen.getByRole('button', { name: 'Chiudi' })).toBeInTheDocument()
  })
})
