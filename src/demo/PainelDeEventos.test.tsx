import { act, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { PainelDeEventos } from './PainelDeEventos'
import { limparEventosEnviados, track } from './tracking'

beforeEach(() => {
  window.dataLayer = []
  limparEventosEnviados()
})

function etapa(numero: 1 | 2) {
  // act: o track muda um dado de fora do React, e o painel re-renderiza em seguida
  act(() =>
    track({
      event: 'form_step_complete',
      form_name: 'inscricao',
      step_number: numero,
      step_name: numero === 1 ? 'sobre_voce' : 'seu_momento',
    }),
  )
}

describe('PainelDeEventos', () => {
  it('começa vazio, com o texto que explica como gerar eventos', () => {
    render(<PainelDeEventos />)

    expect(
      screen.getByText('Nenhum evento ainda. Escolha um plano ou avance uma etapa do formulário.'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('tem título próprio, que nomeia a região', () => {
    render(<PainelDeEventos />)

    expect(screen.getByRole('region', { name: 'Eventos disparados' })).toBeInTheDocument()
  })

  it('lista cada evento com nome, hora e o payload em JSON', () => {
    render(<PainelDeEventos />)

    etapa(1)

    const [item] = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(item).toBeDefined()
    const evento = within(item!)
    expect(evento.getByText('form_step_complete')).toBeInTheDocument()
    expect(evento.getByText(/^\d{2}:\d{2}:\d{2}$/)).toBeInTheDocument()
    expect(evento.getByText(/"step_name": "sobre_voce"/)).toBeInTheDocument()
  })

  it('mostra o mais recente primeiro', () => {
    render(<PainelDeEventos />)

    etapa(1)
    etapa(2)

    const itens = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(itens).toHaveLength(2)
    expect(itens[0]).toHaveTextContent('"step_number": 2')
    expect(itens[1]).toHaveTextContent('"step_number": 1')
  })

  it('não mostra o { ecommerce: null }, que não é um evento', () => {
    render(<PainelDeEventos />)

    act(() =>
      track({
        event: 'select_item',
        ecommerce: {
          currency: 'BRL',
          item_list_id: 'planos',
          item_list_name: 'Planos',
          items: [{ item_id: 'completo', item_name: 'Hora Âmbar Completo', price: 297, index: 1 }],
        },
      }),
    )

    expect(window.dataLayer).toHaveLength(2)
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(1)
  })
})
