/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        ice: '#eaf8ff',
        frost: '#c6ebff',
        steel: '#1e4b6b',
        deep: '#0b2f49',
        slate: '#7fa6c4',
        laser: '#60d4ff',
      },
      boxShadow: {
        ice: '0 24px 64px rgba(12, 59, 92, 0.22)',
      },
      backgroundImage: {
        'ice-gradient': 'linear-gradient(180deg, rgba(234,248,255,0.95) 0%, rgba(198,235,255,0.9) 100%)',
      },
    },
  },
  plugins: [],
};
