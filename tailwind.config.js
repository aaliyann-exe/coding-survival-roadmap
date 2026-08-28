/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Body text: the "book" font. This is the default cascade for
        // everything that doesn't explicitly ask for the display face.
        sans: ["EB Garamond", "Iowan Old Style", "Georgia", "serif"],
        // Roadmap stage titles, the site brand, and modal headers.
        display: ["Cinzel", "Georgia", "serif"],
        // Stamped mechanical text: labels, stats, chips, code-ish bits.
        mono: ["Fira Code", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
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
        // Re-skinned status colours: druid green for mastered/success,
        // aged gold for in-progress, crimson wax for danger/reset.
        emerald: {
          400: "#4C8A63",
          500: "#2F6E45",
          600: "#215E39",
          700: "#173F27",
        },
        amber: {
          400: "#D9B872",
          500: "#C6A664",
          600: "#A8873F",
        },
        red: {
          400: "#C25050",
          500: "#A11616",
          600: "#8B0000",
        },
      },
      borderRadius: {
        DEFAULT: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      letterSpacing: {
        widest: "0.18em",
      },
      boxShadow: {
        // Harsh, dark, offset — a page sitting on a desk, not a soft glow.
        panel: "3px 3px 0 0 rgb(var(--line) / 0.5)",
        lift: "5px 5px 0 0 rgb(var(--line) / 0.6), 10px 10px 0 0 rgb(var(--line) / 0.25)",
        seal: "0 0 0 1px rgb(var(--canvas)), 0 0 0 3px rgb(var(--track) / 0.7)",
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
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
        "toast-in": "toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        dash: "dash 1s linear infinite",
        flicker: "flicker 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
