export type CidadeId =
  | 'sao-paulo'
  | 'rio-de-janeiro'
  | 'belo-horizonte'
  | 'salvador'
  | 'porto-alegre'
  | 'manaus'

export interface Cidade {
  id: CidadeId
  rotulo: string
  latitude: number
  longitude: number
}

// Manaus está na lista de propósito: fica uma hora atrás de Brasília, e os horários
// dela mostram que o fuso vem da API (timezone=auto), e não do navegador
export const cidades: Cidade[] = [
  { id: 'sao-paulo', rotulo: 'São Paulo', latitude: -23.55, longitude: -46.63 },
  { id: 'rio-de-janeiro', rotulo: 'Rio de Janeiro', latitude: -22.91, longitude: -43.17 },
  { id: 'belo-horizonte', rotulo: 'Belo Horizonte', latitude: -19.92, longitude: -43.94 },
  { id: 'salvador', rotulo: 'Salvador', latitude: -12.97, longitude: -38.5 },
  { id: 'porto-alegre', rotulo: 'Porto Alegre', latitude: -30.03, longitude: -51.23 },
  { id: 'manaus', rotulo: 'Manaus', latitude: -3.12, longitude: -60.02 },
]

/** A cidade de um `id`. Recebe `string` porque o valor vem do `<select>`. */
export function cidadePorId(id: string): Cidade {
  const cidade = cidades.find((item) => item.id === id)
  if (!cidade) throw new Error(`Cidade desconhecida: ${id}`)
  return cidade
}

export const cidadePadrao = cidadePorId('sao-paulo')
