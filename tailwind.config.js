/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': '#2b5a45',
        'deep-charcoal': '#1e1e1e',
        'light-grey': '#f5f5f5',
        'gold-tan': '#e2b46f',
        'dark-text': '#333333',
        'light-text': '#cccccc',
      },
    },
  },
  plugins: [],
}