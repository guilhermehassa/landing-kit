import { Button } from '@/index'
import { useInscricao } from './store'
import { TituloDaEtapa, type PropsDaTela } from './TituloDaEtapa'

export function Sucesso({ tituloRef, onNavegar }: PropsDaTela) {
  const nome = useInscricao((s) => s.dados.nome)
  const email = useInscricao((s) => s.dados.email)
  const reiniciar = useInscricao((s) => s.reiniciar)
  const primeiroNome = nome.trim().split(/\s+/)[0]

  return (
    <div className="flex flex-col gap-4">
      <TituloDaEtapa ref={tituloRef} className="flex items-center gap-2 text-success">
        <IconeDeSucesso />
        Inscrição recebida, {primeiroNome}!
      </TituloDaEtapa>
      <p className="leading-relaxed wrap-anywhere">
        Numa versão real, o acesso chegaria agora em {email}. Como esta é uma demonstração, nada
        foi enviado.
      </p>
      <p className="text-sm text-text-muted">
        O evento de conversão (<code>generate_lead</code>) acabou de aparecer no painel "Eventos
        disparados", sem nome nem e-mail.
      </p>
      <div>
        <Button
          variant="secondary"
          onClick={() => {
            onNavegar()
            reiniciar()
          }}
        >
          Fazer outra inscrição
        </Button>
      </div>
    </div>
  )
}

function IconeDeSucesso() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-6 shrink-0">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.86-9.86a.75.75 0 0 0-1.22-.88l-3.2 4.43-1.6-1.6a.75.75 0 1 0-1.06 1.06l2.22 2.22a.75.75 0 0 0 1.14-.09l3.72-5.14Z"
      />
    </svg>
  )
}
