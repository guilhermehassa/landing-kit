import { http, HttpResponse } from 'msw/http'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { server } from '@/test/server'
import { cidadePorId } from './cidades'
import { previsaoComErro, respostas } from './mocks'
import { buscarPrevisao, previsaoSchema, urlDaPrevisao } from './previsao'

// A resposta real de São Paulo (04/11/2026), inteira, como a API manda
const respostaReal = {
  latitude: -23.514938,
  longitude: -46.610504,
  generationtime_ms: 0.065,
  utc_offset_seconds: -10800,
  timezone: 'America/Sao_Paulo',
  timezone_abbreviation: 'GMT-3',
  elevation: 737,
  daily_units: {
    time: 'iso8601',
    sunrise: 'iso8601',
    sunset: 'iso8601',
    cloud_cover_mean: '%',
    precipitation_probability_max: '%',
  },
  daily: respostas['sao-paulo'].daily,
}

describe('previsaoSchema', () => {
  it('aceita a resposta real e deixa de fora os campos que a página não usa', () => {
    expect(previsaoSchema.parse(respostaReal)).toEqual(respostas['sao-paulo'])
  })

  it('aceita null em nuvens e chuva, que a API manda quando não tem o dado', () => {
    const daily = {
      ...respostas['sao-paulo'].daily,
      cloud_cover_mean: [null, 99, 77],
      precipitation_probability_max: [25, null, 80],
    }

    expect(previsaoSchema.safeParse({ daily }).success).toBe(true)
  })

  it('reprova quando falta um campo', () => {
    const { sunset: _semPorDoSol, ...daily } = respostas['sao-paulo'].daily
    const resultado = previsaoSchema.safeParse({ daily })

    expect(resultado.error?.issues.map((issue) => issue.path)).toEqual([['daily', 'sunset']])
  })

  it('reprova quando falta o bloco daily inteiro', () => {
    expect(previsaoSchema.safeParse({ error: true, reason: 'falha' }).success).toBe(false)
  })

  it('reprova um valor com o tipo errado', () => {
    const daily = { ...respostas['sao-paulo'].daily, cloud_cover_mean: ['79%', 99, 77] }

    expect(previsaoSchema.safeParse({ daily }).success).toBe(false)
  })

  it('reprova listas diárias de tamanhos diferentes', () => {
    const daily = { ...respostas['sao-paulo'].daily, sunset: ['2026-11-04T18:21'] }
    const resultado = previsaoSchema.safeParse({ daily })

    expect(resultado.error?.issues[0]?.message).toBe(
      'As listas diárias da previsão têm tamanhos diferentes.',
    )
  })
})

describe('buscarPrevisao', () => {
  it('pede as coordenadas da cidade, as 4 variáveis diárias, o fuso automático e 3 dias', async () => {
    let pedido = new URLSearchParams()
    server.use(
      http.get(urlDaPrevisao, ({ request }) => {
        pedido = new URL(request.url).searchParams
        return HttpResponse.json(respostas.manaus)
      }),
    )

    await buscarPrevisao(cidadePorId('manaus'))

    expect(Object.fromEntries(pedido)).toEqual({
      latitude: '-3.12',
      longitude: '-60.02',
      daily: 'sunrise,sunset,cloud_cover_mean,precipitation_probability_max',
      timezone: 'auto',
      forecast_days: '3',
    })
  })

  it('devolve a resposta validada', async () => {
    await expect(buscarPrevisao(cidadePorId('salvador'))).resolves.toEqual(respostas.salvador)
  })

  it('lança um erro quando a API responde 500 (o fetch sozinho não lançaria)', async () => {
    server.use(previsaoComErro())

    await expect(buscarPrevisao(cidadePorId('sao-paulo'))).rejects.toThrow(
      'A Open-Meteo respondeu 500.',
    )
  })

  it('lança o erro do Zod quando o formato da resposta muda', async () => {
    server.use(http.get(urlDaPrevisao, () => HttpResponse.json({ daily: { time: [] } })))

    await expect(buscarPrevisao(cidadePorId('sao-paulo'))).rejects.toBeInstanceOf(z.ZodError)
  })

  it('repassa o signal ao fetch: uma busca cancelada não termina', async () => {
    const controle = new AbortController()
    controle.abort()

    await expect(buscarPrevisao(cidadePorId('sao-paulo'), controle.signal)).rejects.toThrow(
      /abort/i,
    )
  })
})
