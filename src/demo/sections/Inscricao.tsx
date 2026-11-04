import { FormularioInscricao } from '../inscricao/FormularioInscricao'
import { PainelDeEventos } from '../PainelDeEventos'
import { Secao } from '../Secao'

interface InscricaoProps {
  onAbrirSobre: () => void
  /** Espera do envio simulado, em milissegundos. Os testes passam 0. */
  atrasoDoEnvio?: number
}

export function Inscricao({ onAbrirSobre, atrasoDoEnvio }: InscricaoProps) {
  return (
    <Secao
      id="inscricao"
      titulo="Inscrição"
      subtitulo="Leva menos de 1 minuto. Todos os campos são obrigatórios."
      nota={
        <>
          Esta é uma demonstração: nada do que você digitar sai do seu navegador.{' '}
          {/* Botão com cara de link: abre o Modal, e não navega */}
          <button
            type="button"
            onClick={onAbrirSobre}
            className="not-italic text-primary underline hover:no-underline"
          >
            Sobre esta demonstração
          </button>
        </>
      }
    >
      {/* Lado a lado em tela larga; no celular, o painel fica abaixo do formulário */}
      <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-start">
        <FormularioInscricao atrasoDoEnvio={atrasoDoEnvio} />
        <PainelDeEventos />
      </div>
    </Secao>
  )
}
