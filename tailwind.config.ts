/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0073b4",
          '50': '#f0f9ff',
          '100': '#dff2ff',
          '200': '#b9e6fe',
          '300': '#7bd3fe',
          '400': '#34bdfc',
          '500': '#0aa5ed',
          '600': '#0084cb',
          '700': '#0073b4',
          '800': '#055987',
          '900': '#0a4970',
          '950': '#072f4a',
        },
        black: "#000000",
        secondary: {
          "100": "#E2E2D5",
          "200": "#888883",
        },
        marketPlace: {
          "digital": "#C9DCE1",
          "ebook": "#C0E1CC",
          "courses": "#EAD16B",
          "events": "#E8DAA8",
          "services": "#F8DCDC",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar"), require("tailwindcss-animate")],
} satisfies Config;
