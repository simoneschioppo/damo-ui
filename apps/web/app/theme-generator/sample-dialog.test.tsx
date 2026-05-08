import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { SampleDialog } from './sample-dialog'
import enMessages from '../../messages/en.json'
import itMessages from '../../messages/it.json'

function renderWithLocale(locale: 'en' | 'it' = 'it') {
  const messages = locale === 'it' ? itMessages : enMessages
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SampleDialog />
    </NextIntlClientProvider>,
  )
}

describe('SampleDialog', () => {
  it('renders the trigger button by default and keeps the dialog closed', () => {
    renderWithLocale()
    expect(screen.getByTestId('open-sample-dialog')).toBeInTheDocument()
    expect(screen.queryByTestId('sample-dialog-content')).toBeNull()
  })

  it('opens the dialog when the trigger is clicked', () => {
    renderWithLocale()
    fireEvent.click(screen.getByTestId('open-sample-dialog'))
    expect(screen.getByTestId('sample-dialog-content')).toBeInTheDocument()
  })

  it('renders the typical dialog structure (title, description, body, footer) in IT', () => {
    renderWithLocale('it')
    fireEvent.click(screen.getByTestId('open-sample-dialog'))

    expect(screen.getByRole('heading', { name: /Pubblica nuova release/ })).toBeInTheDocument()
    expect(screen.getByText(/seguono i token correnti/)).toBeInTheDocument()
    expect(screen.getByLabelText('Tag versione')).toBeInTheDocument()
    expect(screen.getByTestId('sample-dialog-cancel')).toBeInTheDocument()
    expect(screen.getByTestId('sample-dialog-confirm')).toBeInTheDocument()
  })

  it('renders the dialog structure in EN', () => {
    renderWithLocale('en')
    fireEvent.click(screen.getByTestId('open-sample-dialog'))

    expect(screen.getByRole('heading', { name: /Publish new release/ })).toBeInTheDocument()
    expect(screen.getByText(/follow the current theme generator tokens/)).toBeInTheDocument()
    expect(screen.getByLabelText('Version tag')).toBeInTheDocument()
  })

  it('closes the dialog when the cancel action is clicked', () => {
    renderWithLocale()
    fireEvent.click(screen.getByTestId('open-sample-dialog'))
    fireEvent.click(screen.getByTestId('sample-dialog-cancel'))
    expect(screen.queryByTestId('sample-dialog-content')).toBeNull()
  })

  it('closes the dialog when the confirm action is clicked', () => {
    renderWithLocale()
    fireEvent.click(screen.getByTestId('open-sample-dialog'))
    fireEvent.click(screen.getByTestId('sample-dialog-confirm'))
    expect(screen.queryByTestId('sample-dialog-content')).toBeNull()
  })
})
