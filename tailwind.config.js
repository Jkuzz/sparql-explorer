/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./src/**/*.{html,js,vue}"],
  theme: {
    extend: {
      fontFamily: {
        // https://tailwindcss.com/docs/font-family#customizing-the-default-font
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },},
  },
  plugins: [],
}
