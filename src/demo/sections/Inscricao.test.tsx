import { render, screen, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useInscricao } from '../inscricao/store'
import { limparEventosEnviados } from '../tracking'
import { Inscricao } from './Inscricao'

const nome = 'Maria Silva'
const email = 'maria@exemplo.com'

beforeEach(() => {
  // A store e o registro de eventos são singletons do módulo: zera os dois a cada teste
  useInscricao.setState(useInscricao.getInitialState(), true)
  limparEventosEnviados()
  window.dataLayer = []
})

function renderInscricao(atrasoDoEnvio = 0) {
  const user = userEvent.setup()
  render(<Inscricao onAbrirSobre={vi.fn()} atrasoDoEnvio={atrasoDoEnvio} />)
  return user
}

const campo = (nomeDoCampo: string) => screen.getByRole('textbox', { name: nomeDoCampo })
const lista = (nomeDoCampo: string) => screen.getByRole('combobox', { name: nomeDoCampo })
const botao = (nomeDoBotao: string) => screen.getByRole('button', { name: nomeDoBotao })
const titulo = (texto: string | RegExp) => screen.getByRole('heading', { level: 3, name: texto })

async function preencherEtapa1(user: UserEvent) {
  await user.type(campo('Nome'), nome)
  await user.type(campo('E-mail'), email)
  await user.click(botao('Continuar'))
}

async function preencherEtapa2(user: UserEvent) {
  await user.selectOptions(lista('Sua experiência com fotografia'), 'Sei o básico')
  await user.selectOptions(lista('O que você mais quer fotografar?'), 'Família e amigos')
  await user.click(botao('Continuar'))
}

