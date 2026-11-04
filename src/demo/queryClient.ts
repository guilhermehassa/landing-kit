import { QueryClient } from '@tanstack/react-query'

/**
 * O QueryClient da demo, criado uma vez no main.tsx. Os testes e as stories criam um
 * novo a cada render, com os mesmos padrões e sem repetição.
 */
export function criarQueryClient({ retry = 3 }: { retry?: number | false } = {}) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // O nascer e o pôr do sol não mudam ao longo do dia, e os modelos da Open-Meteo
        // se atualizam a cada 1 a 6 horas. Por 30 min, voltar a uma cidade ou à aba usa
        // o cache, sem nova busca. O padrão (0) buscaria de novo a cada troca de cidade
        staleTime: 30 * 60_000,
        // Maior que o staleTime: com o padrão (5 min), uma cidade sem uso sairia do cache
        // antes de ficar velha, e a volta a ela mostraria o carregamento de novo
        gcTime: 60 * 60_000,
        // O padrão, escrito para a decisão ficar à vista: 3 tentativas com espera
        // crescente resolvem uma falha passageira da rede antes de mostrar o erro
        retry,
        // Também o padrão: ao voltar à aba, só busca de novo se o dado já estiver velho
        refetchOnWindowFocus: true,
      },
    },
  })
}
