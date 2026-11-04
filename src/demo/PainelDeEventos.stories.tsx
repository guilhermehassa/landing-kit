import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { PainelDeEventos } from './PainelDeEventos'
import { limparEventosEnviados, track } from './tracking'

// Sem autodocs: o registro de eventos é um só para o Storybook inteiro, e a página de
// docs mostraria as duas stories com os mesmos eventos
const meta = {
  title: 'Demonstração/PainelDeEventos',
  component: PainelDeEventos,
  parameters: {
    docs: {
      description: {
        component:
          'Painel da demo que mostra, para quem não abre o console, o que a página envia para o `dataLayer`. Lê o registro do tracking com `useSyncExternalStore`.',
      },
    },
  },
  beforeEach: () => {
    limparEventosEnviados()
    return () => limparEventosEnviados()
  },
} satisfies Meta<typeof PainelDeEventos>

export default meta
type Story = StoryObj<typeof meta>

/** Antes de qualquer evento: o texto diz o que fazer para gerar um. */
export const Vazio: Story = {}

/** Os três tipos de evento da página, do mais recente para o mais antigo. */
export const ComEventos: Story = {
  beforeEach: () => {
    track({
      event: 'select_item',
      ecommerce: {
        currency: 'BRL',
        item_list_id: 'planos',
        item_list_name: 'Planos',
        items: [{ item_id: 'completo', item_name: 'Hora Âmbar Completo', price: 297, index: 1 }],
      },
    })
    track({ event: 'form_step_complete', form_name: 'inscricao', step_number: 1, step_name: 'sobre_voce' })
    track({
      event: 'generate_lead',
      form_name: 'inscricao',
      currency: 'BRL',
      value: 297,
      lead_source: 'landing_hora_ambar',
      plan_id: 'completo',
    })
  },
}

/** Caso difícil: tela de 320 px. O JSON quebra as linhas em vez de rolar para o lado. */
export const ComEventosEm320px: Story = {
  ...ComEventos,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const pagina = canvasElement.ownerDocument.documentElement
    await expect(pagina.scrollWidth).toBeLessThanOrEqual(pagina.clientWidth)
  },
}
