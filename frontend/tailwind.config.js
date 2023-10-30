/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {


    extend: {
      colors: {
        primary: "#0C1446",
        secondary: "#87ACA3",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
        newTeal:"#2B7C85",
        newTGreen:"#175873",
        shiny:"#fafeff"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
 
 
}

