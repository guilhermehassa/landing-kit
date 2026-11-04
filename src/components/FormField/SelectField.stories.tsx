import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectField } from './SelectField'

const opcoesDeNivel = (
  <>
    <option value="">Selecione</option>
    <option value="iniciante">Nunca estudei fotografia</option>
    <option value="basico">Sei o básico</option>
    <option value="frequente">Fotografo com frequência</option>
  </>
)

const meta = {
  title: 'Componentes/SelectField',
  component: SelectField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lista de opções nativa (`<select>`) com o mesmo rótulo, dica e erro do `TextField`. O `<select>` nativo já funciona com teclado e leitor de tela, e no celular abre o seletor do sistema.',
      },
    },
  },
  args: {
    label: 'Sua experiência com fotografia',
    name: 'nivel',
    defaultValue: '',
    children: opcoesDeNivel,
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectField>

export default meta
type Story = StoryObj<typeof meta>

/** Começa em "Selecione" (valor vazio), para a pessoa escolher de propósito. */
export const Padrao: Story = {}

/** O erro aparece ao avançar sem escolher. */
export const ComErro: Story = {
  args: {
    error: 'Escolha a opção que mais combina com você.',
  },
}

/** Com um valor já escolhido, como o seletor de cidade do bloco de dados. */
export const ComValorInicial: Story = {
  args: {
    label: 'Cidade',
    name: 'cidade',
    defaultValue: 'sao-paulo',
    children: (
      <>
        <option value="sao-paulo">São Paulo</option>
        <option value="rio-de-janeiro">Rio de Janeiro</option>
        <option value="belo-horizonte">Belo Horizonte</option>
        <option value="salvador">Salvador</option>
        <option value="porto-alegre">Porto Alegre</option>
        <option value="manaus">Manaus</option>
      </>
    ),
  },
}

/** Caso difícil: opção e erro longos numa coluna de 320 px. O `<select>` não passa da largura da coluna. */
export const TextosLongosEm320px: Story = {
  args: {
    label: 'O que você mais quer fotografar?',
    hint: 'Escolha o principal. Os exercícios do curso trazem uma versão para cada objetivo.',
    error: 'Escolha o que você mais quer fotografar.',
    children: (
      <>
        <option value="">Selecione</option>
        <option value="produtos">Produtos para vender pelas redes sociais, com fundo limpo e luz de janela</option>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
}
