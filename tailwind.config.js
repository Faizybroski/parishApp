/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./<custom directory>/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#007AFF",
        "primary-foreground": "#FFFFFF",
        "muted-foreground": "#6B7280",
      },
    },
  },
  plugins: [],
}

