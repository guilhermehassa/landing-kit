import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SelectField, type SelectFieldProps } from './SelectField'

const erro = 'Escolha a opção que mais combina com você.'

function renderNivel(props: Partial<SelectFieldProps> = {}) {
  return render(
    <SelectField label="Sua experiência com fotografia" defaultValue="" {...props}>
      <option value="">Selecione</option>
      <option value="iniciante">Nunca estudei fotografia</option>
      <option value="basico">Sei o básico</option>
    </SelectField>,
  )
}

describe('SelectField', () => {
  it('é uma lista de opções com o nome do rótulo', () => {
    renderNivel()

    // <select> simples tem o papel combobox
    const select = screen.getByRole('combobox', { name: 'Sua experiência com fotografia' })
    expect(select).toHaveValue('')
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('troca a opção e avisa por onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderNivel({ onChange })

    const select = screen.getByRole('combobox', { name: 'Sua experiência com fotografia' })
    await user.selectOptions(select, 'Sei o básico')

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(select).toHaveValue('basico')
  })

  it('recebe foco pelo Tab', async () => {
    const user = userEvent.setup()
    renderNivel()

    await user.tab()

    expect(screen.getByRole('combobox', { name: 'Sua experiência com fotografia' })).toHaveFocus()
  })

  it('com erro: marca aria-invalid e liga a mensagem pelo aria-describedby', () => {
    renderNivel({ error: erro })

    const select = screen.getByRole('combobox', { name: 'Sua experiência com fotografia' })
    expect(select).toHaveAttribute('aria-invalid', 'true')
    expect(select).toHaveAccessibleDescription(`Erro: ${erro}`)
  })
})
