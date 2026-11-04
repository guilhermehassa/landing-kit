import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn } from 'storybook/test'
import { Button } from '../Button'
import { Toast } from './Toast'

const meta = {
  title: 'Componentes/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Aviso curto no pé da tela, anunciado com `role="status"` sem tirar o foco de onde a pessoa está. Some depois de 5 segundos, e a contagem para enquanto o ponteiro ou o foco estão no aviso. Mantenha o Toast montado desde o início e troque só a `message`: a região de status precisa existir antes da mensagem para ser anunciada.',
      },
    },
  },
  args: {
    message: 'Plano Completo escolhido.',
    detail: 'Falta só a inscrição.',
    onClose: fn(),
  },
  argTypes: {
    message: { control: 'text' },
    detail: { control: 'text' },
    duration: { control: 'number' },
  },
  decorators: [
    // O transform cria um bloco de contenção: o Toast, que é `fixed`, fica preso ao
    // quadro da story, e não ao pé da página de docs, onde os de todas as stories se somariam
    (Story) => (
      <div className="relative min-h-32 transform-gpu">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

/** Mensagem e complemento. Aqui o `message` vem dos args, então o aviso não some ao fim do tempo. */
export const Padrao: Story = {}

/** Só a mensagem, sem o complemento. */
export const SemDetalhe: Story = {
  args: { detail: undefined },
}

/** Caso difícil: mensagem longa a 320 px. O texto quebra, e o Fechar não encolhe. */
export const TextoLongoEm320px: Story = {
  args: {
    message: 'Plano Mentoria escolhido, com 2 sessões individuais de 45 minutos por vídeo.',
    detail: 'Falta só a inscrição, que leva menos de 1 minuto.',
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
}

function EscolherPlano() {
  const [message, setMessage] = useState<string | null>(null)

  return (
    <>
      <Button onClick={() => setMessage('Plano Completo escolhido.')}>Escolher o Completo</Button>
      <Toast message={message} detail="Falta só a inscrição." onClose={() => setMessage(null)} />
    </>
  )
}

/**
 * Como na página: o Toast já está montado, vazio, e o clique só troca a mensagem.
 * Roda como teste no Chromium (`npm test`): o foco fica no botão do plano, e o Fechar
 * esvazia a região de status.
 */
export const AoEscolherUmPlano: Story = {
  render: () => <EscolherPlano />,
  play: async ({ canvas, userEvent, step }) => {
    const escolher = canvas.getByRole('button', { name: 'Escolher o Completo' })
    const regiao = canvas.getByRole('status')
    await expect(regiao).toBeEmptyDOMElement()

    await step('Escolher mostra o aviso sem tirar o foco do botão', async () => {
      await userEvent.click(escolher)
      await expect(regiao).toHaveTextContent('Plano Completo escolhido. Falta só a inscrição.')
      await expect(escolher).toHaveFocus()
    })

    await step('Fechar esvazia a região de status', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Fechar' }))
      await expect(regiao).toBeEmptyDOMElement()
    })
  },
}
