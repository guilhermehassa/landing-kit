import { PricingCard } from '@/index'
import { condicaoDePagamento, planos, type Plano } from '../planos'
import { Secao } from '../Secao'

interface PlanosProps {
  onEscolher: (plano: Plano) => void
}

export function Planos({ onEscolher }: PlanosProps) {
  return (
    <Secao
      id="planos"
      titulo="Escolha seu plano"
      subtitulo="Pagamento único. 7 dias de garantia em todos os planos."
      fundo="surface-muted"
    >
      {/* Uma coluna até 64rem: três cards lado a lado num tablet ficariam estreitos demais */}
      <ul className="mx-auto grid w-full max-w-md gap-6 lg:max-w-none lg:grid-cols-3">
        {planos.map((plano) => (
          <li key={plano.id}>
            <PricingCard
              name={plano.nome}
              description={plano.descricao}
              price={plano.preco}
              priceNote={condicaoDePagamento}
              features={plano.itens}
              badge={plano.selo}
              ctaLabel={plano.textoDoBotao}
              onEscolher={() => onEscolher(plano)}
              className="h-full"
            />
          </li>
        ))}
      </ul>
    </Secao>
  )
}
