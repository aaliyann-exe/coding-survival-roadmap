# FantasyChange.md — The Grimoire Overhaul

Implementation record for the fantasy-RPG / ancient-grimoire reconstruction of
the Coding Survival Roadmap. Companion to `Analysis.md`, which records the
pre-implementation investigation.

---

## 1. Overview

### What was rebuilt

The presentation layer, structurally — not restyled. Navigation, application
shell, the roadmap graph, the node component, the detail modal, the progress
view, the home title page and the CSS architecture were all replaced. Three
legacy components were deleted once their replacements were verified.

### The original problem

Two earlier passes had already changed colours, fonts, border radii and border
weights. The result still read as a SaaS dashboard because the *structure* was
untouched:

- a conventional sticky header (logo left, link row, icon buttons right),
- every view a stack of full-width `max-w-6xl` bands,
- the roadmap split into one CSS grid **per stage**, so it read as seven
  separate card grids rather than one branching tree,
- node details in a right-hand drawer — the most standard disclosure pattern
  in modern web apps,
- progress as a ring + stat-tile grid + heatmap + card grid.

Recolouring those shapes could not fix them. They had to be replaced.

### Final design direction

One physical artifact: a codex resting on a leather cover board. Light theme =
**Ancient Tome** (parchment, ink, brass). Dark theme = **Cursed Grimoire** —
re-authored, not inverted: charred leather, faded silver, tarnished gold.
Navigation is index tabs cut into the book's edge. The roadmap is one
continuous engraved skill tree. Node briefs are loose manuscript sheets set
down on the open book. Progress is a scribe's ledger.

### Architectural philosophy

Content and behaviour were treated as immutable; presentation as fully
replaceable. Because 100% of user-facing content already lived in `src/data/`
(plus prose inline in two templates), the entire rendering layer could be
rebuilt without touching a single string. Verified mechanically — see §12.

---

## 2. Files added

| File | Purpose |
| --- | --- |
| `Analysis.md` | Pre-implementation investigation: repo/UI/architecture analysis, content inventory, regression risks, redesign strategy, verification plan. |
| `FantasyChange.md` | This document. |
| `src/components/roadmap/SkillTree.vue` | Replaces `RoadmapGraph.vue`. Renders the whole roadmap as one continuous grid with state-aware SVG connectors. |
| `src/components/roadmap/SkillNode.vue` | Replaces `RoadmapNodeCard.vue`. Engraved plaque with a rune well; state carried by material + glyph + label. |
| `src/components/ui/ManuscriptModal.vue` | Replaces `BaseDrawer.vue`. Centred manuscript sheet with deckled edges; identical behavioural contract. |
| `src/components/progress/LedgerGrid.vue` | The contribution graph as a ruled practice register. |

## 3. Files removed

| File | Why it was safe to remove |
| --- | --- |
| `src/components/roadmap/RoadmapGraph.vue` | Fully superseded by `SkillTree.vue`. Grepped for references — only its own definition matched. |
| `src/components/roadmap/RoadmapNodeCard.vue` | Superseded by `SkillNode.vue`. No remaining references. |
| `src/components/ui/BaseDrawer.vue` | Superseded by `ManuscriptModal.vue`, which reimplements the same props/slots/focus contract. Both call sites migrated first, then references re-grepped, then deleted, then rebuilt and re-verified. |

## 4. Files changed

### `src/style.css` — rewritten

- **Material tokens.** Added `--board` (the cover the pages sit on), `--seal`
  (druid green), `--gild` (aged gold), `--wax` (crimson), `--grain`,
  `--edge-shadow`. Dark theme re-authored rather than inverted; `--seal` and
  `--wax` are *lifted* in dark so they stay legible on charcoal, which a
  hard-coded hex could never do.
- **Self-hosted `@font-face`** kept as the primary font source (see §6).
- **New component primitives:** `.leaf` / `.leaf-stack` (page surface + the
  stack of pages showing along the outer edge), `.binding`, `.on-board`,
  `.index-tab`, `.plaque` + `.plaque-locked` / `-active` / `-sealed`,
  `.rune-well`, `.manuscript`, `.ledger-row`.
