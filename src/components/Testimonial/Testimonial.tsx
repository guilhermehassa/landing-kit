import type { ComponentPropsWithRef } from 'react'

export type TestimonialProps = Omit<ComponentPropsWithRef<'figure'>, 'children'> & {
  /** O depoimento, sem aspas: elas são decorativas e vêm do componente. */
  quote: string
  /** Nome de quem fala. As iniciais do avatar saem dele. */
  name: string
  /** Profissão e cidade, abaixo do nome. Opcional. */
  context?: string
}

/** Iniciais do primeiro e do último nome: "Renata M." → "RM". */
function getInitials(name: string) {
  const words = name.trim().split(/\s+/)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? (words.at(-1)?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

/**
 * Depoimento com autoria: `<figure>` agrupa a citação (`<blockquote>`) e a legenda
 * (`<figcaption>`), que diz quem falou. Sem foto: o avatar mostra as iniciais.
 */
export function Testimonial({ quote, name, context, className, ...props }: TestimonialProps) {
  return (
    <figure
      {...props}
      className={[
        'flex flex-col gap-4 rounded-card border border-border bg-surface-raised p-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden="true" className="font-display text-5xl leading-none text-primary">
        “
      </span>
      <blockquote className="flex-1 leading-relaxed">
        <p>{quote}</p>
      </blockquote>
      <figcaption className="flex items-center gap-3">
        {/* Decorativo: o nome já está na legenda, e as iniciais lidas em voz alta
            ("R M") só repetiriam a informação */}
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-pill bg-primary-subtle font-semibold text-primary-subtle-foreground"
        >
          {getInitials(name)}
        </span>
        {/* Nome e contexto ficam em linhas diferentes na tela, mas no texto da legenda
            ficariam colados: a vírgula escondida e o espaço dão "Renata M., Confeiteira…" */}
        <span className="flex flex-col">
          <span className="font-semibold">
            {name}
            {context && <span className="sr-only">,</span>}
          </span>{' '}
          {context && <span className="text-sm text-text-muted">{context}</span>}
        </span>
      </figcaption>
    </figure>
  )
}
