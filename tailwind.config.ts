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
        neon: {
          cyan: "rgb(var(--accent-rgb) / <alpha-value>)",
          purple: "rgb(var(--secondary-rgb) / <alpha-value>)",
          pink: "#ff00aa",
          blue: "#0066ff",
        },
        dark: {
          950: "#05050a",
          900: "#0a0a0f",
          800: "#0d0d1a",
          700: "#141428",
          600: "#1a1a35",
          500: "#222244",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite alternate",
        "float": "float 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "border-glow": "border-glow 3s ease-in-out infinite alternate",
        "fade-in": "fade-in 1s ease-out forwards",
      },
      keyframes: {
        "glow-pulse": {
          "0%": { boxShadow: "0 0 20px rgb(var(--accent-rgb) / 0.3)" },
          "100%": { boxShadow: "0 0 40px rgb(var(--accent-rgb) / 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(10px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "border-glow": {
          "0%": { borderColor: "rgb(var(--accent-rgb) / 0.3)" },
          "50%": { borderColor: "rgb(var(--secondary-rgb) / 0.5)" },
          "100%": { borderColor: "rgb(var(--accent-rgb) / 0.3)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-grid":
          "linear-gradient(rgb(var(--accent-rgb) / 0.03) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--accent-rgb) / 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "cyber-grid": "60px 60px",
      },
    },
  },
  plugins: [],
};

export default config;
