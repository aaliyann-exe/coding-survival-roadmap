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
        // Ceremonial chapter marks / section rules — the same face as the
        // closing quotation, so the two ceremonial voices match.
        rule: ["Transcity", "Cinzel", "Georgia", "serif"],
        // The closing quotation.
        rune: ["Transcity", "Cinzel", "Georgia", "serif"],
        // Its attribution, in a hand.
        hand: ["Kugile", "Segoe Script", "Brush Script MT", "cursive"],
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
        board: "rgb(var(--board) / <alpha-value>)",
        // Named state materials. These are theme-aware (the dark grimoire
        // lifts the green and red so they stay legible on charcoal), which a
        // hard-coded hex could never be.
        seal: "rgb(var(--seal) / <alpha-value>)",
        gild: "rgb(var(--gild) / <alpha-value>)",
        wax: "rgb(var(--wax) / <alpha-value>)",
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
        stamp: "0 0 0 1px rgb(var(--canvas)), 0 0 0 3px rgb(var(--track) / 0.7)",
        // The whole book resting on a desk.
        codex: "0 24px 60px -12px rgb(0 0 0 / 0.55)",
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
        // A sheet of paper dropped onto the desk: short fall, hard stop,
        // one small settle. No spring, no scale-from-nothing.
        "set-down": {
          from: { opacity: "0", transform: "translateY(-14px) rotate(-0.6deg)" },
          "70%": { opacity: "1", transform: "translateY(2px) rotate(0.15deg)" },
          to: { opacity: "1", transform: "translateY(0) rotate(0deg)" },
        },
        // Ink soaking outward along a connector.
        "ink-in": {
          from: { "stroke-dashoffset": "var(--len, 400)" },
          to: { "stroke-dashoffset": "0" },
        },
        // A leaf swinging about the gutter. Eased so it accelerates off the
        // spine and lands, rather than moving linearly like a slide.
        "leaf-turn": {
          from: { transform: "rotateY(0deg)", opacity: "1" },
          "60%": { opacity: "1" },
          to: { transform: "rotateY(-168deg)", opacity: "0" },
        },
        // The seal igniting on the exposed page and fading back into it.
        "seal-cast": {
          "0%": { opacity: "0", transform: "scale(0.82)" },
          "14%": { opacity: "1", transform: "scale(1)" },
          "82%": { opacity: "1", transform: "scale(1.015)" },
          "100%": { opacity: "0", transform: "scale(1.06)" },
        },
        // The parchment veil the spell burns away. It holds opaque while the
        // seal is lit, then lifts at the end — so the chapter is revealed *by*
        // the spell rather than sitting exposed behind it for a second and a
        // half.
        "veil-lift": {
          "0%, 58%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        // The scroll unrolling. clip-path rather than scaleY so the text is
        // revealed by the edge travelling down it, not squashed and stretched.
        unfurl: {
          from: { "clip-path": "inset(0 0 100% 0)" },
          to: { "clip-path": "inset(0 0 0% 0)" },
        },
        "rune-spin": { to: { transform: "rotate(360deg)" } },
        "rune-spin-rev": { to: { transform: "rotate(-360deg)" } },
        // Stars breathing, at wildly different rates so it never pulses in
        // unison (which reads as a loading state rather than a sky).
        twinkle: {
          "0%, 100%": { opacity: "var(--o, 0.85)" },
          "50%": { opacity: "calc(var(--o, 0.85) * 0.35)" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
        "toast-in": "toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        dash: "dash 1s linear infinite",
        flicker: "flicker 1.8s ease-in-out infinite",
        "set-down": "set-down 0.32s cubic-bezier(0.3, 1.2, 0.5, 1) both",
        "ink-in": "ink-in 0.7s ease-out both",
        "leaf-turn": "leaf-turn 0.85s cubic-bezier(0.55, 0.02, 0.35, 1) forwards",
        "seal-cast": "seal-cast 2s ease-out forwards",
        "veil-lift": "veil-lift 2s ease-in forwards",
        unfurl: "unfurl 1.5s cubic-bezier(0.25, 0.6, 0.2, 1) both",
        "rune-spin": "rune-spin 9s linear infinite",
        "rune-spin-rev": "rune-spin-rev 14s linear infinite",
        twinkle: "twinkle var(--d, 5s) ease-in-out infinite",
        drift: "drift 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
