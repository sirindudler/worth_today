import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', '-apple-system', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        secondary: "var(--secondary)",
        border: "var(--border)",
        accent: "var(--accent)",
        "card-bg": "var(--card-bg)",
      },
      boxShadow: {
        "apple-sm": "0 1px 2px rgba(0, 0, 0, 0.05)",
        "apple": "0 2px 8px rgba(0, 0, 0, 0.08)",
        "apple-lg": "0 8px 24px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
