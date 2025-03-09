/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#faf7f2',
          100: '#f5f0e5',
          200: '#e9dfc7',
          300: '#d9c8a7',
          400: '#c9b28a',
          500: '#b89b6c',
          600: '#a78655',
          700: '#8a6f48',
          800: '#6e593b',
          900: '#574832',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
