import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { cidades, type Cidade, type CidadeId } from './cidades'
import { urlDaPrevisao, type Previsao } from './previsao'

// A Open-Meteo simulada, para os testes (jsdom) e as stories. A página nunca importa daqui

const dias = ['2026-11-04', '2026-11-05', '2026-11-06']

/** Respostas reais da Open-Meteo em 04/11/2026, só com os campos que a página lê. */
export const respostas = {
  'sao-paulo': {
    daily: {
      time: dias,
      sunrise: ['2026-11-04T05:18', '2026-11-05T05:18', '2026-11-06T05:17'],
      sunset: ['2026-11-04T18:21', '2026-11-05T18:22', '2026-11-06T18:22'],
      cloud_cover_mean: [79, 99, 77],
      precipitation_probability_max: [25, 89, 80],
    },
  },
  'rio-de-janeiro': {
    daily: {
      time: dias,
      sunrise: ['2026-11-04T05:05', '2026-11-05T05:05', '2026-11-06T05:04'],
      sunset: ['2026-11-04T18:07', '2026-11-05T18:07', '2026-11-06T18:08'],
      cloud_cover_mean: [41, 86, 94],
      precipitation_probability_max: [16, 49, 27],
    },
  },
  'belo-horizonte': {
    daily: {
      time: dias,
      sunrise: ['2026-11-04T05:12', '2026-11-05T05:12', '2026-11-06T05:11'],
      sunset: ['2026-11-04T18:06', '2026-11-05T18:06', '2026-11-06T18:07'],
      cloud_cover_mean: [47, 70, 97],
      precipitation_probability_max: [53, 59, 88],
    },
  },
  salvador: {
    daily: {
      time: dias,
      sunrise: ['2026-11-04T04:59', '2026-11-05T04:59', '2026-11-06T04:58'],
      sunset: ['2026-11-04T17:35', '2026-11-05T17:36', '2026-11-06T17:36'],
      cloud_cover_mean: [56, 50, 41],
      precipitation_probability_max: [22, 14, 2],
    },
  },
  'porto-alegre': {
    daily: {
      time: dias,
      sunrise: ['2026-11-04T05:27', '2026-11-05T05:26', '2026-11-06T05:26'],
      sunset: ['2026-11-04T18:49', '2026-11-05T18:50', '2026-11-06T18:51'],
      cloud_cover_mean: [96, 49, 3],
      precipitation_probability_max: [100, 43, 22],
    },
  },
  // Horários de Manaus (America/Manaus), uma hora atrás de Brasília
  manaus: {
    daily: {
      time: dias,
      sunrise: ['2026-11-04T05:36', '2026-11-05T05:36', '2026-11-06T05:36'],
      sunset: ['2026-11-04T17:50', '2026-11-05T17:50', '2026-11-06T17:50'],
      cloud_cover_mean: [69, 63, 41],
      precipitation_probability_max: [88, 74, 41],
    },
  },
} satisfies Record<CidadeId, Previsao>

/**
 * Responde com a previsão da cidade pedida. A MSW casa só o caminho e ignora a query
 * string, então a cidade sai da latitude. `aoPedir` deixa o teste contar as requisições.
 */
export function previsaoComDados(aoPedir?: (cidade: Cidade) => void) {
  return http.get(urlDaPrevisao, ({ request }) => {
    const latitude = Number(new URL(request.url).searchParams.get('latitude'))
    const cidade = cidades.find((item) => item.latitude === latitude)
    if (!cidade) {
      return HttpResponse.json({ error: true, reason: 'cidade fora da lista' }, { status: 400 })
    }
    aoPedir?.(cidade)
    return HttpResponse.json(respostas[cidade.id])
  })
}

/** Nunca responde: a seção fica carregando. */
export function previsaoCarregando() {
  return http.get(urlDaPrevisao, async () => {
    await delay('infinite')
  })
}

/** Falha do serviço, com o corpo de erro que a Open-Meteo usa. */
export function previsaoComErro() {
  return http.get(urlDaPrevisao, () =>
    HttpResponse.json({ error: true, reason: 'falha simulada' }, { status: 500 }),
  )
}

/** Resposta válida, mas sem nenhum dia. */
export function previsaoVazia() {
  return http.get(urlDaPrevisao, () =>
    HttpResponse.json({
      daily: {
        time: [],
        sunrise: [],
        sunset: [],
        cloud_cover_mean: [],
        precipitation_probability_max: [],
      },
    }),
  )
}
