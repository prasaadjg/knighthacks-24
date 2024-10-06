/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green1: '#485648',
        // titleGreen: '#B1DD9E',
        green2: '#102820',
        green3: '#315E26',
        brown1: '#caba9c',
        brown2: '#8a6240',
        brown3: '#4d2d18'
      }
    },
  },
  plugins: [],
}