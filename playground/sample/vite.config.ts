import { defineConfig } from 'vite'

export default defineConfig({ optimizeDeps: { exclude: ['@privyid/ghoulscript'] } })
