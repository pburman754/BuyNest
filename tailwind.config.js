// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        luxury: {
          "bg-primary": "#F2F2F2",
          "bg-secondary": "#EAE4D5",
          "text-muted": "#B6B09F",
          "text-primary": "#000000",
        },
      },
    },
  },
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Lato", "sans-serif"],
      },
    },
  },
  // ...
  plugins: [require("@tailwindcss/forms")],
};
