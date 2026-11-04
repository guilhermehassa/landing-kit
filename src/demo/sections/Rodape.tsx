interface RodapeProps {
  onAbrirSobre: () => void
}

// Link dentro de texto não pode depender só da cor: os do rodapé são sublinhados
const link = 'text-primary underline hover:no-underline'

export function Rodape({ onAbrirSobre }: RodapeProps) {
  return (
    <footer className="bg-surface-muted py-12 text-sm text-text-muted">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-4 sm:px-6">
        <p>
          <strong className="font-semibold text-text">Hora Âmbar</strong> é um curso fictício,
          criado para demonstrar o landing-kit. Pessoas, depoimentos, planos e preços são
          inventados.
        </p>
        <p>
          Demonstração feita por Guilherme Hassã ·{' '}
          <a href="https://hassa.dev.br" className={link}>
            hassa.dev.br
          </a>{' '}
          ·{' '}
          <a href="https://www.linkedin.com/in/guilhermehassa/" className={link}>
            LinkedIn
          </a>
        </p>
        <p>
          {/* Botão com cara de link: abre o Modal, e não navega (link × botão, §3) */}
          <button type="button" onClick={onAbrirSobre} className={link}>
            Sobre esta demonstração
          </button>
        </p>
      </div>
    </footer>
  )
}
