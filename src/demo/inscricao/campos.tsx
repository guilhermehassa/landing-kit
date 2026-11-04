import { SelectField, TextField, type SelectFieldProps, type TextFieldProps } from '@/index'
import { useInscricao } from './store'

// Campos da biblioteca ligados à store. Cada um assina só o próprio valor: ao digitar
// no nome, o campo de e-mail não re-renderiza. Com Context, todos re-renderizariam

type CampoDeTextoProps = Omit<TextFieldProps, 'value'> & {
  campo: 'nome' | 'email'
}

export function CampoDeTexto({ campo, onChange, ...props }: CampoDeTextoProps) {
  const valor = useInscricao((s) => s.dados[campo])
  const atualizar = useInscricao((s) => s.atualizar)

  return (
    <TextField
      {...props}
      value={valor}
      onChange={(event) => {
        // Primeiro grava na store; quem ouve o onChange já lê o valor novo
        atualizar(campo, event.target.value)
        onChange?.(event)
      }}
    />
  )
}

type CampoDeSelecaoProps = Omit<SelectFieldProps, 'value' | 'children'> & {
  campo: 'nivel' | 'objetivo' | 'plano'
  /** Valor → texto da opção, na ordem em que aparecem. */
  opcoes: Record<string, string>
}

export function CampoDeSelecao({ campo, opcoes, onChange, ...props }: CampoDeSelecaoProps) {
  const valor = useInscricao((s) => s.dados[campo])
  const atualizar = useInscricao((s) => s.atualizar)

  return (
    <SelectField
      {...props}
      value={valor}
      onChange={(event) => {
        atualizar(campo, event.target.value)
        onChange?.(event)
      }}
    >
      {/* Valor vazio: a pessoa precisa escolher de propósito, e o Zod reprova o "Selecione" */}
      <option value="">Selecione</option>
      {Object.entries(opcoes).map(([opcao, texto]) => (
        <option key={opcao} value={opcao}>
          {texto}
        </option>
      ))}
    </SelectField>
  )
}
