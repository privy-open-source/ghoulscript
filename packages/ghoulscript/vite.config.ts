import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

export default defineConfig({
  plugins: [
    dts({ rollupTypes: true }),
    nodePolyfills(),
    externalizeDeps(),
  ],
  build: {
    minify: false,
    lib   : {
      entry   : 'src/index',
      name    : 'Ghoulscript',
      formats : ['cjs', 'es'],
      fileName: 'index',
    },
  },
})
