import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'Componentes/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Botão para **ações**: enviar o formulário, escolher um plano. Para levar a uma âncora da página (`#inscricao`), use o `ButtonLink`, que tem o mesmo visual.',
      },
    },
  },
  args: {
    children: 'Escolher o Completo',
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'accent'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
    },
    children: {
      control: 'text',
      description: 'Texto do botão. Diga a ação: "Escolher o Completo", e não "Clique aqui".',
    },
    disabled: {
      control: 'boolean',
      description: 'Indisponível. Não esconda informação importante só neste estado.',
    },
    loading: { control: 'boolean' },
    loadingText: { control: 'text' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** A ação principal da seção. Use um só por seção. */
export const Primario: Story = {
  args: { variant: 'primary' },
}

/** A alternativa ao lado da ação principal. */
export const Secundario: Story = {
  args: { variant: 'secondary', children: 'Editar' },
}

/** Âmbar, só sobre a faixa índigo. Navegue com Tab: o anel de foco fica âmbar claro. */
export const Destaque: Story = {
  args: { variant: 'accent', children: 'Quero me inscrever' },
  globals: { surface: 'primary' },
}

/** Para espaço curto, como o cabeçalho. */
export const Pequeno: Story = {
  args: { size: 'sm', children: 'Inscrever-se' },
}

/** Fica fora da exigência de contraste da WCAG; a opacidade só sinaliza o estado. */
export const Desabilitado: Story = {
  args: { disabled: true },
}

/**
 * Troca o texto e ignora cliques, mas continua focável (`aria-disabled` em vez de
 * `disabled`). O contraste fica completo, porque "Enviando…" é informação.
 */
export const Carregando: Story = {
  args: { loading: true, children: 'Confirmar inscrição' },
}

/** Caso difícil: texto longo numa coluna de 320 px. O botão cresce para baixo e não vaza. */
export const TextoLongo: Story = {
  args: {
    children: 'Quero me inscrever no plano Completo, com correção das minhas fotos',
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
}
