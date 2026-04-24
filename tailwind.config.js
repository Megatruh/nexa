/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0eeff",
          100: "#dcd8ff",
          200: "#b8b0ff",
          300: "#9488ff",
          400: "#7060ff",
          500: "#5b21b6",
          600: "#4c1d95",
          700: "#3b1578",
          800: "#2a0f5c",
          900: "#1a0a3d",
        },
        accent: "#a78bfa",
        space: {
          dark: "#0d0820",
          mid: "#1a1040",
          light: "#2d1b69",
        },
      },
      fontFamily: {
        display: ["'Orbitron'", "sans-serif"],
        body: ["'Syne'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "space-gradient":
          "linear-gradient(135deg, #0d0820 0%, #1a1040 40%, #2d1b69 70%, #1a0a3d 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(91,33,182,0.3) 0%, rgba(45,27,105,0.5) 100%)",
        "purple-mesh":
          "radial-gradient(ellipse at 20% 50%, #5b21b6 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #7c3aed 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, #4c1d95 0%, transparent 40%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
