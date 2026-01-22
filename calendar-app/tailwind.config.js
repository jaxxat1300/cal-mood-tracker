/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        work: '#3B82F6',
        personal: '#10B981',
        wellness: '#A78BFA',
      },
    },
  },
  plugins: [],
}
