import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PricingCard, type PricingCardProps } from './PricingCard'

function renderCompleto(props: Partial<PricingCardProps> = {}) {
  const onEscolher = vi.fn()
  render(
    <PricingCard
      name="Completo"
      description="Para quem quer correção das fotos."
      price={297}
      priceNote="À vista ou em até 12 vezes no cartão."
      features={['Tudo do Essencial', 'Comunidade da turma para trocar fotos']}
      badge="Recomendado"
      ctaLabel="Escolher o Completo"
      onEscolher={onEscolher}
      {...props}
    />,
  )
  return { onEscolher }
}

describe('PricingCard', () => {
  it('usa o nome do plano como título de nível 3', () => {
    renderCompleto()

    expect(screen.getByRole('heading', { level: 3, name: 'Completo' })).toBeInTheDocument()
  })

  it('lê o preço por extenso e esconde o visual do leitor de tela', () => {
    renderCompleto()

    expect(screen.getByText('297 reais')).toBeInTheDocument()
    // O Intl põe um espaço não separável depois do "R$". O getByText normaliza o texto da
    // tela (troca qualquer espaço por um comum), mas não o texto esperado: a regex com \s
    // deixa claro que o tipo de espaço não importa aqui
    expect(screen.getByText(/^R\$\s297$/)).toHaveAttribute('aria-hidden', 'true')
  })

  it('mostra o selo em texto', () => {
    renderCompleto()

    expect(screen.getByText('Recomendado')).toBeVisible()
  })

  it('sem selo, não mostra selo', () => {
    renderCompleto({ badge: undefined })

    expect(screen.queryByText('Recomendado')).not.toBeInTheDocument()
  })

  it('lista o que o plano inclui', () => {
    renderCompleto()

    const lista = screen.getByRole('list')
    expect(within(lista).getAllByRole('listitem')).toHaveLength(2)
  })

  it('o botão diz qual plano escolhe e chama onEscolher', async () => {
    const user = userEvent.setup()
    const { onEscolher } = renderCompleto()

    await user.click(screen.getByRole('button', { name: 'Escolher o Completo' }))

    expect(onEscolher).toHaveBeenCalledTimes(1)
  })

  it('o botão funciona pelo teclado, com Enter e com Espaço', async () => {
    const user = userEvent.setup()
    const { onEscolher } = renderCompleto()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Escolher o Completo' })).toHaveFocus()

    await user.keyboard('{Enter}')
    await user.keyboard(' ')

    expect(onEscolher).toHaveBeenCalledTimes(2)
  })
})
