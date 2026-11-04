import type { ComponentPropsWithRef } from 'react'
import { Field, type FieldOwnProps } from './Field'
import { controlStyles } from './fieldStyles'

export type SelectFieldProps = ComponentPropsWithRef<'select'> & FieldOwnProps

/**
 * Lista de opções nativa (`<select>`) com rótulo, dica e erro, igual ao `TextField`.
 * As opções chegam como `<option>` em `children`; a primeira pode ser
 * `<option value="">Selecione</option>`. As props nativas e o `ref` vão para o `<select>`.
 */
export function SelectField({
  label,
  hint,
  error,
  className,
  id,
  'aria-describedby': describedBy,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      className={className}
      id={id}
      describedBy={describedBy}
    >
      {(controlProps) => (
        <select {...props} {...controlProps} className={controlStyles}>
          {children}
        </select>
      )}
    </Field>
  )
}
