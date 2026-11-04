import type { Decorator, Preview } from '@storybook/react-vite'
import '@fontsource-variable/inter'
import '@fontsource-variable/fraunces'
import '../src/index.css'

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
