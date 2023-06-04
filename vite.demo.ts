import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/react-tweakpane/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          three: ['three', '@react-three/drei', '@react-three/fiber'],
          tweakpane: ['tweakpane'],
        },
      },
    },
    emptyOutDir: true,
    outDir: 'gh-pages',
  },
})
