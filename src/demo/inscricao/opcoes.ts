import { formatarPreco, planos } from '../planos'
import type { Nivel, Objetivo } from './schemas'

// Record com a união do schema como chave: uma opção que falte aqui é erro de compilação

export const textoDoNivel: Record<Nivel, string> = {
  iniciante: 'Nunca estudei fotografia',
  basico: 'Sei o básico',
  frequente: 'Fotografo com frequência',
}

export const textoDoObjetivo: Record<Objetivo, string> = {
  viagens: 'Viagens e paisagens',
  familia: 'Família e amigos',
  produtos: 'Produtos para vender',
  redes: 'Conteúdo para redes sociais',
}

/** "Essencial (R$ 197)", na ordem dos cards. */
export const textoDoPlano: Record<string, string> = Object.fromEntries(
  planos.map((plano) => [plano.id, `${plano.nome} (${formatarPreco(plano.preco)})`]),
)

/** O texto de uma opção a partir do valor guardado na store ('' quando não há). */
export function textoDaOpcao(opcoes: Record<string, string>, valor: string) {
  return opcoes[valor] ?? ''
}
