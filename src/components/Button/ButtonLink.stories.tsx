import type { Meta, StoryObj } from '@storybook/react-vite'
import { ButtonLink } from './ButtonLink'

const meta = {
  title: 'Componentes/ButtonLink',
  component: ButtonLink,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Link com o visual do Botão, para CTAs que **navegam** até uma âncora. Link navega e botão executa ação: por isso não há estado desabilitado nem de carregamento aqui.',
      },
    },
  },
  args: {
    href: '#inscricao',
    children: 'Quero me inscrever',
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
    href: {
      control: 'text',
      description: 'Obrigatório: um `<a>` sem `href` não é link nem recebe foco pelo teclado.',
    },
    children: { control: 'text' },
  },
} satisfies Meta<typeof ButtonLink>

export default meta
type Story = StoryObj<typeof meta>

/** CTA principal do hero e do cabeçalho. */
export const Primario: Story = {
  args: { variant: 'primary' },
}

/** CTA secundário do hero. */
export const Secundario: Story = {
  args: { variant: 'secondary', href: '#planos', children: 'Ver os planos' },
}

/** Botão "Inscrever-se" do cabeçalho. */
export const Pequeno: Story = {
  args: { size: 'sm', children: 'Inscrever-se' },
}

/** CTA da faixa índigo da chamada final, com o foco âmbar claro. */
export const Destaque: Story = {
  args: { variant: 'accent' },
  globals: { surface: 'primary' },
}
