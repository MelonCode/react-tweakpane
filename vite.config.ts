import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'react-tweakpane',
      fileName: 'index',
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src'),
      },
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom', 'three', 'tweakpane', '@tweakpane/core'],
    },
  },
  server: {
    port: 3000,
  },
})
