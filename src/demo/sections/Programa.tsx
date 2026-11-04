import { Secao } from '../Secao'

const modulos = [
  {
    semana: 1,
    modulo: 'Ler a luz',
    conteudo: 'Luz dura e luz suave, direção da luz, hora dourada e hora azul.',
  },
  {
    semana: 2,
    modulo: 'Luz de janela',
    conteudo: 'Retratos e produtos dentro de casa, com rebatedor improvisado.',
  },
  {
    semana: 3,
    modulo: 'Composição',
    conteudo: 'Enquadramento, fundo limpo, linhas e ponto de vista.',
  },
  {
    semana: 4,
    modulo: 'Edição no celular',
    conteudo:
      'Luz, cor e recorte no editor do aparelho, e como manter as fotos coerentes entre si.',
  },
]

export function Programa() {
  return (
    <Secao
      id="programa"
      titulo="4 semanas, 4 módulos"
      subtitulo="Cada semana tem 6 aulas curtas e um exercício prático."
      fundo="surface-muted"
    >
      {/* Lista ordenada: a ordem das semanas é informação */}
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {modulos.map((item) => (
          <li
            key={item.semana}
            className="flex flex-col gap-2 rounded-card border border-border bg-surface-raised p-6"
          >
            {/* A semana fica no título, para quem pula de título em título ouvir "Semana 1:
                Ler a luz". Os dois pedaços estão em linhas diferentes na tela, mas no nome
                acessível ficariam colados: o ":" escondido e o espaço os separam */}
            <h3 className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-primary">
                Semana {item.semana}
                <span className="sr-only">:</span>
              </span>{' '}
              <span className="text-xl font-semibold">{item.modulo}</span>
            </h3>
            <p className="leading-relaxed">{item.conteudo}</p>
          </li>
        ))}
      </ol>
    </Secao>
  )
}
