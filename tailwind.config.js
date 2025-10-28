/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Make sure to include .ts files if using Angular
  ],
  prefix: "tw-",
  safelist: [
    "hover:tw-bg-blue-50",
    "hover:tw-bg-green-50",
    "hover:tw-bg-purple-50",
    "hover:tw-bg-orange-50",
    "hover:tw-bg-red-50",
    "hover:tw-bg-yellow-50",
  ],
  theme: {
    extend: {
      colors: {
        // Your admin colors
        "admin-blue": "#3B82F6",
        "admin-green": "#10B981",
        "admin-purple": "#8B5CF6",
        "admin-orange": "#F59E0B",
        "admin-red": "#EF4444",
        "admin-yellow": "#EAB308",

        // Add 50-shades if you're using them
        "blue-50": "#eff6ff",
        "green-50": "#ecfdf5",
        "purple-50": "#f5f3ff",
        "orange-50": "#fffbeb",
        "red-50": "#fef2f2",
        "yellow-50": "#fefce8",

        primary: "#09af72",
        "bg-primary": "#09af72",
        darkblue: "#0d163f",
        secondary: "#f8f8f8",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents(require("./public/tailwind/tailwind.custom.js"));
    },
  ],
};
