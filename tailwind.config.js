/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./src/**/*.{html,js,vue}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 4s linear infinite',
      },
      fontFamily: {
        // https://tailwindcss.com/docs/font-family#customizing-the-default-font
        sans: ['Raleway', ...defaultTheme.fontFamily.sans],
        novem: ['Novem', 'serif'],
        squared: ['SQUARED2', 'serif'],
      },},
  },
  plugins: [],
}
