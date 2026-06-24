/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,tsx,ts,jsx,js}',
    './index.html',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '70%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
      },
      animation: {
        'fadeOut': 'fadeOut 0.9s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}
