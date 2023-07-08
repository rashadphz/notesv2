const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    nightwind: {
      colors: {
        white: "#1E2022",
      },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        default: ["var(--font-default)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("nightwind")],
};
