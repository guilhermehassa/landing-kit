import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { expect, waitFor, within } from 'storybook/test'
import {
  previsaoCarregando,
  previsaoComDados,
  previsaoComErro,
  previsaoVazia,
  respostas,
} from '../luz/mocks'
import { chaveDaPrevisao } from '../luz/useLuzHoje'
import { criarQueryClient } from '../queryClient'
import { LuzHoje } from './LuzHoje'

interface ComQueryClientProps {
  children: ReactNode
  /** Põe dados no cache antes da story, como se a página já tivesse buscado. */
  cacheInicial?: (queryClient: QueryClient) => void
}

/** Um QueryClient no estado: ele sobrevive a uma nova renderização da story. */
function ComQueryClient({ children, cacheInicial }: ComQueryClientProps) {
  const [queryClient] = useState(() => {
    // Sem repetição, como nos testes: a story de erro não espera as 3 tentativas
    const novo = criarQueryClient({ retry: false })
    cacheInicial?.(novo)
    return novo
  })

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

// Sem autodocs: a MSW tem um conjunto de handlers só para a página inteira, e a página de
// docs mostraria todas as stories com os handlers da última
const meta = {
  title: 'Demonstração/LuzHoje',
  component: LuzHoje,
  parameters: {
    docs: {
      description: {
        component:
          'Bloco de dados da demo: a hora dourada dos próximos 3 dias em 6 cidades, buscada na Open-Meteo com TanStack Query. Nas stories, a API é simulada pela MSW (`parameters.msw`), com respostas reais gravadas em 04/11/2026, e cada story tem o seu QueryClient.',
      },
    },
    msw: [previsaoComDados()],
  },
  decorators: [
    // A key é o id da story: trocar de story monta um QueryClient novo, sem o cache da anterior
    (Story, { id, parameters }) => (
      <ComQueryClient key={id} cacheInicial={parameters.cacheInicial}>
        <Story />
      </ComQueryClient>
    ),
  ],
} satisfies Meta<typeof LuzHoje>

export default meta
type Story = StoryObj<typeof meta>

/** Os 3 dias de São Paulo. O play espera os dados: o axe confere a seção já preenchida. */
export const ComDados: Story = {
  play: async ({ canvas }) => {
    await canvas.findByRole('list', { name: 'Previsão de São Paulo' })
    await expect(canvas.getByRole('status')).toHaveTextContent(/^Previsão atualizada às/)
  },
}

/** A API não responde: três cards cinza, escondidos do leitor de tela, e a linha de status. */
export const Carregando: Story = {
  parameters: { msw: [previsaoCarregando()] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Carregando a previsão de São Paulo…',
    )
  },
}

/** Erro sem dados: o aviso em vermelho e o botão "Tentar de novo". */
export const Erro: Story = {
  parameters: { msw: [previsaoComErro()] },
  play: async ({ canvas }) => {
    await canvas.findByRole('button', { name: 'Tentar de novo' })
    await expect(canvas.getByRole('status')).toHaveTextContent('Não consegui carregar a previsão.')
  },
}

/**
 * Erro numa atualização: a previsão de São Paulo já estava no cache, mas velha (40 minutos),
 * e a nova busca falhou. Os dias continuam na tela, com a hora dos dados.
 */
export const ErroComDadosAntigos: Story = {
  parameters: {
    msw: [previsaoComErro()],
    cacheInicial: (queryClient: QueryClient) =>
      queryClient.setQueryData(chaveDaPrevisao('sao-paulo'), respostas['sao-paulo'], {
        updatedAt: Date.now() - 40 * 60_000,
      }),
  },
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByRole('status')).toHaveTextContent(/^Não consegui atualizar a previsão/),
    )
    await expect(canvas.getByRole('list', { name: 'Previsão de São Paulo' })).toBeVisible()
  },
}

/** Resposta válida, mas sem dias. */
export const Vazio: Story = {
  parameters: { msw: [previsaoVazia()] },
  play: async ({ canvas }) => {
    await canvas.findByText(
      'Ainda não há previsão para São Paulo. Escolha outra cidade ou volte mais tarde.',
    )
  },
}

/** Manaus, uma hora atrás de Brasília: os horários vêm no fuso da cidade, e não no do navegador. */
export const OutroFuso: Story = {
  play: async ({ canvas, userEvent }) => {
    await canvas.findByRole('list', { name: 'Previsão de São Paulo' })

    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Cidade' }), 'Manaus')

    const lista = await canvas.findByRole('list', { name: 'Previsão de Manaus' })
    const [hoje] = within(lista).getAllByRole('listitem')
    await expect(hoje).toHaveTextContent(/Nascer do sol\s*05:36/)
    await expect(hoje).toHaveTextContent(/Pôr do sol\s*17:50/)
  },
}

/** Caso difícil: tela de 320 px. Os pares do card quebram a linha em vez de vazar para o lado. */
export const ComDadosEm320px: Story = {
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvas, canvasElement }) => {
    await canvas.findByRole('list', { name: 'Previsão de São Paulo' })
    const pagina = canvasElement.ownerDocument.documentElement
    await expect(pagina.scrollWidth).toBeLessThanOrEqual(pagina.clientWidth)
  },
}
