/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef3f8',
          100: '#d3e0ec',
          600: '#1b4165',
          700: '#153450',
          800: '#0f273c',
          900: '#0b1c2c',
        },
        brand: {
          50: '#eefbf8',
          100: '#c9f2ea',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
