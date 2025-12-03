/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vai: {
          black:"#121212",
          white:"#FFFFFF",
          orange:"#FF710F",
          green:"#27AE60",
          blueLight:"#DEECFF",
          bluePale:"#EEEFFF",
          grayLight:"#E1E0E1",
          grayText:"#888888"
        },
      },
      fontFamily: {
        sans: ["Hanken Grotesk","system-ui","sans-serif"],
        heading: ["Inter","system-ui","sans-serif"]
      },
      borderRadius: { card: "14px" },
      boxShadow: { card: "0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)" },
    },
  },
  plugins: [],
};
