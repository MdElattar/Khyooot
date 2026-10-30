import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // السطر السحري ده هو اللي بيخلي كل مسارات الصور والأسيتس نسبية وتظهر فوراً
})