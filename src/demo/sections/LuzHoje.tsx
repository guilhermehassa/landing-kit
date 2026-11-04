import { useState, type ReactNode } from 'react'
import { Button, SelectField } from '@/index'
import { cidadePadrao, cidadePorId, cidades, type Cidade } from '../luz/cidades'
import { textoDoVeredito, type DiaDeLuz } from '../luz/regras'
import { useLuzHoje } from '../luz/useLuzHoje'
import { Secao } from '../Secao'

// Sem timeZone: "atualizada às" segue o relógio de quem lê, e não o da cidade
const formatoDaHora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })

const link = 'text-primary underline hover:no-underline'

export function LuzHoje() {
  // A cidade é estado local, porque só esta seção usa. A previsão não vai para um useState:
  // quem guarda é o TanStack Query, com uma cópia por cidade
  const [cidade, setCidade] = useState(cidadePadrao)
  const { data: dias, isPending, isError, isFetching, dataUpdatedAt, refetch } =
    useLuzHoje(cidade)

  const erroVisivel = isError && !isFetching

  return (
    <Secao
      id="luz-hoje"
      titulo="Onde está a luz hoje?"
      subtitulo="A primeira aula começa aqui. Escolha uma cidade e veja quando a luz fica dourada nos próximos 3 dias."
    >
      <div className="flex flex-col gap-6">
        <SelectField
          label="Cidade"
          hint="Os horários são os da própria cidade."
          value={cidade.id}
          onChange={(event) => setCidade(cidadePorId(event.target.value))}
          className="max-w-xs"
        >
          {cidades.map((item) => (
            <option key={item.id} value={item.id}>
              {item.rotulo}
            </option>
          ))}
        </SelectField>

        <div
          className={[
            'flex flex-col items-start gap-4',
            erroVisivel && 'rounded-card bg-danger-surface p-6',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {/* A única região viva da seção: existe desde o início e só troca de texto, porque
              uma região criada junto com a mensagem às vezes não é anunciada. Os cards ficam
              fora dela (3 cards a cada troca seria falatório) e não levam aria-busy: quem diz
              o estado é esta linha */}
          <p
            role="status"
            className={erroVisivel ? 'font-semibold text-danger' : 'text-sm text-text-muted'}
          >
            {textoDoStatus({ dias, isError, isFetching, cidade, dataUpdatedAt })}
          </p>
          {erroVisivel && !dias && (
            <p>Pode ser a sua conexão ou o serviço de previsão. Tente de novo em instantes.</p>
          )}
          {isError && (
            // Com dados antigos, a query segue em erro durante a nova busca: o botão fica, em
            // "Tentando de novo…", sem perder o foco. Sem dados, ela volta a pending, o botão
            // sai e a linha de status anuncia o carregamento. A arrow function evita passar o
            // evento do clique como opções do refetch
            <Button
              variant="secondary"
              loading={isFetching}
              loadingText="Tentando de novo…"
              onClick={() => refetch()}
            >
              Tentar de novo
            </Button>
          )}
        </div>

        {isPending && <Esqueleto />}
        {dias && dias.length > 0 && (
          <ul aria-label={`Previsão de ${cidade.rotulo}`} className="grid gap-6 lg:grid-cols-3">
            {dias.map((dia) => (
              <CardDoDia key={dia.data} dia={dia} />
            ))}
          </ul>
        )}

        <p className="text-sm text-text-muted">
          Previsão:{' '}
          <a href="https://open-meteo.com/" className={link}>
            Open-Meteo.com
          </a>{' '}
          (
          <a href="https://creativecommons.org/licenses/by/4.0/deed.pt-br" className={link}>
            CC BY 4.0
          </a>
          ). A hora dourada é calculada por aproximação a partir do nascer e do pôr do sol.
        </p>
      </div>
    </Secao>
  )
}

interface Status {
  dias: DiaDeLuz[] | undefined
  isError: boolean
  isFetching: boolean
  cidade: Cidade
  dataUpdatedAt: number
}

/**
 * O texto da linha de status. Os dados vêm primeiro, depois o erro, depois o carregamento:
 * um erro numa atualização em segundo plano não apaga dados que ainda servem.
 */
function textoDoStatus({ dias, isError, isFetching, cidade, dataUpdatedAt }: Status) {
  const hora = formatoDaHora.format(dataUpdatedAt)

  if (dias) {
    if (isFetching) return 'Atualizando…'
    if (isError) {
      return `Não consegui atualizar a previsão. Você está vendo os dados das ${hora}.`
    }
    if (dias.length === 0) {
      return `Ainda não há previsão para ${cidade.rotulo}. Escolha outra cidade ou volte mais tarde.`
    }
    return `Previsão atualizada às ${hora}.`
  }
  if (isError) return 'Não consegui carregar a previsão.'
  return `Carregando a previsão de ${cidade.rotulo}…`
}

function CardDoDia({ dia }: { dia: DiaDeLuz }) {
  return (
    <li className="flex flex-col gap-4 rounded-card border border-border bg-surface-raised p-6">
      <h3 className="text-xl font-semibold">{dia.rotulo}</h3>
      {/* Pares de rótulo e valor: numa lista de definição, o leitor de tela lê os dois juntos */}
      <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
        <Dado termo="Nascer do sol" valor={dia.nascer} />
        <Dado termo="Pôr do sol" valor={dia.por} />
        <Dado
          termo="Hora dourada da manhã"
          valor={`${dia.douradaManha.inicio} às ${dia.douradaManha.fim}`}
        />
        <Dado
          termo="Hora dourada da tarde"
          valor={`${dia.douradaTarde.inicio} às ${dia.douradaTarde.fim}`}
        />
        <Dado termo="Nuvens (média do dia)" valor={<Porcentagem valor={dia.nuvens} />} />
        <Dado termo="Chuva" valor={<Porcentagem valor={dia.chuva} />} />
      </dl>
      <p className="border-t border-border pt-4">{textoDoVeredito[dia.veredito]}</p>
    </li>
  )
}

function Dado({ termo, valor }: { termo: string; valor: ReactNode }) {
  return (
    <>
      <dt className="text-text-muted">{termo}</dt>
      {/* O valor não quebra; em card estreito, quem quebra é o rótulo */}
      <dd className="whitespace-nowrap text-right font-semibold">{valor}</dd>
    </>
  )
}

/** O travessão é só visual: o leitor de tela ouve "sem dado". */
function Porcentagem({ valor }: { valor: number | null }) {
  if (valor !== null) return `${valor}%`
  return (
    <>
      <span aria-hidden="true">—</span>
      <span className="sr-only">sem dado</span>
    </>
  )
}

/** Três cards cinza no lugar dos dias. Só visual: quem usa leitor de tela ouve a linha de status. */
function Esqueleto() {
  return (
    <div aria-hidden="true" className="grid gap-6 lg:grid-cols-3">
      {[1, 2, 3].map((card) => (
        <div
          key={card}
          className="flex flex-col gap-4 rounded-card border border-border bg-surface-raised p-6 motion-safe:animate-pulse"
        >
          <div className="h-7 w-24 rounded-control bg-surface-muted" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5, 6].map((linha) => (
              <div key={linha} className="h-4 rounded-control bg-surface-muted" />
            ))}
          </div>
          <div className="h-10 rounded-control bg-surface-muted" />
        </div>
      ))}
    </div>
  )
}
