/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        crimson: ["Crimson Pro", "serif"],
        onest: ["Onest", "sans-serif"],
      },
    },
    placeholderColor: {
      primary: "#3490dc",
      secondary: "#ffed4a",
      danger: "#e3342f",
    },
  },
  plugins: [],
};
