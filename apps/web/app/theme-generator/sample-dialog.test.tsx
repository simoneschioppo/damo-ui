import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SampleDialog } from './sample-dialog'

describe('SampleDialog', () => {
  it('renders the trigger button by default and keeps the dialog closed', () => {
    render(<SampleDialog />)
    expect(screen.getByTestId('open-sample-dialog')).toBeInTheDocument()
    expect(screen.queryByTestId('sample-dialog-content')).toBeNull()
  })

  it('opens the dialog when the trigger is clicked', () => {
    render(<SampleDialog />)
    fireEvent.click(screen.getByTestId('open-sample-dialog'))
    expect(screen.getByTestId('sample-dialog-content')).toBeInTheDocument()
  })

  it('renders the typical dialog structure (title, description, body, footer)', () => {
    render(<SampleDialog />)
    fireEvent.click(screen.getByTestId('open-sample-dialog'))

    expect(screen.getByRole('heading', { name: /Pubblica nuova release/ })).toBeInTheDocument()
    expect(screen.getByText(/seguono i token correnti/)).toBeInTheDocument()
    expect(screen.getByLabelText('Tag versione')).toBeInTheDocument()
    expect(screen.getByTestId('sample-dialog-cancel')).toBeInTheDocument()
    expect(screen.getByTestId('sample-dialog-confirm')).toBeInTheDocument()
  })

  it('closes the dialog when the cancel action is clicked', () => {
    render(<SampleDialog />)
    fireEvent.click(screen.getByTestId('open-sample-dialog'))
    fireEvent.click(screen.getByTestId('sample-dialog-cancel'))
    expect(screen.queryByTestId('sample-dialog-content')).toBeNull()
  })

  it('closes the dialog when the confirm action is clicked', () => {
    render(<SampleDialog />)
    fireEvent.click(screen.getByTestId('open-sample-dialog'))
    fireEvent.click(screen.getByTestId('sample-dialog-confirm'))
    expect(screen.queryByTestId('sample-dialog-content')).toBeNull()
  })
})
