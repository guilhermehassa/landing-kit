import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { describe, expect, it } from 'vitest'
import { renderComQuery } from '@/test/renderComQuery'
import { server } from '@/test/server'
import { cidades, type CidadeId } from '../luz/cidades'
import { previsaoComDados, previsaoComErro, previsaoVazia, respostas } from '../luz/mocks'
import { urlDaPrevisao } from '../luz/previsao'
import { chaveDaPrevisao } from '../luz/useLuzHoje'
import { criarQueryClient } from '../queryClient'
import { LuzHoje } from './LuzHoje'

// A rede é a MSW de src/test/server.ts: por padrão, cada cidade responde com a previsão
// gravada. Cada render cria um QueryClient novo (renderComQuery), sem cache de outro teste

const status = () => screen.getByRole('status')
const campoCidade = () => screen.getByRole('combobox', { name: 'Cidade' })
const listaDe = (cidade: string) => screen.findByRole('list', { name: `Previsão de ${cidade}` })

/** Os pares do card, como o leitor de tela lê: { 'Nascer do sol': '05:18', ... } */
function dadosDoCard(card: HTMLElement) {
  const termos = within(card).getAllByRole('term')
  const valores = within(card).getAllByRole('definition')
  return Object.fromEntries(termos.map((termo, i) => [termo.textContent, valores[i]?.textContent]))
}

describe('LuzHoje', () => {
  it('mostra o carregamento e, depois, os 3 dias de São Paulo', async () => {
    renderComQuery(<LuzHoje />)

    expect(status()).toHaveTextContent('Carregando a previsão de São Paulo…')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()

    const [hoje, amanha, depois] = within(await listaDe('São Paulo')).getAllByRole('listitem')
    expect(within(hoje!).getByRole('heading', { level: 3 })).toHaveTextContent('Hoje')
    expect(dadosDoCard(hoje!)).toEqual({
      'Nascer do sol': '05:18',
      'Pôr do sol': '18:21',
      'Hora dourada da manhã': '05:18 às 06:18',
      'Hora dourada da tarde': '17:21 às 18:21',
      'Nuvens (média do dia)': '79%',
      Chuva: '25%',
    })
    expect(hoje).toHaveTextContent('Céu carregado: a luz deve ficar suave e sem cor.')
    expect(within(amanha!).getByRole('heading', { level: 3 })).toHaveTextContent('Amanhã')
    expect(within(depois!).getByRole('heading', { level: 3 })).toHaveTextContent(
      'Sexta-feira, 6 de nov.',
    )
    expect(status()).toHaveTextContent(/^Previsão atualizada às \d{2}:\d{2}\.$/)
  })

  it('erro sem dados: avisa e, com "Tentar de novo", mostra os dias', async () => {
    server.use(previsaoComErro())
    const user = userEvent.setup()
    renderComQuery(<LuzHoje />)

    await waitFor(() => expect(status()).toHaveTextContent('Não consegui carregar a previsão.'))
    expect(
      screen.getByText(
        'Pode ser a sua conexão ou o serviço de previsão. Tente de novo em instantes.',
      ),
    ).toBeInTheDocument()

    // A API volta a responder
    server.use(previsaoComDados())
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }))

    expect(await listaDe('São Paulo')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tentar de novo' })).not.toBeInTheDocument()
  })

  it('erro ao atualizar: mantém os dias antigos e diz de quando eles são', async () => {
    // São Paulo já está no cache, mas de 40 minutos atrás: passou do staleTime, e a seção
    // busca de novo ao montar. A nova busca falha
    const queryClient = criarQueryClient({ retry: false })
    const quarentaMinutosAtras = Date.now() - 40 * 60_000
    queryClient.setQueryData(chaveDaPrevisao('sao-paulo'), respostas['sao-paulo'], {
      updatedAt: quarentaMinutosAtras,
    })
    server.use(previsaoComErro())
    renderComQuery(<LuzHoje />, queryClient)

    expect(status()).toHaveTextContent('Atualizando…')

    const hora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(
      quarentaMinutosAtras,
    )
    await waitFor(() =>
      expect(status()).toHaveTextContent(
        `Não consegui atualizar a previsão. Você está vendo os dados das ${hora}.`,
      ),
    )
    // O erro não apaga os dados que ainda servem
    expect(await listaDe('São Paulo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeInTheDocument()
  })

  it('vazio: avisa que ainda não há previsão para a cidade', async () => {
    server.use(previsaoVazia())
    renderComQuery(<LuzHoje />)

    await waitFor(() =>
      expect(status()).toHaveTextContent(
        'Ainda não há previsão para São Paulo. Escolha outra cidade ou volte mais tarde.',
      ),
    )
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('troca de cidade: mostra a cidade nova, nos horários do fuso dela', async () => {
    const user = userEvent.setup()
    renderComQuery(<LuzHoje />)
    await listaDe('São Paulo')

    await user.selectOptions(campoCidade(), 'Manaus')

    // Sem placeholderData: os dias de São Paulo não ficam na tela enquanto Manaus carrega
    expect(screen.queryByRole('list', { name: 'Previsão de São Paulo' })).not.toBeInTheDocument()
    const [hoje] = within(await listaDe('Manaus')).getAllByRole('listitem')
    // Manaus fica uma hora atrás de Brasília: os horários vêm no fuso da cidade
    expect(dadosDoCard(hoje!)).toMatchObject({ 'Nascer do sol': '05:36', 'Pôr do sol': '17:50' })
    expect(hoje).toHaveTextContent('Chuva provável. Bom dia para treinar luz de janela.')
  })

  it('trocar de cidade no meio da busca cancela a anterior e mostra o carregamento da nova', async () => {
    const canceladas: CidadeId[] = []
    // Nenhuma busca termina, e cada uma avisa quando é cancelada
    server.use(
      http.get(urlDaPrevisao, async ({ request }) => {
        const latitude = Number(new URL(request.url).searchParams.get('latitude'))
        const cidade = cidades.find((item) => item.latitude === latitude)
        request.signal.addEventListener('abort', () => cidade && canceladas.push(cidade.id))
        await delay('infinite')
      }),
    )
    const user = userEvent.setup()
    renderComQuery(<LuzHoje />)

    await user.selectOptions(campoCidade(), 'Rio de Janeiro')

    expect(status()).toHaveTextContent('Carregando a previsão de Rio de Janeiro…')
    await waitFor(() => expect(canceladas).toEqual(['sao-paulo']))
  })

  it('cache: São Paulo → Salvador → São Paulo faz só 2 requisições', async () => {
    const pedidas: CidadeId[] = []
    server.use(previsaoComDados((cidade) => pedidas.push(cidade.id)))
    const user = userEvent.setup()
    renderComQuery(<LuzHoje />)
    await listaDe('São Paulo')

    await user.selectOptions(campoCidade(), 'Salvador')
    await listaDe('Salvador')
    await user.selectOptions(campoCidade(), 'São Paulo')

    // Dentro do staleTime, a volta vem do cache: aparece na hora, sem nova busca em andamento
    expect(screen.getByRole('list', { name: 'Previsão de São Paulo' })).toBeInTheDocument()
    expect(status()).toHaveTextContent(/^Previsão atualizada às/)
    expect(pedidas).toEqual(['sao-paulo', 'salvador'])
  })
})
