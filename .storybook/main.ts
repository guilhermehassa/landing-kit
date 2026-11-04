import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest'
  ],
  framework: '@storybook/react-vite',
  typescript: {
    // O react-docgen lê o código com Babel. O react-docgen-typescript usa a API do
    // compilador, que o TypeScript 7 não tem mais
    reactDocgen: 'react-docgen',
  },
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
  // Checklist "Get started" da sidebar e guia de onboarding do menu (só existem no modo dev)
  features: {
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },
}

export default config
