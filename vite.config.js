import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        // Marketing site
        main: resolve(__dirname, 'index.html'),
        // Standalone fullscreen game (PWA start page + native app entry)
        game: resolve(__dirname, 'game.html'),
      },
    },
  },
})
