import { useState, type RefObject } from 'react'
import { flushSync } from 'react-dom'
import { z } from 'zod'
import type { Campo } from './schemas'
import { useInscricao } from './store'

type Erros = Partial<Record<Campo, string>>
type RefDoCampo = RefObject<HTMLInputElement | HTMLSelectElement | null>

// Só a primeira mensagem de cada campo, no formato que a doc do Zod 4 recomenda
// para formulário de um nível (z.flattenError, e não o .flatten() depreciado)
function errosPorCampo(error: z.ZodError): Erros {
  const { fieldErrors }: { fieldErrors: Partial<Record<string, string[]>> } =
    z.flattenError(error)
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([campo, mensagens]) => [campo, mensagens?.[0]]),
  )
}

/**
 * Validação de uma etapa. Os erros ficam aqui, em useState, e não na store: só a
 * etapa usa. `campos` traz os campos da etapa na ordem da tela, com o ref de cada um:
 * é para o primeiro inválido que o foco vai.
 */
export function useValidacao<S extends z.ZodType>(
  schema: S,
  campos: Partial<Record<Campo, RefDoCampo>>,
) {
  const [erros, setErros] = useState<Erros>({})
  // Antes da primeira tentativa de avançar, nada de erro: a pessoa ainda está preenchendo
  const [tentou, setTentou] = useState(false)

  // getState(): lê a store na hora, sem assinar. A etapa não re-renderiza a cada tecla
  const checar = () => schema.safeParse(useInscricao.getState().dados)

  /** Valida a etapa. Devolve os dados validados (e transformados, como o trim) ou null. */
  function validar(): z.infer<S> | null {
    const resultado = checar()
    if (resultado.success) {
      setErros({})
      return resultado.data
    }

    const novos = errosPorCampo(resultado.error)
    // flushSync: o React atualiza o DOM agora, antes do foco. Assim o campo já está com
    // aria-invalid e com a mensagem ligada quando o leitor de tela o anuncia
    flushSync(() => {
      setErros(novos)
      setTentou(true)
    })
    // Object.keys devolve string[]; aqui as chaves são campos, na ordem da tela
    const primeiroInvalido = (Object.keys(campos) as Campo[]).find((campo) => novos[campo])
    if (primeiroInvalido) campos[primeiroInvalido]?.current?.focus()
    return null
  }

  function erroDe(campo: Campo) {
    const resultado = checar()
    return resultado.success ? undefined : errosPorCampo(resultado.error)[campo]
  }

  /**
   * Liga a validação a um campo. Depois da primeira tentativa:
   * - ao sair do campo, ele é revalidado (o erro aparece, muda ou some);
   * - ao digitar ou escolher, o erro some assim que o valor fica válido, mas um erro
   *   novo só aparece ao sair. Não se acusa erro no meio da digitação.
   *
   * Sumir já na mudança evita um clique perdido: se a mensagem sumisse só no blur,
   * ela sumiria no mousedown do "Continuar", o botão subiria, e o mouseup cairia fora dele.
   */
  function propsDoCampo(campo: Campo) {
    return {
      error: erros[campo],
      onBlur: () => {
        if (tentou) setErros((atuais) => ({ ...atuais, [campo]: erroDe(campo) }))
      },
      onChange: () => {
        if (erros[campo] && !erroDe(campo)) setErros((atuais) => ({ ...atuais, [campo]: undefined }))
      },
    }
  }

  return { validar, propsDoCampo }
}
