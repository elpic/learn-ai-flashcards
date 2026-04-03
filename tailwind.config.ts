import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map Tailwind utilities to CSS custom properties
        background: "var(--color-bg-base)",
        surface: "var(--color-bg-surface)",
        subtle: "var(--color-bg-subtle)",
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          light: "var(--color-accent-light)",
        },
        brand: {
          amber: "var(--color-amber)",
          "amber-light": "var(--color-amber-light)",
        },
      },
      boxShadow: {
        warm: "var(--shadow-warm)",
        "warm-orange": "0 4px 24px 0 rgba(251, 146, 60, 0.18)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "Helvetica", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
