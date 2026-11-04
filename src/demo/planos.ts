export type PlanoId = 'essencial' | 'completo' | 'mentoria'

export interface Plano {
  id: PlanoId
  nome: string
  descricao: string
  preco: number
  itens: string[]
  selo?: string
  textoDoBotao: string
}

export const condicaoDePagamento = 'À vista ou em até 12 vezes no cartão.'

// Fica fora da seção porque o formulário do bloco 5 também usa (select do plano e eventos)
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
