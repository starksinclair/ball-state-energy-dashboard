/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bsuRed: "#ba0c2f",
        bsuBlue: "#003DA5",
        bsuGray: "#6B7280",
      },
    },
  },
  plugins: [],
};
