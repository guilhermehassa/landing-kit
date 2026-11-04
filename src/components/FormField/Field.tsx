import { useId, type ReactNode } from 'react'

export interface FieldOwnProps {
  /** Rótulo sempre visível. Placeholder não substitui rótulo: some ao digitar. */
  label: string
  /** Dica sobre o dado pedido. Aparece entre o rótulo e o campo. */
  hint?: string
  /** Mensagem de erro. Com ela, o campo ganha `aria-invalid` e a borda `danger`. */
  error?: string
  /** Classes do contêiner (rótulo, campo e mensagens), para posicionar o campo na página. */
  className?: string
}

/** O que liga o controle ao rótulo, à dica e ao erro. */
interface FieldControlProps {
  id: string
  'aria-describedby': string | undefined
  'aria-invalid': true | undefined
}

interface FieldProps extends FieldOwnProps {
  id: string | undefined
  describedBy: string | undefined
  children: (control: FieldControlProps) => ReactNode
}

/**
 * Estrutura comum do TextField e do SelectField: rótulo, dica, controle e erro.
 * O controle chega por render prop, para cada campo renderizar o próprio elemento
 * nativo com os ids e atributos ARIA certos.
 */
export function Field({ label, hint, error, className, id, describedBy, children }: FieldProps) {
  // useId gera um id único e estável, igual no servidor e no cliente
  const generatedId = useId()
  const controlId = id ?? generatedId
  const hintId = `${controlId}-dica`
  const errorId = `${controlId}-erro`

  // Mantém o aria-describedby de quem usa o campo e soma a dica e o erro, nessa ordem
  const describedByIds = [describedBy, hint && hintId, error && errorId].filter(Boolean).join(' ')

  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      <label htmlFor={controlId} className="font-semibold">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-text-muted">
          {hint}
        </p>
      )}
      {children({
        id: controlId,
        'aria-describedby': describedByIds || undefined,
        'aria-invalid': error ? true : undefined,
      })}
      {error && (
        <p id={errorId} className="flex gap-1 text-sm font-semibold text-danger">
          <ErrorIcon />
          <span>
            {/* O erro não depende só da cor: tem ícone e texto. O "Erro:" escondido separa,
                para quem ouve, a mensagem de erro da dica, lidas em sequência */}
            <span className="sr-only">Erro:</span> {error}
          </span>
        </p>
      )}
    </div>
  )
}

function ErrorIcon() {
  return (
    // 20 px, a altura da linha do text-sm: o ícone alinha com a primeira linha da mensagem
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-5 shrink-0">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-.75-11.5a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4ZM10 14.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
    </svg>
  )
}
