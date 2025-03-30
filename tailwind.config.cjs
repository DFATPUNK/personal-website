// tailwind.config.cjs
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        retro: ['"Press Start 2P"', "monospace"],
        modern: ['"Inter"', "sans-serif"],
      },
      colors: {
        retroBackground: "#F5F5F5",
        retroText: "#000000",
        retroGray: "#D4D4D4",
        retroBorder: "#444444",
        retroTitleBar: "#4B6EA9",
        retroTitleBarText: "#FFFFFF",
        retroAccent: "#1A3C6E",
        retroAccentHover: "#274E91",
        retroAccentLight: "#C2D7F2",
        retroTaskbar: "#E0E0E0",
        retroTaskbarBorder: "#333333",
        retroSuccess: "#A3D9A5",
        retroError: "#F8A5A5",
      },
    },
  },
  plugins: [],
};