import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { limparEventosEnviados } from '../tracking'
import { FormularioInscricao } from './FormularioInscricao'
import { useInscricao } from './store'

const dadosPreenchidos = {
  nome: 'Maria Silva',
  email: 'maria@exemplo.com',
  nivel: 'basico',
  objetivo: 'familia',
  plano: 'completo',
}

// Sem autodocs: a store é uma só para o Storybook inteiro, e a página de docs mostraria
// todas as stories no mesmo estado. Cada story zera a store e monta o estado que mostra
const meta = {
  title: 'Demonstração/FormularioInscricao',
  component: FormularioInscricao,
  parameters: {
    docs: {
      description: {
        component:
          'Formulário de inscrição em 3 etapas da demo. O estado fica na store do Zustand, cada etapa valida com o Zod ao avançar, e o envio é simulado.',
      },
    },
  },
  args: {
    atrasoDoEnvio: 800,
  },
  beforeEach: () => {
    useInscricao.setState(useInscricao.getInitialState(), true)
    limparEventosEnviados()
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormularioInscricao>

export default meta
type Story = StoryObj<typeof meta>

/** O começo: etapa 1, sem plano escolhido. */
export const Etapa1: Story = {}

/**
 * "Continuar" com tudo vazio: as mensagens aparecem, os campos ficam com `aria-invalid`,
 * e o foco vai para o Nome. Roda como teste no Chromium, e o axe confere o estado de erro.
 */
export const ErrosNaEtapa1: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }))

    const nome = canvas.getByRole('textbox', { name: 'Nome' })
    await expect(nome).toHaveFocus()
    await expect(nome).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByText('Informe seu e-mail.')).toBeVisible()
  },
}

/** Etapa 3 com o plano vindo do card: o resumo mostra o texto das opções. */
export const Etapa3: Story = {
  beforeEach: () => {
    useInscricao.setState({ etapa: 3, dados: dadosPreenchidos })
  },
}

/** Durante o envio simulado: o botão vira "Enviando…", e Voltar e Editar ficam desabilitados. */
export const Enviando: Story = {
  beforeEach: () => {
    useInscricao.setState({ etapa: 3, dados: dadosPreenchidos, status: 'enviando' })
  },
}

/** A tela de sucesso, com o primeiro nome. */
export const Sucesso: Story = {
  beforeEach: () => {
    useInscricao.setState({ etapa: 3, dados: dadosPreenchidos, status: 'concluido' })
  },
}

/** Caso difícil: tela de 320 px, com nome e e-mail longos no resumo. Nada vaza para o lado. */
export const Etapa3Em320px: Story = {
  globals: { viewport: { value: 'mobile1' } },
  beforeEach: () => {
    useInscricao.setState({
      etapa: 3,
      dados: {
        ...dadosPreenchidos,
        nome: 'Maria Aparecida dos Santos Albuquerque',
        email: 'maria.aparecida.albuquerque@exemplo.com.br',
      },
    })
  },
  play: async ({ canvasElement }) => {
    const pagina = canvasElement.ownerDocument.documentElement
    await expect(pagina.scrollWidth).toBeLessThanOrEqual(pagina.clientWidth)
  },
}
