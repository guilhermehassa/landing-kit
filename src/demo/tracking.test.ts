import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  assinarEventos,
  lerEventosEnviados,
  limparEventosEnviados,
  track,
  type EventoDataLayer,
} from './tracking'

const etapa1: EventoDataLayer = {
  event: 'form_step_complete',
  form_name: 'inscricao',
  step_number: 1,
  step_name: 'sobre_voce',
}

const completo: EventoDataLayer = {
  event: 'select_item',
  ecommerce: {
    currency: 'BRL',
    item_list_id: 'planos',
    item_list_name: 'Planos',
    items: [{ item_id: 'completo', item_name: 'Hora Âmbar Completo', price: 297, index: 1 }],
  },
}

beforeEach(() => {
  delete window.dataLayer
  limparEventosEnviados()
})

describe('track', () => {
  it('cria o window.dataLayer e põe o evento nele', () => {
    track(etapa1)

    expect(window.dataLayer).toEqual([etapa1])
  })

  it('usa o dataLayer que já existe, sem trocar o array', () => {
    // O GTM guarda a referência do array: trocar por outro faria ele parar de ouvir
    const existente: unknown[] = [{ event: 'gtm.js' }]
    window.dataLayer = existente

    track(etapa1)

    expect(window.dataLayer).toBe(existente)
    expect(existente).toEqual([{ event: 'gtm.js' }, etapa1])
  })

  it('antes de um evento de e-commerce, limpa o anterior com { ecommerce: null }', () => {
    track(completo)

    expect(window.dataLayer).toEqual([{ ecommerce: null }, completo])
  })

  it('guarda os eventos enviados, do mais recente para o mais antigo, sem o ecommerce: null', () => {
    track(completo)
    track(etapa1)

    expect(lerEventosEnviados().map((enviado) => enviado.evento)).toEqual([etapa1, completo])
  })

  it('avisa quem assina, até a assinatura ser cancelada', () => {
    const avisar = vi.fn()
    const cancelar = assinarEventos(avisar)

    track(etapa1)
    cancelar()
    track(etapa1)

    expect(avisar).toHaveBeenCalledTimes(1)
  })

  it('não aceita campo de dado pessoal no evento (o npm run typecheck reprova)', () => {
    // A chamada nunca roda: o teste é o @ts-expect-error. Se alguém abrir a união para
    // aceitar um `email`, o erro some, o @ts-expect-error vira erro e o typecheck falha
    const naoRoda = () =>
      track({
        ...etapa1,
        // @ts-expect-error: a união de eventos é fechada, e e-mail não faz parte dela
        email: 'maria@exemplo.com',
      })

    expect(naoRoda).toBeTypeOf('function')
  })
})
