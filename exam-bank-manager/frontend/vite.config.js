import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        'zh-tw': resolve(__dirname, 'zh-tw/index.html'),
        'en-us': resolve(__dirname, 'en-us/index.html'),
      }
    }
  }
})
