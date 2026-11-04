import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { FormEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

// O handler impede a navegação do jsdom; o que importa é saber se o envio aconteceu
function submitSpy() {
  return vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault())
}

describe('Button', () => {
  it('chama onClick ao ser clicado', async () => {
    // userEvent, e não fireEvent: simula a sequência real (ponteiro, foco, clique)
    // e respeita o que o navegador faria, como ignorar clique em botão desabilitado
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Escolher o Completo</Button>)

    // getByRole com o nome acessível: busca como o leitor de tela encontra o botão,
    // e quebra se a acessibilidade quebrar
    await user.click(screen.getByRole('button', { name: 'Escolher o Completo' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('é ativado pelo teclado, com Enter e com Espaço', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Escolher o Completo</Button>)

    await user.tab()
    expect(screen.getByRole('button', { name: 'Escolher o Completo' })).toHaveFocus()

    await user.keyboard('{Enter}')
    await user.keyboard(' ')

    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('não envia o formulário com o type padrão', async () => {
    const user = userEvent.setup()
    const onSubmit = submitSpy()
    render(
      <form onSubmit={onSubmit}>
        <Button>Editar</Button>
      </form>,
    )

    await user.click(screen.getByRole('button', { name: 'Editar' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('envia o formulário com type="submit"', async () => {
    // Controle dos testes de carregamento: prova que o envio é detectado quando acontece
    const user = userEvent.setup()
    const onSubmit = submitSpy()
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit">Confirmar inscrição</Button>
      </form>,
    )

    await user.click(screen.getByRole('button', { name: 'Confirmar inscrição' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  describe('desabilitado', () => {
    it('não chama onClick', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Button disabled onClick={onClick}>
          Escolher o Essencial
        </Button>,
      )

      await user.click(screen.getByRole('button', { name: 'Escolher o Essencial' }))

      expect(onClick).not.toHaveBeenCalled()
    })

    it('sai da ordem de tabulação', async () => {
      const user = userEvent.setup()
      render(
        <>
          <Button disabled>Escolher o Essencial</Button>
          <Button>Escolher o Completo</Button>
        </>,
      )

      await user.tab()

      expect(screen.getByRole('button', { name: 'Escolher o Completo' })).toHaveFocus()
    })
  })

  describe('carregando, com type="submit" num formulário', () => {
    function renderLoadingForm() {
      const onSubmit = submitSpy()
      const onClick = vi.fn()
      render(
        <form onSubmit={onSubmit}>
          <label>
            Nome
            <input name="nome" />
          </label>
          <Button type="submit" loading onClick={onClick}>
            Confirmar inscrição
          </Button>
        </form>,
      )
      return { onSubmit, onClick }
    }

    it('mostra o texto de carregamento e expõe aria-disabled', () => {
      renderLoadingForm()

      // O nome acessível muda junto com o texto visível
      const button = screen.getByRole('button', { name: 'Enviando…' })
      expect(button).toHaveAttribute('aria-disabled', 'true')
      expect(screen.queryByRole('button', { name: 'Confirmar inscrição' })).not.toBeInTheDocument()
    })

    it('ignora o clique: não chama onClick nem envia o formulário', async () => {
      const user = userEvent.setup()
      const { onSubmit, onClick } = renderLoadingForm()

      await user.click(screen.getByRole('button', { name: 'Enviando…' }))

      expect(onClick).not.toHaveBeenCalled()
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('Enter num campo não envia o formulário', async () => {
      // O navegador envia o form com Enter num campo "clicando" no botão de envio.
      // aria-disabled não impede isso; quem impede é o handler do Button
      const user = userEvent.setup()
      const { onSubmit, onClick } = renderLoadingForm()

      await user.type(screen.getByLabelText('Nome'), 'Ana{Enter}')

      expect(onClick).not.toHaveBeenCalled()
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('continua focável pelo teclado', async () => {
      const user = userEvent.setup()
      renderLoadingForm()

      await user.tab() // campo Nome
      await user.tab()

      expect(screen.getByRole('button', { name: 'Enviando…' })).toHaveFocus()
    })
  })
})
