/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19",
        darkCard: "#151C2C",
        darkCardHover: "#1E273A",
        darkBorder: "#273549",
        goldAccent: "#EAB308",
        emeraldGreen: "#10B981",
        lightGreen: "#86EFAC",
        goldYellow: "#FBBF24",
        orangeWarning: "#F97316",
        roseRed: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      }
    },
  },
  plugins: [],
}
