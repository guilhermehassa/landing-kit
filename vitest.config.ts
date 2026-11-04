import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

// A config de teste fica fora do vite.config.ts para o build e o Storybook não
// carregarem plugins de teste. `extends: true` herda os plugins e o alias @/.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            // jsdom, e não happy-dom: os testes dependem de foco e de envio de formulário
            // (inclusive o Enter num campo), em que o jsdom segue a especificação mais de
            // perto. A ordem de tabulação do user.tab() é calculada pelo próprio user-event
            environment: 'jsdom',
            include: ['src/**/*.test.{ts,tsx}'],
            setupFiles: ['./src/test/setup.ts'],
          },
        },
        {
          extends: true,
          // Cada story vira um teste no Chromium, com o axe do addon a11y
          plugins: [storybookTest({ configDir: fileURLToPath(new URL('./.storybook', import.meta.url)) })],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: 'chromium' }],
            },
          },
        },
      ],
    },
  }),
)
