/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      valentine: {
        ...require("daisyui/src/theming/themes")["valentine"],
        "primary": "#FFFFFF",
        "secondary": "#fd95b5",
        "accent": "#ed6187",
        "base-100": "#ffd4dd"

      }
    }],
  },
};
