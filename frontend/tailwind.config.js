/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Indigo 600
        secondary: "#10B981", // Emerald 500
        background: "#F9FAFB", // Cool Gray 50
        text: "#111827", // Gray 900
        accent: "#F59E0B", // Amber 500
      },
    },
  },
  plugins: [],
};
