import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react')) {
              return 'react'
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n'
            }
            if (id.includes('framer-motion')) {
              return 'framer'
            }
            if (id.includes('lucide-react')) {
              return 'icons'
            }
            if (id.includes('hls.js')) {
              return 'hls'
            }
          }
        },
      },
    },
  },
})
