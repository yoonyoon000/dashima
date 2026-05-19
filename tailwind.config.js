export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Arial Black"', '"Pretendard"', '"Apple SD Gothic Neo"', "sans-serif"],
        sans: ['"Pretendard"', '"Apple SD Gothic Neo"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        packet: "0 34px 90px rgba(0,0,0,0.55)",
        glow: "0 0 42px rgba(255, 209, 72, 0.35)",
      },
    },
  },
  plugins: [],
};
