/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F2937',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
