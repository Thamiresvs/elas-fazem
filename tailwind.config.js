/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#6d28d9',
          pink: '#ec4899',
          lilac: '#f3e8ff',
          dark: '#3b0764',
        }
      }
    },
  },
  plugins: [],
}
