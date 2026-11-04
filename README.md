# landing-kit

[![CI](https://github.com/guilhermehassa/landing-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/guilhermehassa/landing-kit/actions/workflows/ci.yml)

Biblioteca de componentes React para landing pages de conversão, documentada em Storybook, com testes de componente (Vitest + React Testing Library), Zustand e TanStack Query.

- **Demonstração:** [landing-kit-orcin.vercel.app](https://landing-kit-orcin.vercel.app/)
- **Storybook:** [landing-kit-orcin.vercel.app/storybook](https://landing-kit-orcin.vercel.app/storybook/)

É um projeto pessoal. Eu o fiz para praticar, e mostrar em público, como documento, testo e verifico a acessibilidade de componentes. Ele não está em uso em produção.

## O que tem aqui

### A biblioteca

Fica em `src/components` e sai por um ponto de entrada só, o `src/index.ts`. Os componentes usam apenas os tokens de design de `src/styles/tokens.css`.

| Componente | O que faz |
|---|---|
| `Button` e `ButtonLink` | O mesmo visual para ação (`<button>`) e para navegação (`<a>`). Variantes `primary`, `secondary` e `accent`, tamanhos `sm` e `md`, e estado de carregamento que continua focável |
| `TextField` e `SelectField` | Campo nativo com rótulo, dica e erro ligados a ele. O erro tem ícone e texto, e não depende só da cor |
| `Accordion` | Perguntas e respostas no padrão Accordion do WAI-ARIA APG, com várias respostas abertas ao mesmo tempo |
| `PricingCard` | Plano com selo, itens e preço lido por extenso no leitor de tela. Não sabe o que acontece ao escolher: recebe `onEscolher` |
| `Testimonial` | Depoimento com autoria (`figure`, `blockquote` e `figcaption`), com as iniciais no lugar da foto |
| `Modal` | `<dialog>` nativo com `showModal()`. Ao abrir, o foco vai para o título; ao fechar, volta para quem abriu |
| `Toast` | Aviso anunciado por `role="status"` sem tirar o foco do lugar. Some em 5 segundos, e a contagem para com o ponteiro ou o foco nele |

No Storybook, cada componente tem stories dos estados difíceis (carregando, erro, texto longo, 320 px) e uma página de documentação. As páginas **Introdução** e **Tokens** explicam as camadas de tokens e o contraste de cada par de cores.

### A demonstração

A landing page do **Hora Âmbar**, um curso de fotografia com celular que **não existe**. Pessoas, depoimentos, planos e preços são fictícios. A demo fica em `src/demo` e importa a biblioteca pela API pública, como faria uma aplicação de fora. Ela acrescenta duas partes:

- **Formulário de inscrição em 3 etapas:** estado no Zustand, validação com Zod a cada etapa e um evento no `dataLayer` a cada avanço. Um painel ao lado mostra os eventos disparados. Nada é enviado: os dados ficam na memória do navegador.
- **"Onde está a luz hoje?":** a hora dourada dos próximos 3 dias em 6 cidades, com dados reais da [Open-Meteo](https://open-meteo.com/), buscados com TanStack Query.

## Decisões técnicas

### Tokens de design em três camadas

- **Problema:** cor e medida soltas nos componentes tornam caro trocar a marca e fácil errar o contraste.
- **Decisão:** primitivos (o valor bruto), semânticos (o papel na interface) e uma ponte para o Tailwind v4 com `@theme inline`. A paleta padrão do Tailwind está desligada: `bg-violet-600` não gera CSS nenhum.
- **Por quê:** o componente só conhece o papel (`bg-primary`). Como a classe aponta para a variável semântica, dá para trocar um papel num trecho da página. É o que acontece na faixa índigo, onde `data-surface="primary"` troca o anel de foco para um âmbar claro, com contraste sobre o fundo. Um tema escuro funcionaria pelo mesmo mecanismo. Todos os pares de texto e fundo passam no AA da WCAG, com a razão calculada e documentada no Storybook.

### Zustand no formulário em etapas

- **Problema:** o formulário tem 3 etapas em componentes diferentes, e o card de preço, em outra seção da página, também escolhe o plano.
- **Decisão:** uma store do Zustand. Cada campo assina só o próprio valor, e a validação lê a store com `getState()`, sem assinar. Os erros de validação ficam em `useState`, dentro da etapa, porque só ela usa.
- **Por quê:** sem Provider e sem re-renderizar a página a cada tecla, como aconteceria com o estado no componente pai ou num Context. A biblioteca não conhece o Zustand: quem liga o card de preço à store é a página. Não usei o middleware `persist`, porque nome e e-mail não devem ir para o `localStorage`.

### Zod por etapa

- **Problema:** validar cada etapa e o envio sem repetir regra, mensagem e tipo.
- **Decisão:** um schema por etapa, com `safeParse` no "Continuar". O envio valida tudo de novo, com os três schemas juntos. Os tipos do formulário saem de `z.infer`.
- **Por quê:** a regra, a mensagem e o tipo têm uma fonte só. As mensagens estão em português, no formato do Zod 4. Os textos das opções usam a união do schema como chave, e uma opção sem texto vira erro de compilação.

### Tracking sem dado pessoal

- **Problema:** medir o funil do formulário sem mandar dado pessoal para a ferramenta de análise.
- **Decisão:** eventos no `dataLayer` com os nomes recomendados do GA4 quando existem (`select_item` e `generate_lead`) e um evento próprio por etapa (`form_step_complete`). O tipo dos eventos é uma união fechada no TypeScript.
- **Por quê:** um campo como `email` no evento nem compila, e um teste com `@ts-expect-error` faz a checagem de tipos reprovar se alguém abrir a união. Outro teste percorre o formulário inteiro e confere que nome, e-mail e respostas não chegam ao `dataLayer`. O nome próprio do evento de etapa evita colidir com o `form_start` e o `form_submit`, que a medição otimizada do GA4 já coleta. Antes do `select_item`, vai um `{ ecommerce: null }`, como pede a doc do GA4 para o GTM.

### TanStack Query no bloco de dados

- **Problema:** dados de uma API de terceiros, buscados no navegador, com carregamento, erro, cache por cidade e uma previsão que envelhece.
- **Decisão:** `useQuery` com a cidade na `queryKey`, `staleTime` de 30 minutos e `gcTime` de 60. A resposta é validada com Zod na busca e transformada no `select`. Trocar de cidade no meio da busca cancela a anterior, pelo `signal`.
- **Por quê:** cache, cancelamento e nova tentativa vêm prontos. Voltar a uma cidade já vista é instantâneo, e um erro numa atualização em segundo plano não apaga os dados que ainda servem. Se a API mudar o formato, a seção mostra o erro, em vez de quebrar. Num app em que os dados chegam por Server Components, eu não usaria TanStack Query para isso: o cliente não guardaria cópia dos dados.

### Testes de comportamento, com a rede simulada

- **Problema:** teste que confere detalhe de implementação quebra a cada refatoração, e teste que chama a API real é lento e instável.
- **Decisão:** Vitest, React Testing Library e user-event, buscando por papel e nome acessível (`getByRole`, `getByLabelText`), sem `getByTestId`. A rede é simulada com a MSW, com respostas reais gravadas da Open-Meteo, e uma requisição sem handler falha, em vez de sair para a internet. Cada teste tem o próprio `QueryClient`.
- **Por quê:** o teste usa o componente como a pessoa usa, e quebra se a semântica quebrar. Quando um teste afirma que algo **não** aconteceu (o botão carregando não envia o formulário), um teste de controle prova que o mesmo arranjo detecta o envio quando ele acontece.

### Como a acessibilidade é verificada

- **Problema:** passar numa ferramenta automática não quer dizer estar acessível.
- **Decisão:** quatro camadas, todas automáticas e rodando no CI:
  1. Cada story roda como teste num Chromium sem interface, com o axe do addon de acessibilidade. Uma violação reprova (`a11y.test: 'error'`).
  2. O lint barra os erros comuns de JSX com as regras do jsx-a11y.
  3. Testes de teclado e de foco com user-event: Tab, Enter e Espaço nos botões e no accordion, o foco indo ao primeiro campo inválido e ao título de cada etapa, e o foco do modal, que é testado no navegador.
  4. Stories em 320 px de largura, algumas com teste que confere que nada vaza para o lado.
- **Por quê:** o axe pega só uma parte dos problemas, e o resto depende de como a página se comporta no teclado e no leitor de tela. O próximo passo é o teste manual com leitor de tela.

## Stack

| Para quê | O quê |
|---|---|
| Interface | React 19, TypeScript 7 (estrito), Vite 8 e Tailwind CSS 4 |
| Estado | Zustand 5 (estado de interface) e TanStack Query 5 (estado de servidor) |
| Validação | Zod 4 |
| Documentação | Storybook 10, com os addons de documentação, de acessibilidade e de Vitest |
| Testes | Vitest 5, React Testing Library, user-event e jsdom; Playwright (Chromium) para as stories; MSW 3 para a rede |
| Qualidade | oxlint, com as regras do jsx-a11y, e GitHub Actions |
| Fontes | Inter e Fraunces, servidas pelo Fontsource, sem chamar serviço externo |

O lint é o oxlint, que já vem no template do `create-vite`, e não o ESLint: em novembro de 2026, o typescript-eslint ainda não aceitava o TypeScript 7.

## Como rodar

Precisa do Node 24 (há um `.nvmrc`).

```bash
npm ci
npm run dev              # demonstração
npm run storybook        # Storybook, em http://localhost:6006
npm run build            # checagem de tipos e build da demonstração
npm run build-storybook  # build estático do Storybook
```

## Como testar

As stories rodam como teste num Chromium sem interface. Na primeira vez, instale o navegador:

```bash
npx playwright install chromium
```

Depois:

```bash
npm test              # tudo: testes de componente (jsdom) e stories com o axe (Chromium)
npm run test:unit     # só os testes de componente, mais rápidos
npm run test:stories  # só as stories
npm run test:watch    # modo watch
npm run lint
npm run typecheck
```

Nenhum teste chama a internet: a Open-Meteo é simulada pela MSW.

A cada push e pull request no branch `main`, o GitHub Actions roda o lint, a checagem de tipos, os testes de componente, as stories com o axe no Chromium, o build da demonstração e o build do Storybook. A demonstração e o Storybook são publicados na Vercel, num projeto só, pelo script `build:vercel`: a demo na raiz e o Storybook em `/storybook/`.

## Estrutura

```
src/
  components/   a biblioteca: cada componente com stories e testes
  styles/       os tokens de design (tokens.css)
  docs/         páginas do Storybook: Introdução e Tokens
  demo/         a landing do Hora Âmbar
    inscricao/  o formulário em 3 etapas (Zustand e Zod)
    luz/        a previsão (TanStack Query) e a API simulada
    sections/   as seções da página
  test/         configuração dos testes (MSW e QueryClient)
  index.ts      a API pública da biblioteca
.storybook/     configuração do Storybook e o worker da MSW
```

## Créditos

- Previsão do tempo: [Open-Meteo.com](https://open-meteo.com/), com dados sob a licença [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.pt-br). A hora dourada é calculada por aproximação a partir do nascer e do pôr do sol.
- Fontes [Inter](https://fontsource.org/fonts/inter) e [Fraunces](https://fontsource.org/fonts/fraunces), sob a SIL Open Font License 1.1, servidas pelo [Fontsource](https://fontsource.org/).
- O Hora Âmbar e todo o conteúdo da demonstração são fictícios.

## Contato

Guilherme Hassã · [hassa.dev.br](https://hassa.dev.br) · [LinkedIn](https://www.linkedin.com/in/guilhermehassa/) · [contato@hassa.dev.br](mailto:contato@hassa.dev.br)

## Licença

[MIT](LICENSE)
