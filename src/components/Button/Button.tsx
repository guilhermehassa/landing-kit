import type { ComponentPropsWithRef, MouseEvent } from 'react'
import { buttonStyles, type ButtonStyleProps } from './buttonStyles'

export type ButtonProps = ComponentPropsWithRef<'button'> &
  ButtonStyleProps & {
    /** Ação em andamento: troca o texto visível e ignora cliques. */
    loading?: boolean
    loadingText?: string
  }

/** Botão para ações (enviar, escolher plano). Para navegar até uma âncora, use `ButtonLink`. */
export function Button({
  variant,
  size,
  loading = false,
  loadingText = 'Enviando…',
  // O padrão do HTML é "submit": dentro de um form, qualquer botão enviaria o formulário
  type = 'button',
  className,
  children,
  onClick,
  ...props
}: ButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    // aria-disabled não bloqueia nada sozinho (nem o envio do form): quem bloqueia é este handler
    if (loading) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  return (
    <button
      {...props}
      type={type}
      // No carregamento, aria-disabled em vez de disabled: o botão continua focável,
      // e quem usa leitor de tela não perde o lugar na página
      aria-disabled={loading || props['aria-disabled']}
      className={buttonStyles({ variant, size, className })}
      onClick={handleClick}
    >
      {loading ? loadingText : children}
    </button>
  )
}
