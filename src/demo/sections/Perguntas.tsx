import { Accordion, type AccordionItemData } from '@/index'
import { Secao } from '../Secao'

const perguntas: AccordionItemData[] = [
  {
    title: 'Preciso de um celular específico?',
    content: (
      <p>
        Não. Qualquer celular com câmera serve. O curso usa só os recursos que todo aparelho tem:
        foco, exposição e o editor que já vem instalado.
      </p>
    ),
  },
  {
    title: 'Preciso ter experiência com fotografia?',
    content: (
      <p>
        Não. O curso começa do zero e explica cada termo técnico antes de usar. Se você já
        fotografa, os exercícios têm uma versão avançada.
      </p>
    ),
  },
  {
    title: 'Quanto tempo por semana vou precisar?',
    content: (
      <p>
        Cerca de 2 horas: 6 aulas de até 12 minutos e um exercício prático. Você assiste no seu
        ritmo, no horário que quiser.
      </p>
    ),
  },
  {
    title: 'Por quanto tempo tenho acesso?',
    content: (
      <p>12 meses no Essencial e 24 meses no Completo e na Mentoria, a partir da inscrição.</p>
    ),
  },
  {
    title: 'Tem certificado?',
    content: (
      <p>
        Sim. Ao concluir as 24 aulas e os 4 exercícios, você recebe um certificado digital de
        conclusão.
      </p>
    ),
  },
  {
    title: 'E se eu não gostar?',
    content: (
      <p>
        Você tem 7 dias de garantia. Se pedir o reembolso nesse prazo, devolvemos o valor
        integral.
      </p>
    ),
  },
]

export function Perguntas() {
  return (
    <Secao id="perguntas" titulo="Perguntas frequentes" fundo="surface-muted">
      <Accordion items={perguntas} headingLevel={3} className="max-w-text" />
    </Secao>
  )
}