- **New ornament utilities:** `.grain` (procedural paper tooth — two hairline
  gratings, no image, no blur filter), `.corner-frame`, `.ink-rule`,
  `.chapter-numeral`, `.wax-seal`, `.quest-chain`, `.tablet-cut`.
- Buttons changed from "border tint" to inked plaques that invert on hover.

### `tailwind.config.js`

- `emerald` / `amber` / `red` re-pointed at `--seal` / `--gild` / `--wax`, so
  any lingering stock status utility renders in the grimoire's ink and follows
  the theme. `board`, `seal`, `gild`, `wax` added as first-class colours.
- `boxShadow.codex` (the whole book on a desk); `shadow-seal` renamed
  `shadow-stamp` (it was unused; checked before renaming).
- Keyframes `set-down` (a sheet dropped on a desk: short fall, hard stop, one
  small settle) and `ink-in`. All border radii remain `0`.

### `index.html`

- Added the Google Fonts `<link>` required by the directive, **after** the
  local preloads, with a comment explaining it is a secondary source: the
  self-hosted `@font-face` rules are declared first and win, because this CDN
  is blocked on some networks and fails silently when it is.

### `src/App.vue`

Rebuilt as the artifact shell: the app sits on a `bg-board` cover with the
content inside a `.leaf .leaf-stack .grain` page surface and `shadow-codex`, so
it reads as an object with edges rather than a page that ends where the window
does. Skip-link restyled; router transition preserved.

### `src/components/layout/AppNav.vue` — rebuilt

Header replaced by two parts: a **colophon bar** stamped on the cover board
(brand, progress, user, search, theme) and **index tabs** cut into the book
edge. The active tab drops its bottom border and gains an inset top rule, so it
reads as physically continuous with the page. The hamburger menu is gone — on
narrow screens the tabs become a horizontally scrollable strip of the same
plates, so the metaphor survives the breakpoint instead of collapsing into a
generic drawer.

### `src/views/RoadmapDetailView.vue`

Header rebuilt as a **discipline title page**: struck insignia plate, Cinzel
title, ink rule, and a right-hand **register of standing** with figures
right-aligned against dotted leader rules (replacing the 2-up stat-tile grid).
Legend entries now carry a rune as well as a colour. Swapped in `SkillTree`
and `ManuscriptModal`.

### `src/views/ProgressView.vue`

Recomposed as a ledger: title block with ink rule, seal + **register of
standing** (`.ledger-row`, dotted leaders, right-aligned figures) replacing the
2×3 stat tiles, and `LedgerGrid` for the practice record. The inline
activity-grid logic (`DAY_LABELS`, `WINDOW_DAYS`, `activityGrid`,
`activeDaysInWindow`, `cellTitle`, the `Cell` interface) moved into
`LedgerGrid` and was deleted here rather than left as dead code.

### `src/views/HomeView.vue`

Hero replaced by a **frontispiece**: double rule above the title, Cinzel
title, double rule below, and the counts set as a ruled **census of contents**
instead of a 4-up stat grid. The three disciplines became `.plaque` school
plates with an insignia band. The gradient scrim was removed. All essay prose,
the seesaw `6-7` easter egg and the quote were moved verbatim.

### `src/views/ProjectsView.vue`

Swapped `BaseDrawer` → `ManuscriptModal`. No other changes.

---

## 5. Global UI

**Shell.** `bg-board` cover → `.leaf` page surface (max-width 1400px, side
margins from `sm` up) → content. `.leaf-stack` draws the page-stack edge;
`.grain` gives paper tooth procedurally. `shadow-codex` seats the book.

**Navigation.** Colophon bar + index tabs, described above.

