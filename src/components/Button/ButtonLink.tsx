import type { ComponentPropsWithRef } from 'react'
import { buttonStyles, type ButtonStyleProps } from './buttonStyles'

export type ButtonLinkProps = ComponentPropsWithRef<'a'> &
  ButtonStyleProps & {
    // Obrigatório: um <a> sem href não é link nem recebe foco pelo teclado
    href: string
  }

/**
 * Link com o visual do Botão, para CTAs que navegam (ex.: `#inscricao`).
 * Não tem estado desabilitado nem de carregamento: link navega, não executa ação.
 */
export function ButtonLink({
  variant,
  size,
  className,
  href,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a {...props} href={href} className={buttonStyles({ variant, size, className })}>
      {children}
    </a>
  )
}
