import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/fraunces'
import '@/index.css'
import { App } from '@/App'
import { criarQueryClient } from '@/demo/queryClient'

// Um client só, criado fora do React: o cache vive enquanto a aba estiver aberta. O
// provider fica aqui, na demo, e não na biblioteca, que não busca dados
const queryClient = criarQueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* Só em desenvolvimento: no build de produção, o pacote troca o painel por um
          componente vazio, e o código dele sai do bundle */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)
