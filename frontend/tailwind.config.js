/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // map semantic names to CSS variables
        "primary-dark": "var(--color-primary-dark)",
        "primary": "var(--color-primary)",
        "secondary": "var(--color-secondary)",
        "accent-light": "var(--color-accent-light)",
      },
    },
  },
  plugins: [],
}