import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { PricingCard } from './PricingCard'

const meta = {
  title: 'Componentes/PricingCard',
  component: PricingCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Card de um plano. O preço é lido por extenso no leitor de tela ("197 reais"). O plano com selo ganha borda e sombra, e o selo é texto: o destaque não depende só da cor. O botão chama `onEscolher`, e quem usa o card decide o que fazer com a escolha.',
      },
    },
  },
  args: {
    name: 'Essencial',
    description: 'Para aprender no seu ritmo.',
    price: 197,
    priceNote: 'À vista ou em até 12 vezes no cartão.',
    features: [
      '24 aulas em vídeo',
      '4 exercícios práticos com gabarito comentado',
      'Guia de bolso em PDF',
      'Certificado de conclusão',
      'Acesso por 12 meses',
    ],
    ctaLabel: 'Escolher o Essencial',
    onEscolher: fn(),
  },
  argTypes: {
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PricingCard>

export default meta
type Story = StoryObj<typeof meta>

/** Plano sem selo: borda decorativa e botão secundário. */
export const Padrao: Story = {}

/** O plano recomendado: selo antes do nome, borda `primary` de 2 px, sombra e o botão principal da seção. */
export const Recomendado: Story = {
  args: {
    name: 'Completo',
    description: 'Para quem quer correção das fotos.',
    price: 297,
    badge: 'Recomendado',
    features: [
      'Tudo do Essencial',
      '4 encontros ao vivo de correção de fotos, em grupo e gravados',
      'Comunidade da turma para trocar fotos',
      'Acesso por 24 meses',
    ],
    ctaLabel: 'Escolher o Completo',
  },
}

/** Sem a condição de pagamento, que é opcional. */
export const SemCondicao: Story = {
  args: { priceNote: undefined },
}

/**
 * Caso difícil: o card a 320 px de largura. O item longo quebra ao lado do ícone, e o
 * botão ocupa a largura toda: se o texto não couber, ele quebra a linha e o botão cresce.
 */
export const Em320px: Story = {
  args: {
    features: [
      '24 aulas em vídeo',
      '4 exercícios práticos com gabarito comentado, com uma versão avançada para quem já fotografa',
      'Acesso por 12 meses',
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
}
