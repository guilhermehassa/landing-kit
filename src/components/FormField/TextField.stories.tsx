import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextField } from './TextField'

const meta = {
  title: 'Componentes/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo de texto com rótulo, dica e erro ligados ao `<input>` (`<label for>`, `aria-describedby` e `aria-invalid`). O erro tem ícone e texto, e não só a borda vermelha. Para lista de opções, use o `SelectField`.',
      },
    },
  },
  args: {
    label: 'Nome',
    name: 'nome',
    autoComplete: 'name',
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: {
      control: 'text',
      description:
        'Mensagem de erro. Diga como corrigir ("Confira o e-mail…"), e não só que está errado.',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

/** Só o rótulo. */
export const Padrao: Story = {}

/** A dica fica entre o rótulo e o campo, e o leitor de tela a lê ao focar o campo. */
export const ComDica: Story = {
  args: {
    label: 'E-mail',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
    hint: 'Use o e-mail que você mais confere.',
  },
}

/** A dica continua, e o erro entra depois dela, na tela e no `aria-describedby`. */
export const ComErro: Story = {
  args: {
    ...ComDica.args,
    defaultValue: 'maria@',
    error: 'Confira o e-mail. Ele precisa ter o formato nome@exemplo.com.',
  },
}

/** Caso difícil: rótulo, dica e erro longos numa coluna de 320 px. Tudo quebra a linha, e o ícone fica na primeira. */
export const TextosLongosEm320px: Story = {
  args: {
    label: 'Nome completo, como deve aparecer no certificado de conclusão',
    hint: 'Confira acentos e sobrenomes. O certificado é emitido com este nome e não pode ser corrigido depois.',
    error: 'O nome precisa ter pelo menos 2 letras.',
    defaultValue: 'a',
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
}
