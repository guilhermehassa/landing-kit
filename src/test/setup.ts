import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './server'

// Nenhum teste chama a internet. Na MSW 3, a opção é onUnhandledFrame (a antiga
// onUnhandledRequest não existe mais): uma requisição sem handler vira erro, e não sai
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))

// Sem `globals: true`, a Testing Library não registra a limpeza sozinha: o DOM de
// um teste vazaria para o seguinte
afterEach(() => {
  cleanup()
  // Tira os handlers que o teste pôs com server.use()
  server.resetHandlers()
})

afterAll(() => server.close())
