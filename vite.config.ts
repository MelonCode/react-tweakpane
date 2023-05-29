import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import glsl from 'vite-plugin-glsl'
import dts from 'vite-plugin-dts'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), glsl(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'react-tweakpane',
      fileName: 'index',
      formats: ['cjs', 'es', 'umd'],
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src'),
      },
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom', 'three'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          three: 'THREE',
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  server: {
    port: 3000,
  },
})
