import type { ComponentPropsWithRef } from 'react'
import { Field, type FieldOwnProps } from './Field'
import { controlStyles } from './fieldStyles'

export type TextFieldProps = ComponentPropsWithRef<'input'> & FieldOwnProps

/**
 * Campo de texto (`<input>`) com rótulo, dica e erro ligados a ele. Serve para texto,
 * e-mail e qualquer outro `type`. As props nativas e o `ref` vão para o `<input>`.
 */
export function TextField({
  label,
  hint,
  error,
  className,
  id,
  'aria-describedby': describedBy,
  ...props
}: TextFieldProps) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      className={className}
      id={id}
      describedBy={describedBy}
    >
      {(controlProps) => <input {...props} {...controlProps} className={controlStyles} />}
    </Field>
  )
}
