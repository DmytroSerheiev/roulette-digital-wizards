/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}", // ← ДОДАЙ ЦЕ
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