**Responsive.** From `sm`, side margins appear and the page-stack edge is
drawn. Below `md` the skill tree drops explicit grid placement and becomes a
`.quest-chain` — a vertical inked trail with waypoint marks — so progression
still reads as a path, not a list of disconnected cards.

---

## 6. Typography

| Face | Used for |
| --- | --- |
| **Cinzel** | Site/brand, page titles, chapter (stage) names, node titles, modal headings, skill-level and roadmap names |
| **EB Garamond** | Body: descriptions, essay, taglines, blurbs, resource text (also the `html/body` default) |
| **Fira Code** | Stamped technical labels, all `label-mono`/eyebrow text, tabular figures, ledger values, kbd, time estimates |

All three are **self-hosted** from `public/fonts/*.woff2` via `@font-face`
(added in the previous pass, retained here) and are the primary source. The
Google Fonts `<link>` requested by the directive was added as a secondary
source; the local rules are declared first and win. This ordering is
deliberate: an earlier pass shipped a Google-Fonts-only `@import`, and it
silently fell back to a system serif for the user, which is what triggered the
"the fonts didn't even change" feedback.

---

## 7. Theme system

**Light — Ancient Tome:** parchment `#F4EFE6`, aged page `#EAE0C8`, ink
`#2C241B`, brass `#C6A664`, cover board `#3C2D21`.

**Dark — Cursed Grimoire:** charred leather `#1A1514`, faded silver `#D4C9B9`,
tarnished gold `#8A6B32`, near-black board. Not an inversion: `--seal` and
`--wax` are lifted for legibility on charcoal, `--edge-shadow` is strengthened
(0.18 → 0.6) because hard offset shadows read differently on dark material, and
grain switches from dark-on-light to gold-on-dark.

**Discipline accents.** The existing `--track` mechanism was kept and built on
rather than replaced: frontend = steel-blue ink, backend = forest green,
python = arcane violet, each with a separate dark-theme value.

**State styling.** Locked = dashed dormant stone, reduced contrast, lock glyph.
Available = crisp inked plate, `◆`. In progress = gilded top inset edge, `◈`,
slow flicker. Mastered/completed = green-inked border and a struck wax seal
(double-ruled for mastered, solid for completed).

**Contrast fix found in review.** The colophon bar used `text-canvas`, which is
parchment in light (fine on dark leather) but charcoal in dark — invisible on
the near-black board. Added an `.on-board` primitive resolving to `--canvas` in
light and `--ink` in dark.

---

## 8. Roadmap — old vs new

**Old.** One `<section>` per stage, each with its own CSS grid; global `row`
remapped to a stage-local row via `localRow()`. Edges drawn in one SVG overlay,
but the composition split the tree into N card grids.

**New.** **One continuous grid for the entire roadmap.** `layout` computes, in
a single pass, an explicit grid row for every element on a shared axis: a
full-width chapter band per stage, then that stage's nodes. Nodes keep
`gridColumn: col + 1`, so the authored lane structure and branching are
preserved exactly as the data specifies. Because it is now one grid,
prerequisite edges span the whole tree — a branch crossing a chapter band is a
single unbroken path.

**Node implementation.** `SkillNode` — a `.plaque` with a `.rune-well` glyph
column, Cinzel title, tagline, and time. Milestone nodes (those gating ≥3 other
nodes, computed from the prerequisite graph) are struck larger.

**Connectors.** Each edge is inked twice — a heavy stroke plus a thin
canvas-coloured groove — so it reads as a channel cut into the page. Three
states: `sealed` (both ends cleared, green), `open` (walkable, track accent),
`locked` (dashed, faint). A live path animates only when motion is allowed.

**Positioning logic.** Row values are compacted per stage onto consecutive grid
rows, because the data's global `row` indices can skip (a stage may use 19, 21,
23) and an empty grid row still costs a full row gap.

**Responsive.** Below `md`, explicit placement is dropped and the container
becomes `.quest-chain`.

**Performance.** The rAF-throttled `measure()` + `ResizeObserver` +
`window.resize` + progress-watch wiring was preserved deliberately: geometry is
read in one batched pass per frame, so merging every stage into a single canvas
did not introduce layout thrashing.

