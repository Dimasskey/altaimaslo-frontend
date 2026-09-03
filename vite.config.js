import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, './src'),
      // eslint-disable-next-line no-undef
      '@shared': path.resolve(__dirname, './src/6shared'),
      // eslint-disable-next-line no-undef
      '@fonts': path.resolve(__dirname, './src/1app/fonts'),
        // eslint-disable-next-line no-undef
        '@styles': path.resolve(__dirname, './src/1app/styles'),
    }
  },
  assetsInclude: ['**/*.ttf', '**/*.png', '**/*.ico', '**/*.svg'],
  server: {
    port: 5180,
    host: "localhost",
    // proxy:{
    //   '/api': {
    //     target: 'https://altaizakaz.ru',
    //     changeOrigin: true,
    //     secure: true,
    //   }
    // },
  },
  define: {
    global: 'globalThis',
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          `
          @use "@/1app/styles/mixins" as *;
          @use "@/1app/styles/variables" as *;
          `
      }
    }
  }
})


