import { ButtonLink } from '@/index'

export function ChamadaFinal() {
  return (
    // data-surface="primary" troca o token de foco para o âmbar claro, que tem contraste
    // sobre o índigo. Só a cor de fundo não bastaria
    <section
      aria-labelledby="chamada-final-titulo"
      data-surface="primary"
      className="bg-primary py-section text-primary-foreground"
    >
      <div className="mx-auto flex max-w-content flex-col items-center gap-6 px-4 text-center sm:px-6">
        <h2
          id="chamada-final-titulo"
          className="font-display text-3xl font-semibold leading-tight md:text-4xl"
        >
          A luz boa volta todo dia. Comece pela próxima.
        </h2>
        <p className="max-w-text text-lg leading-relaxed">
          Assista à primeira aula hoje e saia para fotografar no fim da tarde.
        </p>
        <ButtonLink href="#inscricao" variant="accent">
          Quero me inscrever
        </ButtonLink>
      </div>
    </section>
  )
}
