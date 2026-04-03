import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ['parking-managment-system-s5rt.onrender.com'],
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
    }
  },
  preview: {
    allowedHosts: ['parking-managment-system-s5rt.onrender.com']
  }
})
