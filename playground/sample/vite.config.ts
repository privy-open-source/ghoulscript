import { defineConfig } from 'vite'

export default defineConfig({
  base  : '/ghoulscript/',
  server: {
    headers: {
      'Cross-Origin-Opener-Policy'  : 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})
