import { useId, useRef, type FormEvent } from 'react'
import { Button } from '@/index'
import { track } from '../tracking'
import { CampoDeTexto } from './campos'
import { etapa1Schema } from './schemas'
import { useInscricao } from './store'
import { TituloDaEtapa, type PropsDaTela } from './TituloDaEtapa'
import { useValidacao } from './useValidacao'

export function EtapaSobreVoce({ tituloRef, onNavegar }: PropsDaTela) {
  const tituloId = useId()
  const nomeRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const { validar, propsDoCampo } = useValidacao(etapa1Schema, {
    nome: nomeRef,
    email: emailRef,
  })
  const avancar = useInscricao((s) => s.avancar)

  function continuar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validar()) return
    // A ordem é a do §5.3: valida, dispara o evento e só então avança
    track({
      event: 'form_step_complete',
      form_name: 'inscricao',
      step_number: 1,
      step_name: 'sobre_voce',
    })
    onNavegar()
    avancar()
  }

  return (
    // noValidate: sem ele, o required e o type="email" abririam o balão do navegador,
    // e as mensagens do Zod não apareceriam. O required fica: o leitor de tela anuncia
    <form noValidate onSubmit={continuar} aria-labelledby={tituloId} className="flex flex-col gap-6">
      <TituloDaEtapa ref={tituloRef} id={tituloId}>
        Etapa 1 de 3: Sobre você
      </TituloDaEtapa>
      <CampoDeTexto
        campo="nome"
        ref={nomeRef}
        label="Nome"
        name="nome"
        autoComplete="name"
        required
        {...propsDoCampo('nome')}
      />
      <CampoDeTexto
        campo="email"
        ref={emailRef}
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        hint="Use o e-mail que você mais confere."
        required
        {...propsDoCampo('email')}
      />
      <div className="flex flex-wrap gap-4">
        <Button type="submit">Continuar</Button>
      </div>
    </form>
  )
}
