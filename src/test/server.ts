import { setupServer } from 'msw/node'
import { previsaoComDados } from '@/demo/luz/mocks'

/**
 * A rede dos testes do jsdom. O handler padrão responde a Open-Meteo com as respostas
 * gravadas; um teste troca o comportamento com `server.use()`, e o setup desfaz depois.
 */
export const server = setupServer(previsaoComDados())
