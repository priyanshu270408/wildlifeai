/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#123B2A',
          deep: '#0A2119',
          emerald: '#1E8B61',
          light: '#D9F1E3',
        },
        surface: {
          DEFAULT: '#F6F7F2',
          charcoal: '#17231E',
          muted: '#819087',
          card: '#FFFFFF',
          darkCard: '#132820',
        },
        risk: {
          low: '#10B981',
          moderate: '#F59E0B',
          high: '#F97316',
          critical: '#EF4444',
          unknown: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
