const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.slate,
      green: colors.emerald,
      purple: colors.violet,
      yellow: colors.amber,
      pink: colors.fuchsia,
      primary: '#99C08B', // primary green
      primarylight: '#FAF1E6', // light green
      secondary: '#FFE074', // secondary yellow
      secondarylight: '#FFF6D7', // light yellow
      backgroundgrey: '#F9F9F9',
      cardgrey: '#FAFAFA',
    },
    extend: {},
    fontSize: {
      '2.5xl': '1.56rem',
    },
    extend: {
      width: {
        218: '45rem',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
