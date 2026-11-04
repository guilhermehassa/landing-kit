import { create } from 'zustand'
import type { Campo, PlanoId, Rascunho } from './schemas'

export type Etapa = 1 | 2 | 3
export type Status = 'preenchendo' | 'enviando' | 'concluido'

interface InscricaoState {
  etapa: Etapa
  dados: Rascunho
  status: Status
  atualizar: (campo: Campo, valor: string) => void
  avancar: () => void
  voltar: () => void
  /** Só para trás: é o "Editar" do resumo. Avançar exige validar a etapa. */
  irPara: (etapa: Etapa) => void
  escolherPlano: (plano: PlanoId) => void
  iniciarEnvio: () => void
  concluir: () => void
  reiniciar: () => void
}

const estadoInicial = {
  etapa: 1 as Etapa,
  dados: { nome: '', email: '', nivel: '', objetivo: '', plano: '' },
  status: 'preenchendo' as Status,
}

/**
 * Estado do formulário de inscrição, compartilhado entre as 3 etapas e o card de
 * preço, que fica em outra parte da página. Sem Provider: qualquer componente usa o hook.
 *
 * A store não valida e não rastreia. A etapa valida com o Zod, dispara o evento e só
 * então chama `avancar()`: as três partes ficam pequenas e se testam separadas.
 *
 * Sem o middleware `persist`, de propósito: nome e e-mail não vão para o
 * localStorage. Recarregar a página apaga tudo, como o aviso da seção promete.
 *
 * Nos componentes, assine só o pedaço que usa: `useInscricao((s) => s.dados.nome)`.
 * Pegar a store inteira (`useInscricao()`) re-renderiza a cada tecla em qualquer campo.
 */
export const useInscricao = create<InscricaoState>()((set) => ({
  ...estadoInicial,

  // Cópia nova de `dados`: o Zustand compara por referência para saber o que mudou
  atualizar: (campo, valor) => set((s) => ({ dados: { ...s.dados, [campo]: valor } })),

  avancar: () => set((s) => ({ etapa: Math.min(s.etapa + 1, 3) as Etapa })),

  voltar: () => set((s) => ({ etapa: Math.max(s.etapa - 1, 1) as Etapa })),

  // Devolver o próprio estado é "não mudou nada": o Zustand não avisa ninguém
  irPara: (etapa) => set((s) => (etapa < s.etapa ? { etapa } : s)),

  // Depois de uma inscrição concluída, escolher outro card começa uma inscrição nova
  escolherPlano: (plano) =>
    set((s) =>
      s.status === 'concluido'
        ? { ...estadoInicial, dados: { ...estadoInicial.dados, plano } }
        : { dados: { ...s.dados, plano } },
    ),

  iniciarEnvio: () => set({ status: 'enviando' }),

  concluir: () => set({ status: 'concluido' }),

  // O set mescla: as ações continuam na store, e só o estado volta ao início
  reiniciar: () => set(estadoInicial),
}))
