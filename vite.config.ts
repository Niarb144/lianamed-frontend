import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    host: true, // allow external access
    allowedHosts: [
      ".ngrok-free.app" // wildcard for all ngrok domains
    ]
  }
})
