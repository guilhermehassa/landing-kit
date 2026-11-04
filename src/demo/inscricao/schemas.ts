import { z } from 'zod'

// Um schema por etapa: cada "Continuar" valida só o que está na tela

export const etapa1Schema = z.object({
  nome: z
    .string({ error: 'Informe seu nome.' })
    .trim()
    // abort: com o nome vazio, para aqui e mostra só esta mensagem
    .min(1, { error: 'Informe seu nome.', abort: true })
    .min(2, { error: 'O nome precisa ter pelo menos 2 letras.' })
    .max(80, { error: 'Use no máximo 80 caracteres.' }),
  // Sem trim: o <input type="email"> já tira os espaços das pontas (regra do HTML)
  email: z.email({
    error: (iss) =>
      iss.input === undefined || iss.input === ''
        ? 'Informe seu e-mail.'
        : 'Confira o e-mail. Ele precisa ter o formato nome@exemplo.com.',
  }),
})

export const etapa2Schema = z.object({
  nivel: z.enum(['iniciante', 'basico', 'frequente'], {
    error: 'Escolha a opção que mais combina com você.',
  }),
  objetivo: z.enum(['viagens', 'familia', 'produtos', 'redes'], {
    error: 'Escolha o que você mais quer fotografar.',
  }),
})

export const etapa3Schema = z.object({
  plano: z.enum(['essencial', 'completo', 'mentoria'], { error: 'Escolha um plano.' }),
})

// O envio valida tudo de novo. No Zod 4, .merge() está depreciado: a doc sugere o spread de .shape
export const inscricaoSchema = z.object({
  ...etapa1Schema.shape,
  ...etapa2Schema.shape,
  ...etapa3Schema.shape,
})

// Os tipos saem dos schemas: a regra, a mensagem e o tipo têm uma fonte só
export type Inscricao = z.infer<typeof inscricaoSchema>
export type Nivel = Inscricao['nivel']
export type Objetivo = Inscricao['objetivo']
export type PlanoId = Inscricao['plano']
export type Campo = keyof Inscricao

/**
 * O que o formulário guarda enquanto a pessoa preenche: o texto cru de cada campo,
 * ainda sem validar. Nos selects, '' é o "Selecione".
 */
export type Rascunho = Record<Campo, string>
