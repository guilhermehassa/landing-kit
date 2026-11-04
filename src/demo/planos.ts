import type { PlanoId } from './inscricao/schemas'

export interface Plano {
  // O tipo do id vem do schema do formulário: um plano novo aqui, sem estar no
  // schema, é erro de compilação
  id: PlanoId
  nome: string
  descricao: string
  preco: number
  itens: string[]
  selo?: string
  textoDoBotao: string
}

export const condicaoDePagamento = 'À vista ou em até 12 vezes no cartão.'

// Fica fora da seção porque o formulário também usa (select do plano e eventos)
export const planos: Plano[] = [
  {
    id: 'essencial',
    nome: 'Essencial',
    descricao: 'Para aprender no seu ritmo.',
    preco: 197,
    itens: [
      '24 aulas em vídeo',
      '4 exercícios práticos com gabarito comentado',
      'Guia de bolso em PDF',
      'Certificado de conclusão',
      'Acesso por 12 meses',
    ],
    textoDoBotao: 'Escolher o Essencial',
  },
  {
    id: 'completo',
    nome: 'Completo',
    descricao: 'Para quem quer correção das fotos.',
    preco: 297,
    itens: [
      'Tudo do Essencial',
      '4 encontros ao vivo de correção de fotos, em grupo e gravados',
      'Comunidade da turma para trocar fotos',
      'Acesso por 24 meses',
    ],
    selo: 'Recomendado',
    textoDoBotao: 'Escolher o Completo',
  },
  {
    id: 'mentoria',
    nome: 'Mentoria',
    descricao: 'Para quem quer acompanhamento individual.',
    preco: 697,
    itens: [
      'Tudo do Completo',
      '2 sessões individuais de 45 minutos por vídeo',
      'Análise escrita de 20 fotos suas',
      'Resposta às dúvidas em até 1 dia útil',
    ],
    textoDoBotao: 'Escolher a Mentoria',
  },
]

export function planoPorId(id: PlanoId): Plano {
  const plano = planos.find((item) => item.id === id)
  if (!plano) throw new Error(`Plano desconhecido: ${id}`)
  return plano
}

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

/** "R$ 197", com o espaço não separável do Intl. */
export function formatarPreco(preco: number) {
  return brl.format(preco)
}
