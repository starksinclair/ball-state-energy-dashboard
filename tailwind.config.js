/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bsuRed: "#ba0c2f",
        bsuBlue: "#003DA5",
        bsuGray: "#6B7280",
        "ball-state": {
          red: "#ba0c2f",
          blue: "#003DA5",
          gray: "#6B7280",
        },
      },
    },
  },
  plugins: [],
};
