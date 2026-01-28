/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'health-green': '#4CAF50',
        'health-blue': '#2196F3',
        'health-orange': '#FF9800',
        'health-red': '#F44336',
        'health-purple': '#9C27B0',
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
