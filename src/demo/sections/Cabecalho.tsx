import { ButtonLink } from '@/index'

const navegacao = [
  { href: '#programa', texto: 'Programa' },
  { href: '#planos', texto: 'Planos' },
  { href: '#perguntas', texto: 'Perguntas' },
]

export function Cabecalho() {
  return (
    <header>
      {/* Primeiro item focável da página: no primeiro Tab, ele aparece e leva ao <main> */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-20 focus:rounded-control focus:bg-surface-raised focus:px-4 focus:py-2 focus:font-semibold focus:text-primary focus:shadow-card"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex max-w-content items-center gap-6 px-4 py-4 sm:px-6">
        {/* Sem logo: o nome em texto, na fonte de títulos */}
        <p className="font-display text-xl font-semibold">Hora Âmbar</p>
        {/* Sem menu hambúrguer: no celular ficam só o nome e o Inscrever-se */}
        <nav aria-label="Seções da página" className="ml-auto hidden md:block">
          <ul className="flex gap-6">
            {navegacao.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="font-semibold hover:text-primary hover:underline">
                  {item.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ButtonLink href="#inscricao" size="sm" className="ml-auto md:ml-0">
          Inscrever-se
        </ButtonLink>
      </div>
    </header>
  )
}
