import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // O alias @/ é declarado uma vez só, em `paths` no tsconfig.app.json, e o Vite lê de lá
    tsconfigPaths: true,
  },
})
