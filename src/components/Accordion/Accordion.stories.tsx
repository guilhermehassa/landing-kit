import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Accordion } from './Accordion'

const meta = {
  title: 'Componentes/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Perguntas frequentes no padrão Accordion do WAI-ARIA APG: cada pergunta é um `<button>` dentro de um título, com `aria-expanded` e `aria-controls`, e a resposta fica numa região ligada ao botão. Várias respostas podem ficar abertas ao mesmo tempo, e todas começam fechadas.',
      },
    },
  },
  args: {
    items: [
      {
        title: 'Preciso de um celular específico?',
        content: (
          <p>
            Não. Qualquer celular com câmera serve. O curso usa só os recursos que todo aparelho
            tem: foco, exposição e o editor que já vem instalado.
          </p>
        ),
      },
      {
        title: 'Preciso ter experiência com fotografia?',
        content: (
          <p>
            Não. O curso começa do zero e explica cada termo técnico antes de usar. Se você já
            fotografa, os exercícios têm uma versão avançada.
          </p>
        ),
      },
      {
        title: 'E se eu não gostar?',
        content: (
          <p>
            Você tem 7 dias de garantia. Se pedir o reembolso nesse prazo, devolvemos o valor
            integral.
          </p>
        ),
      },
    ],
  },
  argTypes: {
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
    items: { control: false },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

/** Todas começam fechadas. Tab passa pelas perguntas; Enter ou Espaço abre e fecha. */
export const Padrao: Story = {}

/**
 * Abre duas perguntas pelo teclado e confere que as duas continuam abertas.
 * Roda como teste no Chromium (`npm test`), e o axe confere o estado aberto.
 */
export const VariasAbertas: Story = {
  play: async ({ canvas, userEvent }) => {
    const primeira = canvas.getByRole('button', { name: 'Preciso de um celular específico?' })
    const segunda = canvas.getByRole('button', { name: 'Preciso ter experiência com fotografia?' })

    await userEvent.click(primeira)
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')

    await expect(primeira).toHaveAttribute('aria-expanded', 'true')
    await expect(segunda).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getAllByRole('region')).toHaveLength(2)
  },
}

/** Numa página em que as perguntas ficam abaixo de um `h3`, o nível desce para 4. */
export const TituloNivel4: Story = {
  args: { headingLevel: 4 },
}

/**
 * Caso difícil: pergunta longa numa coluna de 320 px e resposta com vários parágrafos
 * e uma lista. A seta não encolhe, e a pergunta quebra a linha ao lado dela.
 */
export const TextosLongosEm320px: Story = {
  args: {
    items: [
      {
        title:
          'Quanto tempo por semana vou precisar, e consigo acompanhar se eu trabalhar o dia inteiro e só tiver a noite?',
        content: (
          <>
            <p>
              Cerca de 2 horas: 6 aulas de até 12 minutos e um exercício prático. Você assiste no
              seu ritmo, no horário que quiser.
            </p>
            <p>Uma semana típica de quem trabalha o dia inteiro:</p>
            <ul className="list-disc pl-6">
              <li>uma aula por noite, de segunda a sábado;</li>
              <li>o exercício no fim de semana, com a luz da manhã.</li>
            </ul>
          </>
        ),
      },
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
