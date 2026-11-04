import { useEffect, useId, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Button } from '../Button'

// Sem ref: quem abre e fecha é o `open`. Com o <dialog> exposto, dava para chamar
// showModal() por fora e deixar a tela e o estado do React dessincronizados
export type ModalProps = Omit<
  ComponentPropsWithoutRef<'dialog'>,
  'open' | 'title' | 'onClose' | 'children'
> & {
  /** Aberto ou fechado. O Modal chama `showModal()` e `close()` do `<dialog>` conforme ele muda. */
  open: boolean
  /** Chamada quando o diálogo fecha: Esc, botão Fechar ou `open` em `false`. Ponha o `open` em `false`. */
  onClose: () => void
  /** Título, que também dá nome ao diálogo (`aria-labelledby`). */
  title: string
  closeLabel?: string
  children: ReactNode
}

/**
 * Janela modal com o `<dialog>` nativo e `showModal()`. O navegador cuida do principal:
 * o resto da página fica inerte, o Esc fecha, e o foco volta para quem abriu.
 */
export function Modal({
  open,
  onClose,
  title,
  closeLabel = 'Fechar',
  className,
  children,
  ...props
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleId = useId()

  // O <dialog> só abre como modal pela API do DOM: o atributo open (ou a prop) abre
  // sem backdrop, sem prender o foco e sem o Esc. Por isso o effect, e não a prop
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      // O showModal() foca o primeiro elemento focável, que aqui é o Fechar, no fim do
      // texto. O foco vai para o título, como o APG sugere: a leitura começa do topo
      titleRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    // O evento close dispara em toda forma de fechar (Esc, Fechar, close()): é o único
    // lugar que avisa o pai
    <dialog
      {...props}
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      className={[
        'm-auto w-[calc(100%-2rem)] max-w-text rounded-card border border-border bg-surface-raised p-6 text-text shadow-card',
        'backdrop:bg-text/60',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <h2
        ref={titleRef}
        id={titleId}
        tabIndex={-1}
        className="font-display text-2xl font-semibold leading-tight"
      >
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-4 leading-relaxed">{children}</div>
      {/* method="dialog": o próprio navegador fecha o diálogo ao enviar, sem JavaScript */}
      <form method="dialog" className="mt-6 flex justify-end">
        <Button type="submit">{closeLabel}</Button>
      </form>
    </dialog>
  )
}
