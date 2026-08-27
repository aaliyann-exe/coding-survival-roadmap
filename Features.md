# Features.md

Everything changed in the polish pass. Nine files touched, `npm run build`
(which runs `vue-tsc --noEmit` first) passes.

---

## 1. The big fix — label sizes

- `.label-mono` was `text-[18px]`, reverted to `text-[11px] uppercase`.
  - It's the eyebrow class used on basically everything: stat labels, node
    status chips, progress-bar labels, drawer eyebrows, filter labels.
  - At 18px the label was bigger than the number underneath it, and it broke
    `truncate` inside the roadmap node cards.
  - Set to 11px, not the original 10px, in case 10 really was too small.
- `.rule-heading` was `text-[16px]`, reverted to `text-[11px]`.
- File: `src/style.css`

---

## 2. Easter eggs

- **404 page — poke the "404".** The `404` label is now a button. Click it 5
  times and it confesses: *"Kidhar phuss gaya yr 💀 — go back and click
  something that exists."*
  - It nudges you along the way: 1–2 clicks → *"that's not a button. keep going
    though"*, 3–4 clicks → *"okay fine, one more"*.
  - Ticks off item 3 from `stuff-to-add.md`.
- **404 page — fake stack trace.** A mono panel showing the route you asked
  for and where it "gave up":
  ```
  GET /whatever-you-typed
    at router.resolve (router/index.ts:41)
    at you.typing (keyboard.ts:1)
    at me.notWritingItYet (roadmap.ts:∞)
  ```
- **Footer rickroll kept.** The old `TOP SECRET` link survived the footer
  rewrite, now reading `Top secret 🤓👉`.
- **Home page seesaw kept.** The "6-7" that bobs up and down on hover is
  untouched.
- File: `src/views/NotFoundView.vue`, `src/components/layout/AppFooter.vue`

---

## 3. No more dark-mode flash

- Added an inline script in `<head>` that reads the saved theme and applies
  `.dark` **before first paint**.
- Previously `useTheme()` only ran once Vue mounted, so dark-mode users got a
  full white screen for the length of a bundle download.
- The script mirrors `src/composables/useTheme.ts` — if you change one, change
  the other.
- File: `index.html`

---

## 4. Meta tags / SEO / social

- Open Graph tags (`og:type`, `og:title`, `og:description`, `og:image`).
- Twitter card tags.
- `theme-color` per colour scheme, so mobile browser chrome stops flashing
  white over the dark theme.
- `apple-touch-icon` and a PNG fallback icon.
- `preconnect` to the Google Fonts hosts — the font `@import` lives in
  `style.css`, so the browser only discovers it after the CSS lands; this
  saves a round trip.
- `<noscript>` message, since the whole site is one interactive graph.
- Author meta.
- File: `index.html`

---

## 5. Theme + typography polish

- `color-scheme: light` / `color-scheme: dark` on the root. Native scrollbars,
  form controls and autofill now render in the right theme instead of always
  looking light.
- Page scrollbar restyled to match the surface palette (no more bright system
  grey stripe down the side of the dark theme).
- `text-wrap: balance` on `h1`, `h2`, `h3` — stops the light-weight headings
  from dropping a single orphan word onto the last line.
- File: `src/style.css`

---

## 6. Roadmap graph — status legend

- Added a legend under the graph header explaining the node colours:
  **Available · In progress · Done · Needs prereqs**.
- The colours were already carrying real meaning with nothing to explain them.
- Sits on the same row as "Click any node for the full brief", separated by a
  hairline.
- File: `src/views/RoadmapDetailView.vue`

---

## 7. Roadmap graph — per-stage progress

- Each stage header now shows a count like `4/7` on the right side of its rule.
- Turns emerald when the whole stage is cleared.
- Lets you see where you are without opening the Progress page.
- File: `src/components/roadmap/RoadmapGraph.vue`

---

## 8. Activity graph — fixed and explained

- **Weekday alignment fixed.** The grid started on whatever day was 140 days
  ago, so the seven rows meant nothing. Now padded at the front so every column
  is a real Mon–Sun week.
- **Weekday gutter added** down the left (Mon / Wed / Fri / Sun — alternate
  rows only, seven labels is noise at that size).
- **Legend added**: Quiet ▢ → ▣ Active.
- **Active-day count** in the section header ("31 active days").
- **Human tooltips**: `Fri, 15 Aug — active` instead of the raw `2026-08-15`.
- File: `src/views/ProgressView.vue`

---

## 9. Footer rewrite

- Was: one joke line and three links.
- Now:
  - Brand mark + one-line description of what the site is.
  - The topics / projects / resources counts.
  - **The site** column — Roadmaps, Projects, Resources, Progress.
  - **The paths** column — the three roadmaps, each with its own accent dot.
  - A bottom bar: "Progress is stored on this device first", the `Ctrl / ⌘ + K`
    search hint, the Top secret link, and a **Back to top** button.
- File: `src/components/layout/AppFooter.vue`

---

## 10. Home page cleanup

- The "Read this first" section repeated the same 60-character class string on
  eight separate paragraphs.
- `.prose-note` already existed in `style.css` but was never used — now it
  wraps the block once and the paragraphs are plain `<p>` tags.
- **Your writing is untouched.** Only the wrapper changed.
- File: `src/views/HomeView.vue`

---

## 11. README

- Was two lines (`# Vue 3 + Vite` / `hey no spoilers !!!`).
- Now covers: what the site is, a feature table, the stack, how to run it, the
  file layout, how to add new topics/projects, and the CSS conventions
  (`--track` accents, the `canvas → surface → raised → sunken` layering).
- The "no spoilers" warning is kept at the top for whoever it's meant for.
- File: `README.md`

---

## Not done — your call

- `dist/` is committed and is now stale relative to `src/`. Probably wants to
  go in `.gitignore`.
- Remaining items in `stuff-to-add.md`:
  - Writing a code word easter egg
  - "Wait im goated"
  - These need your voice more than mine.
