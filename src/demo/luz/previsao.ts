import { z } from 'zod'
import type { Cidade } from './cidades'

export const urlDaPrevisao = 'https://api.open-meteo.com/v1/forecast'

/**
 * O formato que a página espera da Open-Meteo. Valida só os campos que a tela usa:
 * se a API mudar um campo que a página ignora, a seção continua funcionando.
 */
export const previsaoSchema = z
  .object({
    daily: z.object({
      time: z.array(z.string()),
      sunrise: z.array(z.string()),
      sunset: z.array(z.string()),
      // A Open-Meteo devolve null quando não tem o dado do dia
      cloud_cover_mean: z.array(z.number().nullable()),
      precipitation_probability_max: z.array(z.number().nullable()),
    }),
  })
  // Cada lista traz um valor por dia, na mesma ordem: tamanhos diferentes são uma resposta quebrada
  .refine(({ daily }) => Object.values(daily).every((lista) => lista.length === daily.time.length), {
    error: 'As listas diárias da previsão têm tamanhos diferentes.',
  })

export type Previsao = z.infer<typeof previsaoSchema>

/**
 * Busca a previsão de 3 dias da cidade. É a `queryFn` do `useLuzHoje`, mas não sabe que
 * o TanStack Query existe: recebe a cidade e o `signal`, e se testa sozinha.
 */
export async function buscarPrevisao(cidade: Cidade, signal?: AbortSignal): Promise<Previsao> {
  const parametros = new URLSearchParams({
    latitude: String(cidade.latitude),
    longitude: String(cidade.longitude),
    daily: 'sunrise,sunset,cloud_cover_mean,precipitation_probability_max',
    // Obrigatório quando há variáveis daily. Com auto, o fuso vem das coordenadas
    timezone: 'auto',
    forecast_days: '3',
  })

  // GET simples, sem cabeçalho próprio: o navegador nem faz o preflight do CORS.
  // Com o signal, a busca é cancelada se a pessoa trocar de cidade antes da resposta
  const resposta = await fetch(`${urlDaPrevisao}?${parametros}`, { signal })
  // O fetch não lança erro em 400 nem em 500: quem lança somos nós
  if (!resposta.ok) throw new Error(`A Open-Meteo respondeu ${resposta.status}.`)

  // API de terceiros: se o formato mudar, o parse lança, e a seção mostra o erro em vez de quebrar
  return previsaoSchema.parse(await resposta.json())
}
