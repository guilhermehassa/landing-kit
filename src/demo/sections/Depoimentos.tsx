import { Testimonial } from '@/index'
import { Secao } from '../Secao'

const depoimentos = [
  {
    texto:
      'Eu fotografava os bolos à noite, com a luz da cozinha. Depois do módulo de luz de janela, passei a fotografar de manhã, perto da janela, e as fotos pararam de sair amareladas.',
    nome: 'Renata M.',
    contexto: 'Confeiteira, Campinas (SP)',
  },
  {
    texto:
      'Achei que precisava trocar de celular. Precisava era saber a hora de sair para fotografar. As fotos da minha última viagem são outras.',
    nome: 'Caio T.',
    contexto: 'Professor, Recife (PE)',
  },
  {
    texto:
      'As aulas curtas cabem no intervalo do almoço. Fiz os exercícios com meus filhos de modelo, e hoje as fotos da família ficam bonitas sem eu pedir para todo mundo sorrir.',
    nome: 'Juliana P.',
    contexto: 'Enfermeira, Londrina (PR)',
  },
  {
    texto:
      'Vendo artesanato pelas redes, e as fotos eram o meu ponto fraco. Com fundo limpo e a luz certa, meus produtos parecem outros.',
    nome: 'Marcos V.',
    contexto: 'Artesão, Belém (PA)',
  },
]

export function Depoimentos() {
  return (
    <Secao
      id="depoimentos"
      titulo="Quem já fez o curso"
      nota="Depoimentos fictícios, criados para esta demonstração."
    >
      <ul className="grid gap-6 md:grid-cols-2">
        {depoimentos.map((depoimento) => (
          <li key={depoimento.nome}>
            <Testimonial
              quote={depoimento.texto}
              name={depoimento.nome}
              context={depoimento.contexto}
              className="h-full"
            />
          </li>
        ))}
      </ul>
    </Secao>
  )
}
