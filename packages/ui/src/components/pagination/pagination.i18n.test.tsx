import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { I18nProvider } from '../../lib/i18n'
import { Pagination } from './pagination'

describe('Pagination i18n', () => {
  it('uses English labels by default (no provider)', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
  })

  it('uses Italian labels inside <I18nProvider locale="it">', () => {
    render(
      <I18nProvider locale="it">
        <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />
      </I18nProvider>,
    )
    expect(screen.getByRole('button', { name: 'Precedente' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Successivo' })).toBeInTheDocument()
    expect(screen.getByText('Pagina 1 di 3')).toBeInTheDocument()
  })

  it('caller labels override dictionary entries', () => {
    render(
      <I18nProvider locale="it">
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={() => {}}
          labels={{ previous: 'Custom prev' }}
        />
      </I18nProvider>,
    )
    expect(screen.getByRole('button', { name: 'Custom prev' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Successivo' })).toBeInTheDocument()
  })
})
