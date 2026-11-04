import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Toast } from './Toast'

const mensagem = 'Plano Completo escolhido.'
const detalhe = 'Falta só a inscrição.'

describe('Toast', () => {
  // Timers falsos: o teste avança o relógio na mão, sem esperar 5 s de verdade.
  // shouldAdvanceTime: depois de cada ação do user-event, o RTL espera um setTimeout(0),
  // e só avança o relógio falso sozinho quando o runner é o Jest. Com o Vitest, o relógio
  // precisa andar também com o tempo real, ou essa espera nunca termina. Entre linhas
  // síncronas o relógio não anda, então as contas de 4999 + 1 ms continuam exatas
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function setupUser() {
    // O user-event também espera entre as ações: precisa avançar o relógio falso
    return userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  }

  it('a região de status já existe, vazia, antes da mensagem', () => {
    const { rerender } = render(<Toast message={null} onClose={vi.fn()} />)
    const regiao = screen.getByRole('status')
    expect(regiao).toBeEmptyDOMElement()

    rerender(<Toast message={mensagem} detail={detalhe} onClose={vi.fn()} />)

    // A mesma região, que só trocou de conteúdo: é a troca que o leitor de tela anuncia
    expect(screen.getByRole('status')).toBe(regiao)
    expect(regiao).toHaveTextContent(`${mensagem} ${detalhe}`)
  })

  it('não tira o foco de onde a pessoa está', () => {
    const { rerender } = render(
      <>
        <button type="button">Escolher o Completo</button>
        <Toast message={null} onClose={vi.fn()} />
      </>,
    )
    const escolher = screen.getByRole('button', { name: 'Escolher o Completo' })
    escolher.focus()

    rerender(
      <>
        <button type="button">Escolher o Completo</button>
        <Toast message={mensagem} onClose={vi.fn()} />
      </>,
    )

    expect(escolher).toHaveFocus()
  })

  it('deixa o botão Fechar fora do anúncio', () => {
    render(<Toast message={mensagem} onClose={vi.fn()} />)

    expect(screen.getByRole('status')).not.toHaveTextContent('Fechar')
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument()
  })

  it('chama onClose depois de 5 s', () => {
    const onClose = vi.fn()
    render(<Toast message={mensagem} onClose={onClose} />)

    vi.advanceTimersByTime(4999)
    expect(onClose).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('o botão Fechar chama onClose', async () => {
    const user = setupUser()
    const onClose = vi.fn()
    render(<Toast message={mensagem} onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('para a contagem enquanto o foco está no aviso', async () => {
    const user = setupUser()
    const onClose = vi.fn()
    render(<Toast message={mensagem} onClose={onClose} />)

    await user.tab()
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus()
    vi.advanceTimersByTime(10_000)
    expect(onClose).not.toHaveBeenCalled()

    // O foco sai, e a contagem recomeça do zero
    await user.tab()
    vi.advanceTimersByTime(5000)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('para a contagem enquanto o ponteiro está sobre o aviso', async () => {
    const user = setupUser()
    const onClose = vi.fn()
    render(<Toast message={mensagem} onClose={onClose} />)

    await user.hover(screen.getByText(mensagem))
    vi.advanceTimersByTime(10_000)
    expect(onClose).not.toHaveBeenCalled()

    await user.unhover(screen.getByText(mensagem))
    vi.advanceTimersByTime(5000)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('some quando a mensagem volta a ser null', () => {
    const { rerender } = render(<Toast message={mensagem} onClose={vi.fn()} />)

    rerender(<Toast message={null} onClose={vi.fn()} />)

    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.queryByRole('button', { name: 'Fechar' })).not.toBeInTheDocument()
  })

  it('um onClose novo a cada render não recomeça a contagem', () => {
    const onClose = vi.fn()
    const { rerender } = render(<Toast message={mensagem} onClose={() => onClose()} />)

    vi.advanceTimersByTime(3000)
    rerender(<Toast message={mensagem} onClose={() => onClose()} />)
    vi.advanceTimersByTime(2000)

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
