
<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/posterverse/',
})
=======
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: "rgba(255, 255, 255, 0.05)",
        glassBorder: "rgba(255, 255, 255, 0.1)",
        accent: "#8b5cf6", // Violet
        darkBg: "#050505",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'shine': 'shine 8s ease-in-out infinite',
      },
      keyframes: {
        shine: {
          '0%, 100%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '50%': { transform: 'translateX(200%) skewX(-12deg)' },
        }
      }
    },
  },
  plugins: [],
}
>>>>>>> 32a4e46735298646e274a3a995008b078a8bff9a