### Two real bugs found and fixed during browser verification

1. **Chapter band overlapping a node.** The row cursor advanced by
   `distinct.length` when nodes occupy `cursor+1 … cursor+distinct.length`, so
   the next stage's band landed on the last node's row. Fixed to
   `+ distinct.length + 1`.
2. **Mobile rendered all chapter headings, then all nodes.** The template used
   two sibling `v-for` loops (bands, then nodes). Explicit grid rows hid this
   on desktop, but below `md` there is no placement and DOM order *is* the
   layout. Replaced with a single interleaved `items` list in reading order —
   which also makes tab order and screen-reader order match the visual order.

---

## 9. Modals

**Old.** Right-hand drawer, `translate-x` slide, blurred backdrop.

**New.** A manuscript sheet placed on the open codex: centred, max-width 2xl,
`.manuscript` frame with repeating-gradient deckled top/bottom edges, an inset
gilt rule, and a hard 8px offset shadow. Header has corner registration marks,
a `❖` chapter mark, a Cinzel title and a heavy `.ink-rule`. The backdrop is a
plain `bg-board/75` shadow — no `backdrop-blur`.

**Transition.** `set-down` — a short fall with a slight rotation, a hard stop
and one small settle, wrapped in `motion-safe:` so reduced-motion users get no
travel.

**Behaviour preserved exactly:** same props (`open`, `title`, `eyebrow`), same
default + `#footer` slots, `Teleport` to body, focus capture and restore,
`Escape` to close, Tab focus trap over the same `FOCUSABLE` selector, body
scroll lock with unmount cleanup, and the query-driven (`?node=`/`?project=`)
open/close model. Both call sites migrated without touching their logic.

---

## 10. Progress

The contribution graph became `LedgerGrid`: a framed register with a header
rule, a weekday gutter, and cells drawn as bordered boxes inside a ruled grid
(the container background shows through the gaps as grid lines) rather than
detached tiles. Active days are inked in `--seal`.

**Data preserved:** same `activeDays` source, same 140-day window, same
Monday-aligned front padding, same `Intl.DateTimeFormat` tooltips, same
`role="img"` + `aria-label` summary. Stat tiles became `.ledger-row` entries
with dotted leaders and right-aligned figures. Every number and every caption
is unchanged.

---

## 11. Accessibility

- **Non-colour state indicators.** Every node state carries a distinct rune
  (`✦ ◆ ◈ ❖`), a distinct border treatment (dashed / solid / gilded / sealed)
  and a visible text label. The tree legend shows the runes, not colour swatches.
- **Reading order.** The interleave fix (§8) makes DOM order — and therefore
  tab and screen-reader order — match the visual order.
- **Focus.** Modal focus trap, restore-on-close and `Escape` preserved;
  verified in-browser that focus returns to the invoking element. Focus rings
  use the track accent at 2px with offset. Skip-link retained.
- **Semantics.** `aria-current="page"` on the active tab, `aria-label` on the
  tab nav, `aria-current` on the active node, `role="dialog"`/`aria-modal`,
  `role="img"` on the ledger, `aria-hidden` on all ornament.
- **Reduced motion.** The global `prefers-reduced-motion` block still nulls all
  animation; the modal transition is `motion-safe:`-gated; connector dash
  animation is suppressed via `useReducedMotion()`.
- **No hover-only information.** Hover reveals emphasis only; every label is
  always present.
- **Touch targets.** Tabs and the modal close control are ≥32px.

---

## 12. Content integrity

**Method.** An `md5sum` baseline of every file in `src/data/` was captured
before any work began and re-checked after completion:

```
src/data/achievements.ts: OK      src/data/projects.ts:  OK
src/data/advice.ts:       OK      src/data/python.ts:    OK
src/data/backend.ts:      OK      src/data/resources.ts: OK
src/data/frontend.ts:     OK      src/data/roadmaps.ts:  OK
                                  src/data/types.ts:     OK
```

