import type { ReactNode, RefObject } from 'react'

/** O que cada tela do formulário recebe do FormularioInscricao. */
export interface PropsDaTela {
  /** Vai no título da tela: é para ele que o foco vai quando a tela troca. */
  tituloRef: RefObject<HTMLHeadingElement | null>
  /** Chame logo antes de trocar de tela, para o foco ir ao título da próxima. */
  onNavegar: () => void
}

interface TituloDaEtapaProps {
  ref: RefObject<HTMLHeadingElement | null>
  id?: string
  className?: string
  children: ReactNode
}

/**
 * Título de cada tela do formulário. O tabIndex={-1} deixa o título receber foco pelo
 * código (ao trocar de etapa), sem entrar na ordem do Tab.
 */
export function TituloDaEtapa({ ref, id, className, children }: TituloDaEtapaProps) {
  return (
    <h3
      ref={ref}
      id={id}
      tabIndex={-1}
      className={['text-xl font-semibold', className].filter(Boolean).join(' ')}
    >
      {children}
    </h3>
  )
}
