import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://file-share.onrender.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },

})
