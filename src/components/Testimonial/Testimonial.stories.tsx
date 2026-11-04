import type { Meta, StoryObj } from '@storybook/react-vite'
import { Testimonial } from './Testimonial'

const meta = {
  title: 'Componentes/Testimonial',
  component: Testimonial,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Depoimento com autoria, marcado com `<figure>`, `<blockquote>` e `<figcaption>`. O avatar mostra as iniciais, calculadas a partir do nome, e é decorativo (`aria-hidden`), porque o nome já está na legenda. Sem nota em estrelas.',
      },
    },
  },
  args: {
    quote:
      'Eu fotografava os bolos à noite, com a luz da cozinha. Depois do módulo de luz de janela, passei a fotografar de manhã, perto da janela, e as fotos pararam de sair amareladas.',
    name: 'Renata M.',
    context: 'Confeiteira, Campinas (SP)',
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Testimonial>

export default meta
type Story = StoryObj<typeof meta>

/** Depoimento com nome e contexto. */
export const Padrao: Story = {}

/** Sem o contexto, que é opcional: a legenda fica só com o nome. */
export const SemContexto: Story = {
  args: { context: undefined },
}

/** Nome com várias partes: as iniciais usam o primeiro e o último nome ("MS"). */
export const NomeComposto: Story = {
  args: {
    name: 'Maria Aparecida da Silva',
    context: 'Artesã, Belém (PA)',
  },
}

/** Caso difícil: depoimento longo numa coluna de 320 px. O texto quebra, e o avatar não encolhe. */
export const TextoLongoEm320px: Story = {
  args: {
    quote:
      'As aulas curtas cabem no intervalo do almoço. Fiz os exercícios com meus filhos de modelo, e hoje as fotos da família ficam bonitas sem eu pedir para todo mundo sorrir. Depois, refiz os exercícios com as fotos dos produtos que vendo nas redes sociais, e a diferença apareceu já na primeira semana.',
    context: 'Enfermeira e artesã nos fins de semana, Londrina (PR)',
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
}
