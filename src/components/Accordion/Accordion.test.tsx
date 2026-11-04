import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Accordion, type AccordionItemData } from './Accordion'

const items: AccordionItemData[] = [
  {
    title: 'Preciso de um celular específico?',
    content: <p>Não. Qualquer celular com câmera serve.</p>,
  },
  {
    title: 'Tem certificado?',
    content: <p>Sim. Ao concluir as 24 aulas e os 4 exercícios, você recebe um certificado.</p>,
  },
]

function pergunta(nome: string) {
  return screen.getByRole('button', { name: nome })
}

describe('Accordion', () => {
  it('põe cada pergunta num botão dentro de um título de nível 3', () => {
    render(<Accordion items={items} />)

    const titulo = screen.getByRole('heading', { level: 3, name: 'Tem certificado?' })
    expect(within(titulo).getByRole('button', { name: 'Tem certificado?' })).toBeInTheDocument()
  })

  it('aceita outro nível de título', () => {
    render(<Accordion items={items} headingLevel={2} />)

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2)
  })

  it('começa com todas as respostas fechadas', () => {
    render(<Accordion items={items} />)

    for (const { title } of items) {
      expect(pergunta(title)).toHaveAttribute('aria-expanded', 'false')
    }
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(screen.getByText('Não. Qualquer celular com câmera serve.')).not.toBeVisible()
  })

  it('abre com o clique, numa região nomeada pela pergunta e ligada ao botão', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)

    await user.click(pergunta('Tem certificado?'))

    const botao = pergunta('Tem certificado?')
    const resposta = screen.getByRole('region', { name: 'Tem certificado?' })
    expect(botao).toHaveAttribute('aria-expanded', 'true')
    expect(botao).toHaveAttribute('aria-controls', resposta.id)
    expect(within(resposta).getByText(/você recebe um certificado/)).toBeVisible()
  })

  it('abre com Enter e fecha com Espaço, pelo teclado', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)

    await user.tab()
    const botao = pergunta('Preciso de um celular específico?')
    expect(botao).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(botao).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard(' ')
    expect(botao).toHaveAttribute('aria-expanded', 'false')
  })

  it('deixa várias respostas abertas ao mesmo tempo', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)

    await user.click(pergunta('Preciso de um celular específico?'))
    await user.click(pergunta('Tem certificado?'))

    expect(screen.getAllByRole('region')).toHaveLength(2)
  })

  it('Tab vai de uma pergunta para a outra', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)

    await user.tab()
    await user.tab()

    expect(pergunta('Tem certificado?')).toHaveFocus()
  })
})
