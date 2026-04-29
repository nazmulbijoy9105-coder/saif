/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0a0f1e",
        navy: "#0d1b3e",
        "navy-light": "#1a2764",
        teal: "#00d4aa",
        gold: "#c9a84c",
        "saif-white": "#f0f4ff",
      },
      fontFamily: {
        mono: ["'Courier New'", "monospace"],
        serif: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
}
