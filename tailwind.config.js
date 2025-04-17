import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        drop: {
          "0%": {
            transform: "translateY(-100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        appear: {
          "0%": {
            opacity: "0",
          },
          "50%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        wiggle: {
          "0%": {
            transform: "scale(90%)",
          },
          "100%": {
            transform: "scale(100%)",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        drop: "drop 0.2s ease-in-out",
        appear: "appear 0.6s ease-in-out",
        "slide-up": "slide-up 0.2s ease-in-out",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui(),
    require("@tailwindcss/container-queries"),
    function ({ addUtilities }) {
      addUtilities(
        {
          ".overflow-initial": {
            overflow: "initial !important",
          },
        },
        ["responsive", "hover"],
      );
    },
  ],
};
