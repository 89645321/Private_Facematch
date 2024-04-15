/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
        "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    `bg-blue-500`,
    `bg-blue-200`,
    "bg-white",
    "text-blue-500",
    "text-blue-200",
    "text-white",
    "border-blue-500",
  ],
  theme: {
    maxWidth: {
      "2/3": "66%",
      "xs": "20rem",
    },
    minHeight: {
      "12": "3rem",
    }
  },
  plugins: [],
}

