import { useId, useRef, type FormEvent } from 'react'
import { Button } from '@/index'
import { track } from '../tracking'
import { CampoDeSelecao } from './campos'
import { textoDoNivel, textoDoObjetivo } from './opcoes'
import { etapa2Schema } from './schemas'
import { useInscricao } from './store'
import { TituloDaEtapa, type PropsDaTela } from './TituloDaEtapa'
import { useValidacao } from './useValidacao'

export function EtapaSeuMomento({ tituloRef, onNavegar }: PropsDaTela) {
  const tituloId = useId()
  const nivelRef = useRef<HTMLSelectElement>(null)
  const objetivoRef = useRef<HTMLSelectElement>(null)
  const { validar, propsDoCampo } = useValidacao(etapa2Schema, {
    nivel: nivelRef,
    objetivo: objetivoRef,
  })
  const avancar = useInscricao((s) => s.avancar)
  const voltar = useInscricao((s) => s.voltar)

  function continuar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validar()) return
    track({
      event: 'form_step_complete',
      form_name: 'inscricao',
      step_number: 2,
      step_name: 'seu_momento',
    })
    onNavegar()
    avancar()
  }

  return (
    <form noValidate onSubmit={continuar} aria-labelledby={tituloId} className="flex flex-col gap-6">
      <TituloDaEtapa ref={tituloRef} id={tituloId}>
        Etapa 2 de 3: Seu momento
      </TituloDaEtapa>
      <CampoDeSelecao
        campo="nivel"
        ref={nivelRef}
        label="Sua experiência com fotografia"
        name="nivel"
        opcoes={textoDoNivel}
        {...propsDoCampo('nivel')}
      />
      <CampoDeSelecao
        campo="objetivo"
        ref={objetivoRef}
        label="O que você mais quer fotografar?"
        name="objetivo"
        opcoes={textoDoObjetivo}
        {...propsDoCampo('objetivo')}
      />
      <div className="flex flex-wrap gap-4">
        {/* Voltar não valida nem apaga nada: os dados já estão na store */}
        <Button
          variant="secondary"
          onClick={() => {
            onNavegar()
            voltar()
          }}
        >
          Voltar
        </Button>
        <Button type="submit">Continuar</Button>
      </div>
    </form>
  )
}
