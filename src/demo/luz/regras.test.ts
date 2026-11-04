import { describe, expect, it } from 'vitest'
import { respostas } from './mocks'
import { avaliarLuz, horaDe, janelaDourada, paraDiasDeLuz, rotuloDoDia } from './regras'

describe('horaDe', () => {
  it('pega a hora local da cidade como texto, sem converter fuso', () => {
    expect(horaDe('2026-11-04T18:21')).toBe('18:21')
  })
})

describe('janelaDourada', () => {
  it('manhã: do nascer até 60 minutos depois; tarde: de 60 minutos antes do pôr até o pôr', () => {
    expect(janelaDourada('05:18', '18:21')).toEqual({
      manha: { inicio: '05:18', fim: '06:18' },
      tarde: { inicio: '17:21', fim: '18:21' },
    })
  })

  it('mantém os dois dígitos da hora', () => {
    expect(janelaDourada('04:59', '10:05')).toEqual({
      manha: { inicio: '04:59', fim: '05:59' },
      tarde: { inicio: '09:05', fim: '10:05' },
    })
  })
})

describe('avaliarLuz', () => {
  it.each([
    [79, 25, 'fechado'], // São Paulo, 04/11
    [41, 16, 'promissor'], // Rio de Janeiro, 04/11
    [3, 22, 'limpo'], // Porto Alegre, 06/11
    [96, 100, 'chuva'], // Porto Alegre, 04/11: a chuva vem antes da nuvem
    [10, 60, 'chuva'],
    [70, 59, 'fechado'],
    [20, 0, 'promissor'],
    [19, 0, 'limpo'],
    [null, 25, 'sem-dado'],
    [79, null, 'sem-dado'],
  ] as const)('nuvens %s e chuva %s: %s', (nuvens, chuva, veredito) => {
    expect(avaliarLuz(nuvens, chuva)).toBe(veredito)
  })
})

describe('rotuloDoDia', () => {
  it.each([
    ['2026-11-04', 0, 'Hoje'],
    ['2026-11-05', 1, 'Amanhã'],
    // Sem o timeZone UTC, num fuso negativo, sairia "Quinta-feira, 5 de nov."
    ['2026-11-06', 2, 'Sexta-feira, 6 de nov.'],
  ])('%s (índice %i): %s', (data, indice, rotulo) => {
    expect(rotuloDoDia(data, indice)).toBe(rotulo)
  })
})

describe('paraDiasDeLuz', () => {
  it('transforma a resposta de São Paulo nos 3 dias da tela', () => {
    const [hoje, amanha, depois] = paraDiasDeLuz(respostas['sao-paulo'])

    expect(hoje).toEqual({
      data: '2026-11-04',
      rotulo: 'Hoje',
      nascer: '05:18',
      por: '18:21',
      douradaManha: { inicio: '05:18', fim: '06:18' },
      douradaTarde: { inicio: '17:21', fim: '18:21' },
      nuvens: 79,
      chuva: 25,
      veredito: 'fechado',
    })
    expect(amanha).toMatchObject({ rotulo: 'Amanhã', veredito: 'chuva' })
    expect(depois).toMatchObject({ rotulo: 'Sexta-feira, 6 de nov.', nascer: '05:17' })
  })

  it('mantém o null de um dia sem dado, e o veredito vira "sem-dado"', () => {
    const { daily } = respostas['sao-paulo']
    const [hoje] = paraDiasDeLuz({
      daily: { ...daily, cloud_cover_mean: [null, 99, 77] },
    })

    expect(hoje).toMatchObject({ nuvens: null, chuva: 25, veredito: 'sem-dado' })
  })

  it('uma resposta sem dias vira uma lista vazia', () => {
    expect(
      paraDiasDeLuz({
        daily: {
          time: [],
          sunrise: [],
          sunset: [],
          cloud_cover_mean: [],
          precipitation_probability_max: [],
        },
      }),
    ).toEqual([])
  })
})
