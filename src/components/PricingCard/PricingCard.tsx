import type { ComponentPropsWithRef } from 'react'
import { Button } from '../Button'

type HeadingLevel = 2 | 3 | 4 | 5 | 6

export type PricingCardProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  /** Nome do plano. Vira o título do card. */
  name: string
  description: string
  /** Preço em reais, inteiro (297). */
  price: number
  /** Condição de pagamento, logo abaixo do preço. */
  priceNote?: string
  /** O que o plano inclui. Cada item precisa ser único: é a `key`. */
  features: string[]
  /**
   * Selo em texto, como "Recomendado". O card com selo ganha o destaque (borda de 2 px e
   * sombra): assim o destaque nunca depende só da cor.
   */
  badge?: string
  /**
   * Texto do botão. Inclua o nome do plano ("Escolher o Completo"): três botões
   * "Escolher" iguais não dizem, a quem navega pela lista de botões, qual é qual.
   */
  ctaLabel: string
  /** Chamada ao escolher o plano. O card não sabe o que acontece depois (store, evento…). */
  onEscolher: () => void
  /** Nível do título. Siga a página: numa seção com `h2`, use 3. */
  headingLevel?: HeadingLevel
}

// Criado uma vez, fora do componente, e usado por todos os cards
const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

/** Card de um plano: nome, preço, o que inclui e o botão que escolhe o plano. */
export function PricingCard({
  name,
  description,
  price,
  priceNote,
  features,
  badge,
  ctaLabel,
  onEscolher,
  headingLevel = 3,
  className,
  ...props
}: PricingCardProps) {
  const Heading = `h${headingLevel}` as const

  return (
    <div
      {...props}
      className={[
        'flex flex-col gap-6 rounded-card bg-surface-raised p-6',
        badge ? 'border-2 border-primary shadow-card' : 'border border-border',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-col gap-2">
        <Heading className="text-xl font-semibold">{name}</Heading>
        {/* No HTML, o selo vem depois do nome: quem pula de título em título no leitor de
            tela ouve "Completo" e logo depois "Recomendado". O order-first só muda a tela */}
        {badge && (
          <p className="order-first self-start rounded-pill bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
            {badge}
          </p>
        )}
        <p className="text-text-muted">{description}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p>
          {/* "R$ 297" depende de como cada leitor de tela lê o "R$". O visual fica
              escondido dele, e o texto por extenso fica escondido da tela */}
          <span aria-hidden="true" className="font-display text-4xl font-semibold">
            {brl.format(price)}
          </span>
          <span className="sr-only">{price.toLocaleString('pt-BR')} reais</span>
        </p>
        {priceNote && <p className="text-sm text-text-muted">{priceNote}</p>}
      </div>

      <ul className="flex flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>

      {/* Botão, e não link: escolher um plano é uma ação. mt-auto alinha os botões
          no pé dos cards quando eles ficam lado a lado com alturas diferentes */}
      <Button
        variant={badge ? 'primary' : 'secondary'}
        onClick={onEscolher}
        className="mt-auto w-full"
      >
        {ctaLabel}
      </Button>
    </div>
  )
}

function CheckIcon() {
  return (
    // 24 px, a altura da linha do texto: o ícone alinha com a primeira linha do item
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-6 shrink-0 text-primary">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z"
      />
    </svg>
  )
}
