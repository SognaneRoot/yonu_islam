import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: "#EAF3EE",
          100: "#CFE4D8",
          200: "#9FC9B1",
          300: "#6FAE8B",
          400: "#3F9364",
          500: "#1E7A48",
          600: "#155C36",
          700: "#0F3D2E", // primary emerald
          800: "#0A2E23",
          900: "#061F17",
        },
        night: {
          50: "#E9EDF3",
          100: "#C7D1E0",
          200: "#94A5C2",
          300: "#5E76A0",
          400: "#334C77",
          500: "#1C3253",
          600: "#132540",
          700: "#0B1B2E", // primary midnight blue
          800: "#071322",
          900: "#040C16",
        },
        beige: {
          50: "#FBF8F2",
          100: "#F5EFE6", // off-white / beige
          200: "#E8DCC8", // warm beige
          300: "#DCC9A8",
          400: "#CBB088",
        },
        gold: {
          300: "#E3C878",
          400: "#D4B458",
          500: "#C9A227", // discreet gold accent
          600: "#A6841E",
        },
        sand: {
          400: "#A99C8B",
          500: "#8C7F6E",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        arabic: ["var(--font-amiri)", "serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(11, 27, 46, 0.35)",
        glow: "0 0 40px -8px rgba(201, 162, 39, 0.35)",
      },
      backgroundImage: {
        "crescent-glow":
          "radial-gradient(circle at 30% 20%, rgba(201,162,39,0.12), transparent 60%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
