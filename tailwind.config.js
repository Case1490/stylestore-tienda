/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf4f4',
          100: '#fce8e8',
          200: '#f9c8c8',
          300: '#f49898',
          400: '#ec5c5c',
          500: '#e03030',
          600: '#c41e1e',
          700: '#a31818',
          800: '#881818',
          900: '#711a1a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
