import { Button, ButtonLink } from '@/index'

// Vitrine provisória do Botão, só para conferência visual. A landing de verdade vem no bloco 4.
export function App() {
  return (
    <main className="mx-auto flex max-w-content flex-col gap-12 px-6 py-section">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
          landing-kit
        </h1>
        <p className="text-text-muted">Vitrine do Botão: variantes, tamanhos e estados.</p>
      </header>

      <section aria-labelledby="titulo-botoes" className="flex flex-col gap-4">
        <h2 id="titulo-botoes" className="font-display text-3xl font-semibold leading-tight">
          Botão (ação)
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button>Escolher o Completo</Button>
          <Button variant="secondary">Editar</Button>
          <Button size="sm">Escolher o Essencial</Button>
          <Button variant="secondary" size="sm">
            Voltar
          </Button>
          <Button disabled>Desabilitado</Button>
          <Button loading>Enviar inscrição</Button>
        </div>
      </section>

      <section aria-labelledby="titulo-links" className="flex flex-col gap-4">
        <h2 id="titulo-links" className="font-display text-3xl font-semibold leading-tight">
          ButtonLink (navegação)
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="#inscricao">Quero me inscrever</ButtonLink>
          <ButtonLink href="#planos" variant="secondary">
            Ver os planos
          </ButtonLink>
          <ButtonLink href="#inscricao" size="sm">
            Inscrever-se
          </ButtonLink>
        </div>
      </section>

      <section
        aria-labelledby="titulo-faixa"
        data-surface="primary"
        className="flex flex-col gap-4 rounded-card bg-primary p-8 text-primary-foreground"
      >
        <h2 id="titulo-faixa" className="font-display text-3xl font-semibold leading-tight">
          A luz boa volta todo dia. Comece pela próxima.
        </h2>
        <p>Variante accent sobre a faixa índigo, com o foco em âmbar claro.</p>
        <div>
          <ButtonLink href="#inscricao" variant="accent">
            Quero me inscrever
          </ButtonLink>
        </div>
      </section>
    </main>
  )
}
