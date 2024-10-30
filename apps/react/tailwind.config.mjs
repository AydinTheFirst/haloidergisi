import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            content1: "#f8efd0",
            content2: "#d9c890",
            content3: "#c7b36e",
            content4: "#bda657",
            secondary: "#fade9b",
            background: "#f8e9b1",
          },
        },
      },
    }),
  ],
};