All nine files byte-identical. That covers **93 topics, 58 projects, 234
resources with their URLs, 20 achievements, all prerequisites, stages,
descriptions, `why` text, gotchas, time estimates and advice copy**.

**Prose living in templates** was moved verbatim and spot-checked by grep:
`yappucino`, `programmucino`, `DO THE PROJECTS LAZMI`, `Kidhar phuss gaya`,
`Top secret`, `crumbl`, `Shafiqa Iqbal` — all present.

**One deliberate correction during implementation.** An early draft of
`SkillNode` renamed the status labels ("Locked" → "Sealed", "Available" →
"Open"). That is product terminology, not decoration, so it was reverted to the
original labels before completion. The fantasy is carried by the material and
the rune, not by renaming states.

**Also unchanged:** progress state machine and storage keys
(`roadmap-progress-v2`, the v1 title-keyed migration), streak and
study-hour maths, backend sync, `?node=`/`?project=` routing, `scrollBehavior`,
the footer YouTube easter egg, the 404 poke counter and fake stack trace, and
the `main.ts` console jokes.

---

## 13. Verification

**Commands.** `npm run build` (`vue-tsc --noEmit` + Vite) — clean, no type
errors, no warnings, after every stage of the rebuild and again after deleting
the legacy components.

**Automated browser sweep** (headless Chromium via Playwright), asserting no
`pageerror` and no `console.error`, and `body.scrollWidth <= clientWidth`:

- **Routes:** `/`, `/roadmaps`, `/roadmaps/frontend`, `/roadmaps/backend`,
  `/roadmaps/python`, `/projects`, `/resources`, `/progress`, and a 404 path.
- **Themes:** light and dark, every route.
- **Widths:** 1400×1000 desktop, 390×844 mobile.
- **Interactions:** open a node → modal opens and `?node=` appears; mark
  in-progress → completed and confirm the tree re-renders; `Escape` closes,
  clears the query and restores focus; body scroll unlocks; `Ctrl+K` opens the
  command palette; open a project brief from `/projects`.

**Result:** `ALL CHECKS PASSED`.

**Issues found and fixed:**

| # | Issue | Fix |
| --- | --- | --- |
| 1 | 4px horizontal overflow on every mobile route | `.leaf-stack::after` protruded past the viewport where the shell runs flush; gated to `≥640px` |
| 2 | Chapter band overlapped the last node of the previous stage | Row cursor off-by-one (§8) |
| 3 | Mobile rendered all chapter headings then all nodes | Single interleaved render list (§8) |
| 4 | Colophon bar text near-invisible in dark mode | Added `.on-board` token (§7) |
| 5 | Large dead vertical gaps down the tree | Compact stage rows onto consecutive grid rows (§8) |

Issues 2–5 were only findable by looking at rendered screenshots — the code
compiled cleanly throughout.

---

## 14. Git history

- **Branch used:** `fantasy-revamp` (already checked out at start).
- **Starting commit:** `9f23e4f`.
- **Commit:** "Rebuild the roadmap UI as a fantasy grimoire RPG artifact" —
  the full overhaul plus `Analysis.md` and `FantasyChange.md`.
- **Push:** `fantasy-revamp` → `origin/fantasy-revamp`.
- **Integration with `main`:** `main` had no commits of its own beyond the
  merge base (verified with `git merge-base` before integrating), so
  `git merge main` into `fantasy-revamp` was a no-op ("Already up to date")
  and `main` fast-forwarded onto the redesign. No conflicts, no force-push, no
  branch deletion, no history rewrite.
- **Push:** `main` → `origin/main`.
- **Final state:** checked out on `fantasy-revamp`, working tree clean,
  `fantasy-revamp` and `main` both at the overhaul commit.

Commit authorship uses the account's GitHub noreply address, because this
repository's account has email-privacy protection enabled and rejects pushes
carrying the locally configured address.
