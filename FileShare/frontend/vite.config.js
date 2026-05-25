import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://websites-eobd.onrender.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },

})
