import type { Decorator, Preview } from '@storybook/react-vite'
import { setupWorker } from 'msw/browser'
import { HttpNetworkFrame } from 'msw/experimental'
import { mswLoader } from 'msw-storybook-addon/csf3'
import '@fontsource-variable/inter'
import '@fontsource-variable/fraunces'
import '../src/index.css'

/*
 * A MSW nas stories: o loader do addon liga o worker uma vez e, a cada story, troca os
 * handlers pelos de `parameters.msw`. O início é nosso, e não o padrão do addon: o padrão
 * passa `onUnhandledRequest`, opção que a MSW 3 não tem mais, e a requisição sem handler
 * seguiria para a internet. Aqui ela falha: nenhuma story chama a API real.
 */
async function iniciarMsw() {
  const worker = setupWorker()
  await worker.start({
    quiet: true,
    // O padrão é /mockServiceWorker.js, na raiz do site. Na Vercel, o Storybook fica em
    // /storybook/: com a base do Vite ('./' no Storybook), o worker vem da pasta dele
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    onUnhandledFrame({ frame, defaults }) {
      // Os arquivos do próprio Storybook (mesma origem) passam sem handler
      if (!(frame instanceof HttpNetworkFrame)) return
      if (new URL(frame.data.request.url).origin === window.location.origin) return

      defaults.error()
      // Na MSW 3, o defaults.error() só escreve no console. Quem barra é a rejeição: o
      // worker responde com Response.error(), e o fetch falha como numa queda de rede
      throw Response.error()
    },
  })
  return worker
}

/*
 * O fundo da página vem dos tokens (body com --surface). A faixa índigo precisa
 * do atributo data-surface, e não só da cor: é ele que troca o token --focus para
 * o âmbar claro. Por isso um decorator, e não o seletor de fundos do Storybook.
 */
const withSurface: Decorator = (Story, context) => {
  if (context.globals.surface !== 'primary') return <Story />

  return (
    <div data-surface="primary" className="bg-primary p-8 text-primary-foreground">
      <Story />
    </div>
  )
}

const preview: Preview = {
  globalTypes: {
    surface: {
      description: 'Fundo onde o componente aparece',
      toolbar: {
        title: 'Fundo',
        items: [
          { value: 'surface', title: 'Página (surface)' },
          { value: 'primary', title: 'Faixa índigo (primary)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    surface: 'surface',
  },
  decorators: [withSurface],
  loaders: [mswLoader(iniciarMsw)],
  parameters: {
    // Com o addon de Vitest, cada story roda como teste no Chromium (npm test), e este
    // 'error' faz uma violação do axe reprovar o teste, e não só aparecer no painel
    a11y: {
      test: 'error',
    },
    options: {
      storySort: {
        order: ['Introdução', 'Tokens', 'Componentes'],
      },
    },
  },
}

export default preview
