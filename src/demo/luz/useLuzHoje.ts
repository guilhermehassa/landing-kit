import { useQuery } from '@tanstack/react-query'
import type { Cidade, CidadeId } from './cidades'
import { buscarPrevisao } from './previsao'
import { paraDiasDeLuz } from './regras'

/** A chave da previsão no cache. A cidade faz parte dela: cada cidade tem a sua entrada. */
export function chaveDaPrevisao(cidadeId: CidadeId) {
  return ['previsao-luz', cidadeId] as const
}

/**
 * A previsão de 3 dias da cidade, com os dias prontos para a tela.
 *
 * Por que TanStack Query aqui: é uma SPA que busca no navegador uma API de terceiros, e o
 * dado envelhece. Ele dá pronto o que seria useEffect, useState de carregando e de erro,
 * AbortController e um cache por cidade feito à mão, além de nova tentativa e nova busca
 * quando o dado fica velho.
 *
 * Por que o Agendarium não precisa dele: lá os dados são lidos em Server Components e
 * alterados por Server Actions. O cliente não guarda cópia dos dados, então não há cache
 * no cliente para gerenciar.
 */
export function useLuzHoje(cidade: Cidade) {
  return useQuery({
    queryKey: chaveDaPrevisao(cidade.id),
    // O signal vem do TanStack Query: ao trocar de cidade no meio da busca, a anterior é cancelada
    queryFn: ({ signal }) => buscarPrevisao(cidade, signal),
    // O cache guarda a resposta da API; o componente recebe os dias prontos. A função fica
    // fora do componente: com a mesma referência, o select só roda de novo quando os dados mudam
    select: paraDiasDeLuz,
    // Sem placeholderData (keepPreviousData): mostrar a previsão da cidade anterior enquanto a
    // nova carrega confundiria. Cidade já vista aparece na hora, pelo cache; cidade nova, com o esqueleto
  })
}
