import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Nepoužívat jiný port, pokud je 5173 obsazený
  },
  base: '/kaj-notes/', // pro GitHub Pages - název repozitáře
})
