import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, waitFor } from 'storybook/test'
import { Button } from '../Button'
import { Modal, type ModalProps } from './Modal'

// O Modal é controlado: a story guarda o `open` num estado, como a página faria
function ModalComBotao(args: ModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Sobre esta demonstração
      </Button>
      <Modal
        {...args}
        open={open}
        onClose={() => {
          setOpen(false)
          args.onClose()
        }}
      />
    </>
  )
}

const meta = {
  title: 'Componentes/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Janela modal com o `<dialog>` nativo e `showModal()`: o navegador deixa o resto da página inerte, fecha com Esc e devolve o foco a quem abriu. Ao abrir, o foco vai para o título, e o título dá nome ao diálogo (`aria-labelledby`). O Fechar fica num `<form method="dialog">`. As stories começam fechadas: abra pelo botão.',
      },
    },
  },
  render: (args) => <ModalComBotao {...args} />,
  args: {
    open: false,
    onClose: fn(),
    title: 'Sobre esta demonstração',
    children: (
      <>
        <p>
          Hora Âmbar é um curso fictício. Esta página existe para mostrar os componentes do
          landing-kit funcionando juntos.
        </p>
        <p>
          O formulário não envia nada. Os dados ficam só na memória do navegador e somem quando
          você recarrega a página.
        </p>
        <p>Pessoas, depoimentos e preços são inventados.</p>
      </>
    ),
  },
  argTypes: {
    open: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

/** Fechado, com o botão que abre. */
export const Padrao: Story = {}

/**
 * Roda como teste no Chromium (`npm test`), porque o jsdom não implementa `showModal()`.
 *
 * O Esc não é uma tecla de verdade aqui: o user-event dispara eventos sintéticos, e o
 * navegador só fecha o diálogo com uma tecla confiável. A story usa `requestClose()`, o
 * mesmo pedido de fechamento que o navegador faz no Esc. A tecla em si fica para o teste
 * manual com teclado.
 */
export const AbrirEFechar: Story = {
  play: async ({ args, canvas, userEvent, step }) => {
    const abrir = canvas.getByRole('button', { name: 'Sobre esta demonstração' })

    await step('Abrir: o título dá nome ao diálogo e recebe o foco', async () => {
      await userEvent.click(abrir)
      await expect(canvas.getByRole('dialog', { name: 'Sobre esta demonstração' })).toBeVisible()
      await expect(canvas.getByRole('heading', { name: 'Sobre esta demonstração' })).toHaveFocus()
    })

    await step('Tab leva ao Fechar', async () => {
      await userEvent.tab()
      await expect(canvas.getByRole('button', { name: 'Fechar' })).toHaveFocus()
    })

    await step('Fechar fecha o diálogo e devolve o foco a quem abriu', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Fechar' }))
      await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
      await expect(abrir).toHaveFocus()
      // O navegador dispara o evento close numa tarefa seguinte, e não na hora
      await waitFor(() => expect(args.onClose).toHaveBeenCalledTimes(1))
    })

    await step('Pedido de fechamento (o que o Esc faz) também fecha e devolve o foco', async () => {
      await userEvent.click(abrir)
      const dialog = canvas.getByRole<HTMLDialogElement>('dialog')
      dialog.requestClose()
      await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
      await expect(abrir).toHaveFocus()
      await waitFor(() => expect(args.onClose).toHaveBeenCalledTimes(2))
    })
  },
}

/**
 * Caso difícil: tela de 320 × 568 px e texto mais alto que ela. O diálogo rola por dentro
 * e, como o foco vai para o título, abre mostrando o começo do texto, e não o Fechar.
 * Fica aberto no fim, para o axe conferir o estado aberto.
 */
export const TextoLongoEm320px: Story = {
  globals: { viewport: { value: 'mobile1' } },
  args: {
    children: (
      <>
        <p>
          Hora Âmbar é um curso fictício. Esta página existe para mostrar os componentes do
          landing-kit funcionando juntos.
        </p>
        <p>
          O formulário não envia nada. Os dados ficam só na memória do navegador e somem quando
          você recarrega a página.
        </p>
        <p>
          A cada etapa, um evento vai para o <code>dataLayer</code>, sem nome nem e-mail. Você vê
          cada um no painel "Eventos disparados", junto do formulário.
        </p>
        <p>A previsão da luz vem de uma API real e gratuita, a Open-Meteo.</p>
        <p>Pessoas, depoimentos e preços são inventados.</p>
        <p>
          O código e a documentação dos componentes estão no repositório público, com os testes e
          a verificação de acessibilidade de cada um.
        </p>
      </>
    ),
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Sobre esta demonstração' }))

    const dialog = canvas.getByRole<HTMLDialogElement>('dialog')
    // Garante a premissa: o globals de viewport vale também no teste
    await expect(window.innerWidth).toBe(320)
    await expect(canvas.getByRole('heading', { name: 'Sobre esta demonstração' })).toHaveFocus()
    // Rola por dentro, e começa do topo
    await expect(dialog.scrollHeight).toBeGreaterThan(dialog.clientHeight)
    await expect(dialog.scrollTop).toBe(0)
  },
}
