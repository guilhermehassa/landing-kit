import { useId, useState, type ComponentPropsWithRef, type ReactNode } from 'react'

export interface AccordionItemData {
  /** Pergunta. Vira o texto do botão, dentro do título. Precisa ser única na lista: é a `key`. */
  title: string
  /** Resposta, mostrada ao abrir. */
  content: ReactNode
}

type HeadingLevel = 2 | 3 | 4 | 5 | 6

export type AccordionProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  items: AccordionItemData[]
  /** Nível do título de cada pergunta. Siga a página: numa seção com `h2`, use 3. */
  headingLevel?: HeadingLevel
}

/**
 * Lista de perguntas e respostas no padrão Accordion do WAI-ARIA APG. Cada pergunta
 * abre e fecha sozinha, e várias podem ficar abertas ao mesmo tempo.
 */
export function Accordion({ items, headingLevel = 3, className, ...props }: AccordionProps) {
  return (
    <div
      {...props}
      className={['divide-y divide-border border-y border-border', className]
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item) => (
        <AccordionItem key={item.title} {...item} headingLevel={headingLevel} />
      ))}
    </div>
  )
}

// Cada item guarda o próprio estado: como várias respostas podem ficar abertas ao
// mesmo tempo, nenhum item precisa saber dos outros, e o pai não guarda estado
function AccordionItem({
  title,
  content,
  headingLevel,
}: AccordionItemData & { headingLevel: HeadingLevel }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const buttonId = `${id}-pergunta`
  const panelId = `${id}-resposta`
  const Heading = `h${headingLevel}` as const

  return (
    <div>
      {/* APG: o botão fica dentro do título. Assim a pergunta aparece na lista de
          títulos do leitor de tela e continua sendo um botão, com Enter e Espaço nativos */}
      <Heading className="text-xl font-semibold">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((isOpen) => !isOpen)}
          className="group flex w-full items-center justify-between gap-4 py-4 text-left hover:text-primary"
        >
          {title}
          <ChevronIcon />
        </button>
      </Heading>
      {/* A região fica sempre no DOM, para o aria-controls apontar para algo que existe;
          fechada, o hidden a tira da tela e da árvore de acessibilidade */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="flex max-w-text flex-col gap-4 pb-6 leading-relaxed"
      >
        {content}
      </div>
    </div>
  )
}

function ChevronIcon() {
  return (
    // O estado vem do aria-expanded do botão (group-aria-expanded), e não de outra variável
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-5 shrink-0 text-primary group-aria-expanded:rotate-180 motion-safe:transition-transform"
    >
      <path
        fillRule="evenodd"
        d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
      />
    </svg>
  )
}
