/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        forest: '#0f2f1a',
        moss: '#234f32',
        pine: '#386446',
        sage: '#7aa87a',
        cream: '#f7f3e9',
        gold: '#d8b86d',
      },
      boxShadow: {
        forest: '0 24px 64px rgba(15, 47, 26, 0.18)',
      },
      backgroundImage: {
        'forest-gradient': 'linear-gradient(180deg, rgba(15,47,26,0.92) 0%, rgba(56,78,55,0.88) 100%)',
      },
    },
  },
  plugins: [],
};
