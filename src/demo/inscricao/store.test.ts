import { beforeEach, describe, expect, it } from 'vitest'
import { useInscricao } from './store'

// A store é um singleton do módulo: sem isto, o estado de um teste vaza para o seguinte.
// getInitialState() devolve o estado da criação, e o `true` substitui em vez de mesclar
beforeEach(() => {
  useInscricao.setState(useInscricao.getInitialState(), true)
})

// Fora do React, a store se usa com getState(): é só um objeto com estado e funções
const store = () => useInscricao.getState()

describe('useInscricao', () => {
  it('começa na etapa 1, com tudo vazio', () => {
    expect(store().etapa).toBe(1)
    expect(store().status).toBe('preenchendo')
    expect(store().dados).toEqual({ nome: '', email: '', nivel: '', objetivo: '', plano: '' })
  })

  it('atualizar muda só o campo pedido', () => {
    store().atualizar('nome', 'Maria')
    store().atualizar('email', 'maria@exemplo.com')

    expect(store().dados).toEqual({
      nome: 'Maria',
      email: 'maria@exemplo.com',
      nivel: '',
      objetivo: '',
      plano: '',
    })
  })

  it('avancar e voltar ficam entre as etapas 1 e 3', () => {
    store().voltar()
    expect(store().etapa).toBe(1)

    store().avancar()
    store().avancar()
    store().avancar()
    expect(store().etapa).toBe(3)

    store().voltar()
    expect(store().etapa).toBe(2)
  })

  it('voltar não apaga os dados', () => {
    store().atualizar('nome', 'Maria')
    store().avancar()

    store().voltar()

    expect(store().dados.nome).toBe('Maria')
  })

  it('irPara só volta: não pula etapas para a frente', () => {
    store().irPara(3)
    expect(store().etapa).toBe(1)

    store().avancar()
    store().avancar()
    store().irPara(1)
    expect(store().etapa).toBe(1)
  })

  it('escolherPlano grava o plano sem mudar de etapa', () => {
    store().avancar()

    store().escolherPlano('mentoria')

    expect(store().dados.plano).toBe('mentoria')
    expect(store().etapa).toBe(2)
  })

  it('iniciarEnvio e concluir mudam o status', () => {
    store().iniciarEnvio()
    expect(store().status).toBe('enviando')

    store().concluir()
    expect(store().status).toBe('concluido')
  })

  it('escolher um plano depois de concluir começa uma inscrição nova com ele', () => {
    store().atualizar('nome', 'Maria')
    store().avancar()
    store().avancar()
    store().concluir()

    store().escolherPlano('essencial')

    expect(store().status).toBe('preenchendo')
    expect(store().etapa).toBe(1)
    expect(store().dados).toEqual({ nome: '', email: '', nivel: '', objetivo: '', plano: 'essencial' })
  })

  it('reiniciar volta ao estado inicial e mantém as ações', () => {
    store().atualizar('email', 'maria@exemplo.com')
    store().avancar()
    store().concluir()

    store().reiniciar()

    expect(store().etapa).toBe(1)
    expect(store().status).toBe('preenchendo')
    expect(store().dados.email).toBe('')
    expect(store().avancar).toBeTypeOf('function')
  })
})
