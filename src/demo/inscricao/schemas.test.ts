import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { etapa1Schema, etapa2Schema, etapa3Schema, inscricaoSchema } from './schemas'

// Mesmo formato que o formulário usa: a lista de mensagens de cada campo
function errosDe(schema: z.ZodType, dados: unknown) {
  const resultado = schema.safeParse(dados)
  return resultado.success ? {} : z.flattenError(resultado.error).fieldErrors
}

const emailValido = 'maria@exemplo.com'

describe('etapa1Schema', () => {
  it.each(['', '   '])('nome %j: só "Informe seu nome."', (nome) => {
    expect(errosDe(etapa1Schema, { nome, email: emailValido })).toEqual({
      nome: ['Informe seu nome.'],
    })
  })

  it.each([
    ['a', 'O nome precisa ter pelo menos 2 letras.'],
    ['a'.repeat(81), 'Use no máximo 80 caracteres.'],
  ])('nome %j: %s', (nome, mensagem) => {
    expect(errosDe(etapa1Schema, { nome, email: emailValido })).toEqual({ nome: [mensagem] })
  })

  it('aceita o nome com espaços e devolve o nome sem eles', () => {
    expect(etapa1Schema.parse({ nome: '  Maria  ', email: emailValido })).toEqual({
      nome: 'Maria',
      email: emailValido,
    })
  })

  it.each([
    ['vazio', '', 'Informe seu e-mail.'],
    ['ausente', undefined, 'Informe seu e-mail.'],
    ['incompleto', 'maria@', 'Confira o e-mail. Ele precisa ter o formato nome@exemplo.com.'],
  ])('e-mail %s: %s', (_caso, email, mensagem) => {
    expect(errosDe(etapa1Schema, { nome: 'Maria', email })).toEqual({ email: [mensagem] })
  })
})

describe('etapa2Schema', () => {
  it('pede as duas escolhas quando estão em "Selecione"', () => {
    expect(errosDe(etapa2Schema, { nivel: '', objetivo: '' })).toEqual({
      nivel: ['Escolha a opção que mais combina com você.'],
      objetivo: ['Escolha o que você mais quer fotografar.'],
    })
  })

  it('aceita valores da lista', () => {
    expect(etapa2Schema.safeParse({ nivel: 'basico', objetivo: 'produtos' }).success).toBe(true)
  })
})

describe('etapa3Schema', () => {
  it('pede um plano', () => {
    expect(errosDe(etapa3Schema, { plano: '' })).toEqual({ plano: ['Escolha um plano.'] })
  })

  it('não aceita um plano fora da lista', () => {
    expect(errosDe(etapa3Schema, { plano: 'premium' })).toEqual({ plano: ['Escolha um plano.'] })
  })
})

describe('inscricaoSchema', () => {
  it('junta as três etapas', () => {
    expect(
      inscricaoSchema.safeParse({
        nome: 'Maria',
        email: emailValido,
        nivel: 'iniciante',
        objetivo: 'familia',
        plano: 'completo',
      }).success,
    ).toBe(true)
  })

  it('reprova se faltar o campo de qualquer etapa', () => {
    expect(
      Object.keys(errosDe(inscricaoSchema, { nome: 'Maria', email: emailValido, plano: 'completo' })),
    ).toEqual(['nivel', 'objetivo'])
  })
})
