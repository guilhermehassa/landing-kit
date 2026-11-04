import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Testimonial } from './Testimonial'

const quote =
  'Achei que precisava trocar de celular. Precisava era saber a hora de sair para fotografar.'

describe('Testimonial', () => {
  it('marca a citação com figure e blockquote', () => {
    render(<Testimonial quote={quote} name="Caio T." context="Professor, Recife (PE)" />)

    const figura = screen.getByRole('figure')
    expect(within(figura).getByRole('blockquote')).toHaveTextContent(quote)
  })

  it('mostra o nome e o contexto na legenda, separados por vírgula no texto', () => {
    render(<Testimonial quote={quote} name="Caio T." context="Professor, Recife (PE)" />)

    // Na tela ficam em linhas diferentes; no texto, sem a vírgula, sairia "Caio T.Professor"
    expect(screen.getByRole('figure')).toHaveTextContent('Caio T., Professor, Recife (PE)')
  })

  it('funciona sem o contexto', () => {
    render(<Testimonial quote={quote} name="Caio T." />)

    expect(screen.getByText('Caio T.')).toBeVisible()
  })

  it('mostra as iniciais num avatar escondido do leitor de tela', () => {
    render(<Testimonial quote={quote} name="Caio T." />)

    expect(screen.getByText('CT')).toHaveAttribute('aria-hidden', 'true')
  })

  it('usa as iniciais do primeiro e do último nome', () => {
    render(<Testimonial quote={quote} name="Maria Aparecida da Silva" />)

    expect(screen.getByText('MS')).toBeInTheDocument()
  })
})
