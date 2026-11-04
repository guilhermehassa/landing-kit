import { useEffect, useRef } from 'react'
import { planos } from '../planos'
import { EtapaPlano } from './EtapaPlano'
import { EtapaSeuMomento } from './EtapaSeuMomento'
import { EtapaSobreVoce } from './EtapaSobreVoce'
import { Progresso } from './Progresso'
import { useInscricao } from './store'
import { Sucesso } from './Sucesso'

interface FormularioInscricaoProps {
  /** Espera do envio simulado, em milissegundos. Os testes passam 0. */
  atrasoDoEnvio?: number
}

/** Formulário de inscrição em 3 etapas, com o estado na store do Zustand. */
export function FormularioInscricao({ atrasoDoEnvio = 800 }: FormularioInscricaoProps) {
  // Seletores pequenos: o contêiner só re-renderiza quando a etapa ou o status mudam,
  // e não a cada tecla digitada nos campos
  const etapa = useInscricao((s) => s.etapa)
  const concluido = useInscricao((s) => s.status === 'concluido')
  const tela = concluido ? 'sucesso' : etapa

  const tituloRef = useRef<HTMLHeadingElement>(null)
  // Os botões do formulário ligam isto logo antes de trocar de tela. Assim o foco só
  // se move por uma ação dentro do formulário: não no primeiro carregamento da página,
  // e não quando um card de preço, lá em cima, mexe na store
  const focarAoTrocar = useRef(false)

  useEffect(() => {
    if (!focarAoTrocar.current) return
    focarAoTrocar.current = false
    tituloRef.current?.focus()
  }, [tela])

  const propsDaTela = {
    tituloRef,
    onNavegar: () => {
      focarAoTrocar.current = true
    },
  }

  return (
    <div className="flex flex-col gap-4">
      {!concluido && <PlanoEscolhido />}
      <div className="flex flex-col gap-6 rounded-card border border-border bg-surface-raised p-6">
        {!concluido && <Progresso etapa={etapa} />}
        {tela === 1 && <EtapaSobreVoce {...propsDaTela} />}
        {tela === 2 && <EtapaSeuMomento {...propsDaTela} />}
        {tela === 3 && <EtapaPlano {...propsDaTela} atrasoDoEnvio={atrasoDoEnvio} />}
        {tela === 'sucesso' && <Sucesso {...propsDaTela} />}
      </div>
    </div>
  )
}

function PlanoEscolhido() {
  const plano = useInscricao((s) => s.dados.plano)
  const escolhido = planos.find((item) => item.id === plano)
  if (!escolhido) return null

  return (
    <p className="text-sm">
      Plano escolhido: {escolhido.nome}. Você pode trocar na etapa 3.
    </p>
  )
}
