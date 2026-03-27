import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/KitchenPulse/',
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})
