import type { PlanoId } from './inscricao/schemas'

/**
 * Os eventos que a página manda para o dataLayer. União fechada: um campo que não está
 * aqui (um `email`, por exemplo) não compila. Ela não impede pôr um e-mail dentro de um
 * campo de texto como `item_name`: a revisão continua necessária.
 */
export type EventoDataLayer =
  | {
      event: 'select_item'
      ecommerce: {
        currency: 'BRL'
        item_list_id: 'planos'
        item_list_name: 'Planos'
        items: [{ item_id: PlanoId; item_name: string; price: number; index: number }]
      }
    }
  | {
      event: 'form_step_complete'
      form_name: 'inscricao'
      step_number: 1 | 2
      step_name: 'sobre_voce' | 'seu_momento'
    }
  | {
      event: 'generate_lead'
      form_name: 'inscricao'
      currency: 'BRL'
      value: number
      lead_source: 'landing_hora_ambar'
      plan_id: PlanoId
    }

export interface EventoEnviado {
  id: number
  /** Momento do envio, em milissegundos (Date.now()). */
  quando: number
  evento: EventoDataLayer
}

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

// Registro dos eventos enviados nesta visita, do mais recente para o mais antigo.
// É uma lista nova a cada evento (nunca alterada no lugar): é assim que o
// useSyncExternalStore percebe que mudou
let enviados: readonly EventoEnviado[] = []
let proximoId = 1
const ouvintes = new Set<() => void>()

/** Envia o evento para o dataLayer, onde o Google Tag Manager o leria. */
export function track(evento: EventoDataLayer) {
  window.dataLayer = window.dataLayer ?? []
  // A doc do GA4 manda limpar o objeto ecommerce antes de cada evento de e-commerce
  if ('ecommerce' in evento) window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push(evento)

  enviados = [{ id: proximoId++, quando: Date.now(), evento }, ...enviados]
  for (const avisar of ouvintes) avisar()
}

/**
 * Assina os envios; devolve a função que cancela. Junto com `lerEventosEnviados`, é o
 * par que o `useSyncExternalStore` pede. O tracking não sabe quem assina: o painel da
 * página é só um leitor.
 */
export function assinarEventos(avisar: () => void) {
  ouvintes.add(avisar)
  return () => {
    ouvintes.delete(avisar)
  }
}

export function lerEventosEnviados() {
  return enviados
}

/** Esvazia o registro. Usado entre testes e stories, que dividem o mesmo módulo. */
export function limparEventosEnviados() {
  enviados = []
  for (const avisar of ouvintes) avisar()
}
