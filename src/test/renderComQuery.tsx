import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { criarQueryClient } from '@/demo/queryClient'

/**
 * Renderiza dentro de um QueryClient novo, com os padrões da demo (o teste de cache
 * depende do staleTime dela). Um client por teste: o cache de um não vaza para o outro.
 * Sem repetição: com as 3 tentativas do padrão, o teste de erro esperaria uns 7 segundos.
 */
export function renderComQuery(
  ui: ReactElement,
  queryClient: QueryClient = criarQueryClient({ retry: false }),
) {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}
