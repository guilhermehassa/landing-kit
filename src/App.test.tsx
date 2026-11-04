import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App (demonstração)', () => {
  it('tem um só h1 e um h2 por seção', () => {
    render(<App />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'O que muda nas suas fotos',
      '4 semanas, 4 módulos',
      'Quem já fez o curso',
      'Escolha seu plano',
      'Inscrição',
      'Perguntas frequentes',
      'A luz boa volta todo dia. Comece pela próxima.',
    ])
  })

  it('os títulos do Programa separam a semana do módulo no nome acessível', () => {
    render(<App />)

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
    render(<App />)

    await user.tab()

    const pular = screen.getByRole('link', { name: 'Pular para o conteúdo' })
    expect(pular).toHaveFocus()
    expect(pular).toHaveAttribute('href', `#${screen.getByRole('main').id}`)
  })

  it('escolher um plano mostra o aviso sem tirar o foco do botão', async () => {
    const user = userEvent.setup()
    render(<App />)

    const escolher = screen.getByRole('button', { name: 'Escolher o Completo' })
    await user.click(escolher)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Plano Completo escolhido. Falta só a inscrição.',
    )
    expect(escolher).toHaveFocus()
  })
})
