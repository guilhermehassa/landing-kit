import { ButtonLink } from '@/index'

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="inicio-titulo" className="py-section">
      <div className="mx-auto grid max-w-content items-center gap-12 px-4 sm:px-6 md:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-6">
          <p className="font-semibold text-primary">Curso online de fotografia com celular</p>
          <h1
            id="inicio-titulo"
            className="font-display text-4xl font-semibold leading-tight md:text-5xl"
          >
            Fotos com luz bonita, usando só o seu celular
          </h1>
          <p className="max-w-text text-lg leading-relaxed text-text-muted">
            Em 4 semanas, você aprende a ler a luz natural, escolher o melhor horário e editar no
            próprio aparelho. Sem câmera, sem estúdio e sem termos técnicos.
          </p>
          <div className="flex flex-wrap gap-4">
            <ButtonLink href="#inscricao">Quero me inscrever</ButtonLink>
            <ButtonLink href="#planos" variant="secondary">
              Ver os planos
            </ButtonLink>
          </div>
          <p className="text-sm text-text-muted">
            4 semanas · 24 aulas de até 12 minutos · certificado de conclusão
          </p>
        </div>
        {/* O sol: decorativo, ao lado do texto e nunca atrás dele. No celular não há
            "ao lado", então ele só aparece a partir de 48rem */}
        <div
          aria-hidden="true"
          className="hidden aspect-square rounded-pill bg-radial from-accent to-transparent to-70% md:block"
        />
      </div>
    </section>
  )
}
