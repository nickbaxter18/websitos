/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // for Vite/CRA
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // allow dark/light toggling
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#E1BC56",     // your primary CRO gold
          "gold-light": "#FFF1B0",
          red: "#A90F0F",      // CTA red
          "red-dark": "#8C0C0C",
          black: "#000000",    // deep black
          gray: "#6B6B6B",     // steel gray
        },
        steel: {
          light: "#d9d9d9",
          DEFAULT: "#a6a6a6",
          dark: "#595959",
        },
      },
      backgroundImage: {
        "steel-texture": `
          repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.08) 0px,
            rgba(255,255,255,0.02) 1px,
            transparent 2px,
            transparent 4px
          )
        `,
        "hero-gradient": "linear-gradient(160deg, #706A6A 0%, #000 70%)",
        "cta-gradient": "linear-gradient(180deg, #A90F0F 0%, #8C0C0C 100%)",
        "cta-gold": "linear-gradient(180deg, #F5DA88 0%, #E1BC56 100%)",
      },
      keyframes: {
        sweep: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(225,188,86,.5)" },
          "50%": { boxShadow: "0 0 0 8px rgba(225,188,86,0)" },
        },
      },
      animation: {
        sweep: "sweep 1.5s linear forwards",
        "sweep-loop": "sweep 3s linear infinite",
        "pulse-glow": "pulseGlow 2s infinite",
      },
      boxShadow: {
        "inner-strong": "inset 0 2px 6px rgba(0,0,0,0.6)",
        "steel-glow": "0 0 15px rgba(225,188,86,.4)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // keep inputs clean & consistent
  ],
};
