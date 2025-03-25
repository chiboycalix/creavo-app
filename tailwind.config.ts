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
          "50": "#f0f9ff",
          "100": "#dff2ff",
          "200": "#b9e6fe",
          "300": "#7bd3fe",
          "400": "#34bdfc",
          "500": "#0aa5ed",
          "600": "#0084cb",
          "700": "#0073b4",
          "800": "#055987",
          "900": "#0a4970",
          "950": "#072f4a",
        },
        black: "#000000",
        secondary: {
          "100": "#E2E2D5",
          "200": "#888883",
        },
        marketPlace: {
          digital: "#C9DCE1",
          ebook: "#C0E1CC",
          courses: "#EAD16B",
          events: "#E8DAA8",
          services: "#F8DCDC",
        },
      },
      animation: {
        spin: "spin 4s linear infinite",
        pulse: "pulse 2s ease-in-out infinite",
        bounce: "bounce 1.5s ease-in-out infinite",
        colorShift: "colorShift 3s ease-in-out infinite",
        fadeInOut: "fadeInOut 2s ease-in-out infinite",
      },
      keyframes: {
        colorShift: {
          "0%, 100%": { color: "#DE2424" },
          "50%": { color: "#FF6B6B" },
        },
        fadeInOut: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        spinAndPulse: {
          "0%": { transform: "rotate(0deg) scale(1)", opacity: "0.7" },
          "50%": { transform: "rotate(180deg) scale(1.1)", opacity: "1" },
          "100%": { transform: "rotate(360deg) scale(1)", opacity: "0.7" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    require("tailwindcss-animate"),
    function ({ addUtilities }: any) {
      addUtilities({
        ".hide-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
} satisfies Config;
