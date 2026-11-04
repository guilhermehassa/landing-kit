import { Secao } from '../Secao'

const beneficios = [
  {
    titulo: 'Saber a hora certa',
    texto:
      'Você aprende a reconhecer a hora dourada e a hora azul e a planejar a foto pelo horário, e não pela sorte.',
  },
  {
    titulo: 'Luz bonita dentro de casa',
    texto:
      'Uma janela vira o seu estúdio. Você aprende a posicionar a pessoa ou o produto para ter uma luz suave, sem equipamento.',
  },
  {
    titulo: 'Composição sem decoreba',
    texto: 'Três regras práticas de enquadramento, com exercícios que cabem no seu dia.',
  },
  {
    titulo: 'Edição no próprio celular',
    texto:
      'Ajustes de luz, cor e recorte no editor que já vem no aparelho. Sem app pago.',
  },
]

export function Beneficios() {
  return (
    <Secao
      id="beneficios"
      titulo="O que muda nas suas fotos"
      subtitulo="A luz decide metade da foto. O resto é saber onde ficar e o que ajustar."
      fundo="surface-muted"
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {beneficios.map((beneficio) => (
          <li
            key={beneficio.titulo}
            className="flex flex-col gap-2 rounded-card border border-border bg-surface-raised p-6"
          >
            <h3 className="text-xl font-semibold">{beneficio.titulo}</h3>
            <p className="leading-relaxed">{beneficio.texto}</p>
          </li>
        ))}
      </ul>
    </Secao>
  )
}
