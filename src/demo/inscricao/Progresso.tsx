import type { Etapa } from './store'

const nomes = ['Sobre você', 'Seu momento', 'Plano']

export function Progresso({ etapa }: { etapa: Etapa }) {
  return (
    <ol aria-label="Etapas da inscrição" className="grid grid-cols-3 gap-2 text-sm">
      {nomes.map((nome, indice) => {
        const numero = indice + 1
        const atual = numero === etapa
        const concluida = numero < etapa

        return (
          // aria-current="step": o leitor de tela diz qual é a etapa atual
          <li key={nome} aria-current={atual ? 'step' : undefined} className="flex flex-col gap-2">
            <span
              aria-hidden="true"
              className={['h-1 rounded-pill', numero <= etapa ? 'bg-primary' : 'bg-border-control']
                .filter(Boolean)
                .join(' ')}
            />
            {/* Sem depender só da cor: a atual fica em negrito, e as concluídas têm o ícone */}
            <span
              className={['flex gap-1', atual ? 'font-semibold text-text' : 'text-text-muted'].join(
                ' ',
              )}
            >
              {concluida && <IconeDeConcluida />}
              <span>
                {nome}
                {concluida && (
                  <>
                    {' '}
                    <span className="sr-only">(concluída)</span>
                  </>
                )}
              </span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function IconeDeConcluida() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-5 shrink-0 text-primary">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z"
      />
    </svg>
  )
}
