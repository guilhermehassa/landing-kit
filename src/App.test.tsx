import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useInscricao } from '@/demo/inscricao/store'
import { limparEventosEnviados } from '@/demo/tracking'
import { renderComQuery } from '@/test/renderComQuery'
import { App } from './App'

// O App tem a seção da previsão, que usa o TanStack Query. A Open-Meteo responde pela
// MSW (src/test/server.ts), com a resposta gravada
const renderApp = () => renderComQuery(<App />)

beforeEach(() => {
  // A store e o registro de eventos são singletons do módulo: zera os dois a cada teste
  useInscricao.setState(useInscricao.getInitialState(), true)
  limparEventosEnviados()
  window.dataLayer = []
})

describe('App (demonstração)', () => {
  it('tem um só h1 e um h2 por seção', () => {
    renderApp()

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'O que muda nas suas fotos',
      'Onde está a luz hoje?',
      '4 semanas, 4 módulos',
      'Quem já fez o curso',
      'Escolha seu plano',
      'Inscrição',
      'Perguntas frequentes',
      'A luz boa volta todo dia. Comece pela próxima.',
    ])
  })

  it('os títulos do Programa separam a semana do módulo no nome acessível', () => {
    renderApp()

    // Na tela, "Semana 1" e "Ler a luz" ficam em linhas diferentes, sem nada entre eles
    expect(
      screen.getByRole('heading', { level: 3, name: 'Semana 1: Ler a luz' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Semana 4: Edição no celular' }),
    ).toBeInTheDocument()
  })

  it('o primeiro Tab chega ao "Pular para o conteúdo", que leva ao <main>', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.tab()

    const pular = screen.getByRole('link', { name: 'Pular para o conteúdo' })
    expect(pular).toHaveFocus()
    expect(pular).toHaveAttribute('href', `#${screen.getByRole('main').id}`)
  })

  it('escolher um plano mostra o aviso sem tirar o foco do botão', async () => {
    const user = userEvent.setup()
    renderApp()

    const escolher = screen.getByRole('button', { name: 'Escolher o Completo' })
    await user.click(escolher)

    // A página tem duas regiões de status: a do aviso e a da previsão da luz
    const aviso = screen.getByText('Plano Completo escolhido.').closest('[role="status"]')
    expect(aviso).toHaveTextContent('Plano Completo escolhido. Falta só a inscrição.')
    expect(escolher).toHaveFocus()
  })

  it('escolher um plano manda o select_item, precedido da limpeza do ecommerce', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Escolher a Mentoria' }))

    expect(window.dataLayer).toEqual([
      { ecommerce: null },
      {
        event: 'select_item',
        ecommerce: {
          currency: 'BRL',
          item_list_id: 'planos',
          item_list_name: 'Planos',
          items: [{ item_id: 'mentoria', item_name: 'Hora Âmbar Mentoria', price: 697, index: 2 }],
        },
      },
    ])
  })

  it('o plano escolhido no card aparece no formulário e já vem marcado na etapa 3', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Escolher o Completo' }))

    expect(
      screen.getByText('Plano escolhido: Completo. Você pode trocar na etapa 3.'),
    ).toBeInTheDocument()

    await user.type(screen.getByRole('textbox', { name: 'Nome' }), 'Maria')
    await user.type(screen.getByRole('textbox', { name: 'E-mail' }), 'maria@exemplo.com')
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Sua experiência com fotografia' }),
      'iniciante',
    )
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'O que você mais quer fotografar?' }),
      'viagens',
    )
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByRole('combobox', { name: 'Plano' })).toHaveValue('completo')
  })
})