describe('Inscrição', () => {
  it('começa na etapa 1 sem mover o foco da página', () => {
    renderInscricao()

    expect(titulo('Etapa 1 de 3: Sobre você')).toBeInTheDocument()
    expect(document.body).toHaveFocus()
  })

  describe('etapa 1', () => {
    it('com tudo vazio, mostra os erros nos campos e foca o primeiro', async () => {
      const user = renderInscricao()

      await user.click(botao('Continuar'))

      expect(campo('Nome')).toHaveAttribute('aria-invalid', 'true')
      expect(campo('Nome')).toHaveAccessibleDescription('Erro: Informe seu nome.')
      expect(campo('E-mail')).toHaveAccessibleDescription(
        'Use o e-mail que você mais confere. Erro: Informe seu e-mail.',
      )
      expect(campo('Nome')).toHaveFocus()
      expect(titulo('Etapa 1 de 3: Sobre você')).toBeInTheDocument()
      expect(window.dataLayer).toEqual([])
    })

    it('foca o primeiro campo inválido, mesmo que não seja o primeiro da etapa', async () => {
      const user = renderInscricao()

      await user.type(campo('Nome'), nome)
      await user.type(campo('E-mail'), 'maria@')
      await user.click(botao('Continuar'))

      expect(campo('Nome')).not.toHaveAttribute('aria-invalid')
      expect(campo('E-mail')).toHaveFocus()
      expect(campo('E-mail')).toHaveAccessibleDescription(
        'Use o e-mail que você mais confere. Erro: Confira o e-mail. Ele precisa ter o formato nome@exemplo.com.',
      )
    })

    it('depois do primeiro erro, a mensagem some assim que o valor fica válido', async () => {
      const user = renderInscricao()
      await user.click(botao('Continuar'))

      await user.type(campo('Nome'), 'M')
      expect(campo('Nome')).toHaveAttribute('aria-invalid', 'true')

      await user.type(campo('Nome'), 'a')

      // Ainda no campo, sem esperar o blur
      expect(campo('Nome')).toHaveFocus()
      expect(campo('Nome')).not.toHaveAttribute('aria-invalid')
      expect(screen.queryByText('Informe seu nome.')).not.toBeInTheDocument()
      // O e-mail continua com erro: só o campo que mudou foi revalidado
      expect(campo('E-mail')).toHaveAttribute('aria-invalid', 'true')
    })

    it('depois do primeiro erro, ao sair do campo, mostra o erro do valor novo', async () => {
      const user = renderInscricao()
      await user.click(botao('Continuar'))

      await user.type(campo('Nome'), 'a')
      // Durante a digitação, a mensagem antiga fica: não se acusa erro novo no meio dela
      expect(campo('Nome')).toHaveAccessibleDescription('Erro: Informe seu nome.')

      await user.tab()

      expect(campo('Nome')).toHaveAccessibleDescription(
        'Erro: O nome precisa ter pelo menos 2 letras.',
      )
    })

    it('com dados válidos, avança, foca o título da etapa 2 e marca a 1 como concluída', async () => {
      const user = renderInscricao()

      await preencherEtapa1(user)

      expect(titulo('Etapa 2 de 3: Seu momento')).toHaveFocus()
      const etapas = within(screen.getByRole('list', { name: 'Etapas da inscrição' }))
      const [sobreVoce, seuMomento] = etapas.getAllByRole('listitem')
      expect(sobreVoce).toHaveTextContent('Sobre você (concluída)')
      expect(seuMomento).toHaveAttribute('aria-current', 'step')
    })
  })

  it('Voltar mantém o que foi digitado e foca o título da etapa', async () => {
    const user = renderInscricao()
    await preencherEtapa1(user)

    await user.click(botao('Voltar'))

    expect(titulo('Etapa 1 de 3: Sobre você')).toHaveFocus()
    expect(campo('Nome')).toHaveValue(nome)
    expect(campo('E-mail')).toHaveValue(email)
  })

  it('etapa 2: pede as duas escolhas e foca a primeira', async () => {
    const user = renderInscricao()
    await preencherEtapa1(user)

    await user.click(botao('Continuar'))

    expect(lista('Sua experiência com fotografia')).toHaveFocus()
    expect(lista('Sua experiência com fotografia')).toHaveAccessibleDescription(
      'Erro: Escolha a opção que mais combina com você.',
    )
    expect(lista('O que você mais quer fotografar?')).toHaveAccessibleDescription(
      'Erro: Escolha o que você mais quer fotografar.',
    )
  })

  describe('etapa 3', () => {
    async function irParaEtapa3(user: UserEvent) {
      await preencherEtapa1(user)
      await preencherEtapa2(user)
    }

    it('resume os dados com o texto das opções', async () => {
      const user = renderInscricao()

      await irParaEtapa3(user)

      expect(titulo('Etapa 3 de 3: Plano e confirmação')).toHaveFocus()
      expect(screen.getByRole('heading', { level: 4, name: 'Confira seus dados' })).toBeInTheDocument()
      // Lista de definição: <dt> tem o papel term, e <dd>, definition
      expect(screen.getAllByRole('term').map((termo) => termo.textContent)).toEqual([
        'Nome',
        'E-mail',
        'Experiência',
        'Objetivo',
      ])
      expect(screen.getAllByRole('definition').map((valor) => valor.textContent)).toEqual([
        nome,
        email,
        'Sei o básico',
        'Família e amigos',
      ])
    })

    it('Editar leva à etapa certa, com o foco no título', async () => {
      const user = renderInscricao()
      await irParaEtapa3(user)

      await user.click(botao('Editar experiência e objetivo'))

      expect(titulo('Etapa 2 de 3: Seu momento')).toHaveFocus()
      expect(lista('Sua experiência com fotografia')).toHaveValue('basico')
    })

    it('sem plano, não envia e foca o campo Plano', async () => {
      const user = renderInscricao()
      await irParaEtapa3(user)

      await user.click(botao('Confirmar inscrição'))

      expect(lista('Plano')).toHaveFocus()
      expect(lista('Plano')).toHaveAccessibleDescription('Erro: Escolha um plano.')
    })

    it('mostra "Enviando…" durante o envio simulado', async () => {
      const user = renderInscricao(50)
      await irParaEtapa3(user)
      await user.selectOptions(lista('Plano'), 'completo')

      await user.click(botao('Confirmar inscrição'))

      expect(botao('Enviando…')).toHaveAttribute('aria-disabled', 'true')
      expect(await screen.findByRole('heading', { name: 'Inscrição recebida, Maria!' })).toBeInTheDocument()
    })
  })

  it('fluxo completo: envia, mostra o sucesso e manda o generate_lead sem dado pessoal', async () => {
    const user = renderInscricao()
    await preencherEtapa1(user)
    await preencherEtapa2(user)
    await user.selectOptions(lista('Plano'), 'completo')

    await user.click(botao('Confirmar inscrição'))

    const sucesso = await screen.findByRole('heading', { name: 'Inscrição recebida, Maria!' })
    expect(sucesso).toHaveFocus()
    expect(screen.getByText(/o acesso chegaria agora em maria@exemplo\.com/)).toBeInTheDocument()

    expect(window.dataLayer).toEqual([
      { event: 'form_step_complete', form_name: 'inscricao', step_number: 1, step_name: 'sobre_voce' },
      { event: 'form_step_complete', form_name: 'inscricao', step_number: 2, step_name: 'seu_momento' },
      {
        event: 'generate_lead',
        form_name: 'inscricao',
        currency: 'BRL',
        value: 297,
        lead_source: 'landing_hora_ambar',
        plan_id: 'completo',
      },
    ])
    // Nada do que a pessoa digitou ou respondeu chega ao dataLayer
    const enviado = JSON.stringify(window.dataLayer)
    for (const dadoPessoal of [nome, 'Maria', email, 'basico', 'familia']) {
      expect(enviado).not.toContain(dadoPessoal)
    }
  })

  it('Fazer outra inscrição volta à etapa 1 vazia, com o foco no título', async () => {
    const user = renderInscricao()
    await preencherEtapa1(user)
    await preencherEtapa2(user)
    await user.selectOptions(lista('Plano'), 'essencial')
    await user.click(botao('Confirmar inscrição'))
    await screen.findByRole('heading', { name: 'Inscrição recebida, Maria!' })

    await user.click(botao('Fazer outra inscrição'))

    expect(titulo('Etapa 1 de 3: Sobre você')).toHaveFocus()
    expect(campo('Nome')).toHaveValue('')
  })

  it('o painel começa vazio e mostra o evento da etapa 1, sem o e-mail', async () => {
    const user = renderInscricao()
    const painel = within(screen.getByRole('region', { name: 'Eventos disparados' }))
    expect(painel.getByText(/Nenhum evento ainda/)).toBeInTheDocument()

    await preencherEtapa1(user)

    expect(painel.getByText('form_step_complete')).toBeInTheDocument()
    expect(painel.queryByText(/Nenhum evento ainda/)).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Eventos disparados' })).not.toHaveTextContent(email)
  })
})
