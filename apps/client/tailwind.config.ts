import type { Config } from "tailwindcss";

import { heroui } from "@heroui/react";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [
    typography,
    heroui({
      layout: {
        radius: {
          large: "0.5rem",
          medium: "0.25rem",
          small: "0.125rem",
        },
      },
    }),
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
} satisfies Config;
