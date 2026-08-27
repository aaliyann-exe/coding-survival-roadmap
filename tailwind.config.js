/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Roboto", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        raised: "rgb(var(--raised) / <alpha-value>)",
        sunken: "rgb(var(--sunken) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        "line-strong": "rgb(var(--line-strong) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        track: "rgb(var(--track) / <alpha-value>)",
      },
      borderRadius: {
        DEFAULT: "2px",
        md: "3px",
        lg: "4px",
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      letterSpacing: {
        widest: "0.18em",
      },
      boxShadow: {
        panel: "0 1px 2px rgb(0 0 0 / 0.04), 0 12px 32px -12px rgb(0 0 0 / 0.12)",
        lift: "0 1px 2px rgb(0 0 0 / 0.05), 0 20px 48px -16px rgb(0 0 0 / 0.22)",
        glow: "0 0 0 1px rgb(var(--track) / 0.35), 0 0 28px -6px rgb(var(--track) / 0.5)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97) translateY(6px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "toast-in": {
          from: { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        dash: {
          to: { "stroke-dashoffset": "-24" },
        },
        sweep: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        "pulse-ring": {
          "0%": { opacity: "0.55", transform: "scale(1)" },
          "70%": { opacity: "0", transform: "scale(1.9)" },
          "100%": { opacity: "0", transform: "scale(1.9)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
        "toast-in": "toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        dash: "dash 1s linear infinite",
        sweep: "sweep 2.4s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite",
      },
    },
  },
  plugins: [],
};
