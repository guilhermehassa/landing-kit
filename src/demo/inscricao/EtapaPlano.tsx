import { Fragment, useId, useRef, type FormEvent } from 'react'
import { Button } from '@/index'
import { planoPorId } from '../planos'
import { track } from '../tracking'
import { CampoDeSelecao } from './campos'
import { textoDaOpcao, textoDoNivel, textoDoObjetivo, textoDoPlano } from './opcoes'
import { inscricaoSchema } from './schemas'
import { useInscricao, type Etapa } from './store'
import { TituloDaEtapa, type PropsDaTela } from './TituloDaEtapa'
import { useValidacao } from './useValidacao'

const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

interface EtapaPlanoProps extends PropsDaTela {
  atrasoDoEnvio: number
}

export function EtapaPlano({ tituloRef, onNavegar, atrasoDoEnvio }: EtapaPlanoProps) {
  const tituloId = useId()
  const planoRef = useRef<HTMLSelectElement>(null)
  // O envio valida tudo de novo, com o schema completo, e não só o plano
  const { validar, propsDoCampo } = useValidacao(inscricaoSchema, { plano: planoRef })
  const enviando = useInscricao((s) => s.status === 'enviando')
  const voltar = useInscricao((s) => s.voltar)
  const irPara = useInscricao((s) => s.irPara)
  const iniciarEnvio = useInscricao((s) => s.iniciarEnvio)
  const concluir = useInscricao((s) => s.concluir)

  function navegarPara(etapa: Etapa) {
    onNavegar()
    irPara(etapa)
  }

  async function confirmar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const inscricao = validar()
    if (!inscricao) return

    iniciarEnvio()
    // Envio simulado: nada sai do navegador. O atraso vem por prop para os testes passarem 0
    await esperar(atrasoDoEnvio)
    onNavegar()
    concluir()
    // O evento de conversão sai quando o envio termina, e não no clique
    track({
      event: 'generate_lead',
      form_name: 'inscricao',
      currency: 'BRL',
      value: planoPorId(inscricao.plano).preco,
      lead_source: 'landing_hora_ambar',
      plan_id: inscricao.plano,
    })
  }

  return (
    <form noValidate onSubmit={confirmar} aria-labelledby={tituloId} className="flex flex-col gap-6">
      <TituloDaEtapa ref={tituloRef} id={tituloId}>
        Etapa 3 de 3: Plano e confirmação
      </TituloDaEtapa>
      <Resumo onEditar={navegarPara} desabilitado={enviando} />
      <CampoDeSelecao
        campo="plano"
        ref={planoRef}
        label="Plano"
        name="plano"
        opcoes={textoDoPlano}
        {...propsDoCampo('plano')}
        disabled={enviando}
      />
      <div className="flex flex-wrap gap-4">
        <Button
          variant="secondary"
          disabled={enviando}
          onClick={() => {
            onNavegar()
            voltar()
          }}
        >
          Voltar
        </Button>
        {/* loading troca o texto para "Enviando…" e ignora novos cliques (bloco 1) */}
        <Button type="submit" loading={enviando}>
          Confirmar inscrição
        </Button>
      </div>
    </form>
  )
}

interface ResumoProps {
  onEditar: (etapa: Etapa) => void
  desabilitado: boolean
}

function Resumo({ onEditar, desabilitado }: ResumoProps) {
  const nome = useInscricao((s) => s.dados.nome)
  const email = useInscricao((s) => s.dados.email)
  const nivel = useInscricao((s) => s.dados.nivel)
  const objetivo = useInscricao((s) => s.dados.objetivo)

  return (
    <div className="flex flex-col gap-4 rounded-control bg-surface-muted p-4">
      <h4 className="font-semibold">Confira seus dados</h4>
      <Grupo
        itens={[
          ['Nome', nome],
          ['E-mail', email],
        ]}
        // O nome acessível começa pelo texto visível, "Editar" (critério 2.5.3), e diz o que edita
        rotuloDoBotao="Editar nome e e-mail"
        onEditar={() => onEditar(1)}
        desabilitado={desabilitado}
      />
      <Grupo
        itens={[
          // O texto da opção, e não o valor guardado ("Sei o básico", e não "basico")
          ['Experiência', textoDaOpcao(textoDoNivel, nivel)],
          ['Objetivo', textoDaOpcao(textoDoObjetivo, objetivo)],
        ]}
        rotuloDoBotao="Editar experiência e objetivo"
        onEditar={() => onEditar(2)}
        desabilitado={desabilitado}
      />
    </div>
  )
}

interface GrupoProps {
  itens: [rotulo: string, valor: string][]
  rotuloDoBotao: string
  onEditar: () => void
  desabilitado: boolean
}

function Grupo({ itens, rotuloDoBotao, onEditar, desabilitado }: GrupoProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <dl className="grid min-w-0 gap-x-4 gap-y-1 sm:grid-cols-[auto_1fr]">
        {itens.map(([rotulo, valor]) => (
          <Fragment key={rotulo}>
            <dt className="text-sm text-text-muted">{rotulo}</dt>
            <dd className="wrap-anywhere">{valor}</dd>
          </Fragment>
        ))}
      </dl>
      <Button
        variant="secondary"
        size="sm"
        aria-label={rotuloDoBotao}
        onClick={onEditar}
        disabled={desabilitado}
      >
        Editar
      </Button>
    </div>
  )
}
