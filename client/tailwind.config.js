/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Ubuntu', 'monospace'], // Add Ubuntu Mono to the "mono" key
      },
    },
  },
  plugins: [],
}