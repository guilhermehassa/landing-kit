import type { Previsao } from './previsao'

// Regras de exibição da previsão: funções puras, sem React e sem rede, com teste próprio

export type Veredito = 'limpo' | 'promissor' | 'fechado' | 'chuva' | 'sem-dado'

export interface Janela {
  inicio: string
  fim: string
}

/** Um dia da previsão, pronto para a tela. */
export interface DiaDeLuz {
  /** '2026-11-04' */
  data: string
  /** 'Hoje', 'Amanhã' ou 'Sexta-feira, 6 de nov.' */
  rotulo: string
  nascer: string
  por: string
  douradaManha: Janela
  douradaTarde: Janela
  /** Média de nuvens do dia, em %, e não a nuvem na hora do pôr do sol. */
  nuvens: number | null
  /** Maior chance de chuva do dia, em %. */
  chuva: number | null
  veredito: Veredito
}

export const textoDoVeredito: Record<Veredito, string> = {
  'sem-dado': 'Sem previsão de nuvens para este dia.',
  chuva: 'Chuva provável. Bom dia para treinar luz de janela.',
  fechado: 'Céu carregado: a luz deve ficar suave e sem cor.',
  promissor: 'Nuvens na medida: boa chance de céu colorido.',
  limpo: 'Céu limpo: luz dourada direta, sem nuvens no céu.',
}

/**
 * '2026-11-04T18:21' → '18:21'. A API manda a hora local da cidade, sem fuso, e ela é
 * tratada como texto: com new Date(), o CI, que roda em UTC, mostraria outra hora.
 */
export function horaDe(dataHora: string) {
  return dataHora.slice(11, 16)
}

/** '05:18' e 60 → '06:18'. A conta é feita em minutos, também sem Date. */
function somarMinutos(hora: string, minutos: number) {
  const total = Number(hora.slice(0, 2)) * 60 + Number(hora.slice(3, 5)) + minutos
  const horas = String(Math.floor(total / 60)).padStart(2, '0')
  return `${horas}:${String(total % 60).padStart(2, '0')}`
}

const duracaoDaHoraDourada = 60

/**
 * A hora dourada pela regra prática: a primeira hora depois do nascer do sol e a última
 * antes do pôr. É uma aproximação, e não o cálculo pela altura do sol, e a página diz isso.
 */
export function janelaDourada(nascer: string, por: string): { manha: Janela; tarde: Janela } {
  return {
    manha: { inicio: nascer, fim: somarMinutos(nascer, duracaoDaHoraDourada) },
    tarde: { inicio: somarMinutos(por, -duracaoDaHoraDourada), fim: por },
  }
}

/** O veredito do dia. A ordem das condições importa: chuva pesa mais do que nuvem. */
export function avaliarLuz(nuvens: number | null, chuva: number | null): Veredito {
  if (nuvens === null || chuva === null) return 'sem-dado'
  if (chuva >= 60) return 'chuva'
  if (nuvens >= 70) return 'fechado'
  if (nuvens >= 20) return 'promissor'
  return 'limpo'
}

// timeZone UTC: a data vira meia-noite em UTC, e formatar no fuso do navegador, negativo
// no Brasil, voltaria um dia
const formatoDoDia = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

/** 'Hoje', 'Amanhã' e, a partir do terceiro dia, 'Sexta-feira, 6 de nov.'. */
export function rotuloDoDia(data: string, indice: number) {
  // O primeiro dia da resposta é o hoje da cidade, e não o do navegador
  if (indice === 0) return 'Hoje'
  if (indice === 1) return 'Amanhã'
  const texto = formatoDoDia.format(new Date(`${data}T00:00:00Z`))
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/**
 * Transforma a resposta validada na lista de dias da tela. É o `select` do useLuzHoje:
 * o cache guarda a resposta da API, e o componente recebe os dias prontos.
 */
export function paraDiasDeLuz({ daily }: Previsao): DiaDeLuz[] {
  return daily.time.map((data, indice) => {
    // O schema garante que todas as listas têm o mesmo tamanho: o índice existe em todas
    const nascer = horaDe(daily.sunrise[indice]!)
    const por = horaDe(daily.sunset[indice]!)
    const nuvens = daily.cloud_cover_mean[indice] ?? null
    const chuva = daily.precipitation_probability_max[indice] ?? null
    const { manha, tarde } = janelaDourada(nascer, por)

    return {
      data,
      rotulo: rotuloDoDia(data, indice),
      nascer,
      por,
      douradaManha: manha,
      douradaTarde: tarde,
      nuvens,
      chuva,
      veredito: avaliarLuz(nuvens, chuva),
    }
  })
}
