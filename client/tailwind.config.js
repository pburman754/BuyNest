// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          "bg-primary": "#F2F2F2",
          "bg-secondary": "#EAE4D5",
          "text-muted": "#B6B09F",
          "text-primary": "#000000",
        }, // from first theme object
        beige: {
          50: "#FAF7F2",
          100: "#F5EFE7",
          200: "#E8DFD3",
          300: "#D4C4B0",
          400: "#C19F7C",
          500: "#A67C52",
        }, // from third theme object
        "royal-red": {
          500: "#8B0000",
          600: "#660000",
          700: "#4D0000",
        }, // from third theme object
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"], // from first theme object
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      }, // from third theme object, note: sans is overwritten
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
