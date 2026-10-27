import containerQueries from "@tailwindcss/container-queries"
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['"Inter Variable"', "system-ui", "-apple-system", '"Segoe UI"', "sans-serif"] },
      colors: {
        // Marca Senac: azul #005594 (logo), laranja #F78B1F e laranja claro #F6BF86
        navy: { 950: "#062440", 900: "#0A3159", 800: "#0B4170", 700: "#005594", 600: "#1A6CAF" },
        brand: { blue: "#1A73B8", orange: "#F78B1F", "orange-deep": "#E0761A", "orange-light": "#F6BF86" },
        ink: { DEFAULT: "#0F1B2D", 2: "#4A5565", 3: "#7A8494" },
        line: "#E3E7EC",
        plane: "#F4F6F9",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,27,45,0.06), 0 4px 16px -8px rgba(15,27,45,0.12)",
      },
    },
  },
  plugins: [containerQueries],
}
