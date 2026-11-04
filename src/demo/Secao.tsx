import type { ReactNode } from 'react'

interface SecaoProps {
  id: string
  titulo: string
  subtitulo?: string
  /** Texto menor e em itálico, abaixo do subtítulo (legenda ou aviso). */
  nota?: string
  fundo?: 'surface' | 'surface-muted'
  children?: ReactNode
}

/**
 * Moldura de uma seção da landing: âncora, `h2`, subtítulo e a largura do conteúdo.
 * É da demo, e não da biblioteca: cada página organiza as seções do seu jeito.
 */
export function Secao({ id, titulo, subtitulo, nota, fundo = 'surface', children }: SecaoProps) {
  const tituloId = `${id}-titulo`

  return (
    // Com aria-labelledby, a seção vira uma região com nome na lista de marcos do leitor de tela
    <section
      id={id}
      aria-labelledby={tituloId}
      className={['py-section', fundo === 'surface-muted' && 'bg-surface-muted']
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto flex max-w-content flex-col gap-12 px-4 sm:px-6">
        <div className="flex max-w-text flex-col gap-4">
          <h2
            id={tituloId}
            className="font-display text-3xl font-semibold leading-tight md:text-4xl"
          >
            {titulo}
          </h2>
          {subtitulo && <p className="text-lg leading-relaxed text-text-muted">{subtitulo}</p>}
          {nota && <p className="text-sm italic text-text-muted">{nota}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}
