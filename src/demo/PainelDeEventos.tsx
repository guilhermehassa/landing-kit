import { useSyncExternalStore } from 'react'
import { assinarEventos, lerEventosEnviados } from './tracking'

const formatoDaHora = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

/**
 * Mostra o que a página manda para o dataLayer, para quem não abre o console.
 *
 * Sem aria-live, de propósito: anunciar um JSON a cada passo atrapalharia quem usa
 * leitor de tela, e cada ação já tem o próprio retorno (o título da etapa, o aviso do
 * plano, a tela de sucesso). Quem quiser ler o painel chega a ele pelo título.
 */
export function PainelDeEventos() {
  // useSyncExternalStore é o jeito do React de ler um dado que vive fora dele: assina,
  // e re-renderiza quando a lista muda. O tracking não sabe que o painel existe
  const eventos = useSyncExternalStore(assinarEventos, lerEventosEnviados)

  return (
    <section
      aria-labelledby="eventos-titulo"
      className="flex flex-col gap-4 rounded-card border border-border bg-surface-raised p-6"
    >
      <h3 id="eventos-titulo" className="text-xl font-semibold">
        Eventos disparados
      </h3>
      <p className="text-sm text-text-muted">
        Uma cópia do que esta página envia para o <code>dataLayer</code>. Repare que nome e
        e-mail nunca aparecem aqui.
      </p>

      {eventos.length === 0 ? (
        <p className="text-sm">
          Nenhum evento ainda. Escolha um plano ou avance uma etapa do formulário.
        </p>
      ) : (
        // Do mais recente para o mais antigo
        <ol className="flex flex-col gap-4">
          {eventos.map(({ id, quando, evento }) => (
            <li key={id} className="flex flex-col gap-2 border-t border-border pt-4">
              <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                <code className="font-semibold">{evento.event}</code>
                <time dateTime={new Date(quando).toISOString()} className="text-sm text-text-muted">
                  {formatoDaHora.format(quando)}
                </time>
              </p>
              {/* Quebra as linhas longas em vez de rolar para o lado na tela estreita */}
              <pre className="whitespace-pre-wrap wrap-anywhere rounded-control bg-surface-muted p-3 text-sm">
                {JSON.stringify(evento, null, 2)}
              </pre>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
