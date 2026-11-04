import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ButtonLink } from './ButtonLink'

describe('ButtonLink', () => {
  it('é um link com o href certo, e não um botão', () => {
    render(<ButtonLink href="#inscricao">Quero me inscrever</ButtonLink>)

    expect(screen.getByRole('link', { name: 'Quero me inscrever' })).toHaveAttribute(
      'href',
      '#inscricao',
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('recebe foco pelo teclado', async () => {
    const user = userEvent.setup()
    render(<ButtonLink href="#planos">Ver os planos</ButtonLink>)

    await user.tab()

    expect(screen.getByRole('link', { name: 'Ver os planos' })).toHaveFocus()
  })
})
