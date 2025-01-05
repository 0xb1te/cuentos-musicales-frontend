/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "custom-color": "#ff0000",
      },
      spacing: {
        128: "32rem",
      },
    },
  },
  plugins: [],
};
