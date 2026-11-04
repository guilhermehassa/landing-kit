import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { TextField } from './TextField'

const dica = 'Use o e-mail que você mais confere.'
const erro = 'Confira o e-mail. Ele precisa ter o formato nome@exemplo.com.'

describe('TextField', () => {
  it('liga o rótulo ao campo', () => {
    render(<TextField label="Nome" />)

    // getByLabelText só encontra o campo se o <label for> apontar para o id dele
    expect(screen.getByLabelText('Nome')).toBe(screen.getByRole('textbox', { name: 'Nome' }))
  })

  it('liga a dica ao campo pelo aria-describedby', () => {
    render(<TextField label="E-mail" type="email" hint={dica} />)

    const campo = screen.getByRole('textbox', { name: 'E-mail' })
    expect(campo).toHaveAccessibleDescription(dica)
    expect(campo).not.toHaveAttribute('aria-invalid')
  })

  it('com erro: marca aria-invalid e soma o erro à descrição, depois da dica', () => {
    render(<TextField label="E-mail" type="email" hint={dica} error={erro} />)

    const campo = screen.getByRole('textbox', { name: 'E-mail' })
    expect(campo).toHaveAttribute('aria-invalid', 'true')
    // O "Erro:" é texto escondido visualmente: diferencia o erro da dica para quem ouve
    expect(campo).toHaveAccessibleDescription(`${dica} Erro: ${erro}`)
    // O erro é texto na tela, e não só a cor da borda
    expect(screen.getByText(erro)).toBeVisible()
  })

  it('tira o aria-invalid e a mensagem quando o erro some', () => {
    const { rerender } = render(<TextField label="E-mail" hint={dica} error={erro} />)

    rerender(<TextField label="E-mail" hint={dica} />)

    const campo = screen.getByRole('textbox', { name: 'E-mail' })
    expect(campo).not.toHaveAttribute('aria-invalid')
    expect(campo).toHaveAccessibleDescription(dica)
    expect(screen.queryByText(erro)).not.toBeInTheDocument()
  })

  it('mantém o aria-describedby recebido e soma a dica', () => {
    render(
      <>
        <p id="aviso">Nada sai do seu navegador.</p>
        <TextField label="E-mail" hint={dica} aria-describedby="aviso" />
      </>,
    )

    expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveAccessibleDescription(
      `Nada sai do seu navegador. ${dica}`,
    )
  })

  it('usa o id recebido no lugar do gerado', () => {
    render(<TextField label="Nome" id="nome" />)

    expect(screen.getByLabelText('Nome')).toHaveAttribute('id', 'nome')
  })

  it('recebe foco pelo Tab e repassa a digitação para onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TextField label="Nome" onChange={onChange} />)

    await user.tab()
    const campo = screen.getByRole('textbox', { name: 'Nome' })
    expect(campo).toHaveFocus()

    await user.keyboard('Ana')
    expect(onChange).toHaveBeenCalledTimes(3)
    expect(campo).toHaveValue('Ana')
  })

  it('repassa o ref para o <input>, para o formulário focar o primeiro campo inválido', () => {
    const ref = createRef<HTMLInputElement>()
    render(<TextField label="Nome" ref={ref} error="Informe seu nome." />)

    ref.current?.focus()

    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveFocus()
  })
})
