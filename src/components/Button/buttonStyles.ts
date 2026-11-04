export type ButtonVariant = 'primary' | 'secondary' | 'accent'
export type ButtonSize = 'sm' | 'md'

export interface ButtonStyleProps {
  /** `accent` é só para fundo `primary` (faixa com `data-surface="primary"`). */
  variant?: ButtonVariant
  size?: ButtonSize
}

const base = [
  'inline-flex items-center justify-center gap-2 whitespace-nowrap',
  'rounded-control font-sans font-semibold',
  'motion-safe:transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  // Desabilitado é isento de contraste na WCAG; a opacidade só sinaliza o estado
  'disabled:pointer-events-none disabled:opacity-50',
  'aria-disabled:cursor-wait',
].join(' ')

// Record com a união como chave: criar uma variante no tipo sem as classes dela é erro de compilação
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary:
    'border border-border-control bg-surface-raised text-primary hover:bg-surface-muted',
  accent: 'bg-accent text-accent-foreground hover:bg-accent-hover',
}

// md tem 44 px de altura: alvo de toque confortável no celular
const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
}

/**
 * Classes do Botão. Fica separado dos componentes para que `<button>` e `<a>`
 * tenham o mesmo visual sem um componente polimórfico.
 */
export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonStyleProps & { className?: string } = {}): string {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(' ')
}
