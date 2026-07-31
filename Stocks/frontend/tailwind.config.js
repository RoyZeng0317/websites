/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'limit-glow': {
          '0%, 100%': { boxShadow: '0 0 6px 1px var(--glow-color, rgba(239,68,68,0.5))' },
          '50%': { boxShadow: '0 0 16px 4px var(--glow-color, rgba(239,68,68,0.85))' },
        },
      },
      animation: {
        'limit-glow': 'limit-glow 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
