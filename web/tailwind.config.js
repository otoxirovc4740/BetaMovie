
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          bg: '#0B0B0F',
          surface: '#15151C',
          card: '#1C1C25',
          gold: '#D5A84B',
          text: '#F5F5F7',
          muted: '#92929D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
