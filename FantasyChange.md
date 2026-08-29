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

---

# THE GRIMOIRE REBIRTH — Second Pass

## Rebirth Summary

Pass one was rejected: it replaced components and paint while preserving the
spatial model of a scrolling web page. This pass replaces the spatial model.

The viewport now contains a **book on a desk** rather than a page. Navigation
is **ribbon bookmarks** pushed into the top of the page block. Changing chapter
**turns a leaf** about the gutter while an **arcane seal** is cast on the
exposed page. Every view is authored as a **two-page spread** with a real verso
and recto separated by a stitched gutter. The roadmap is no longer drawn on the
parchment at all — it is an **aperture cut through the page** onto a celestial
realm, with the skill tree floating in a star field.

Two worlds now exist and contrast deliberately: the tome (warm, physical,
inked) and the arcane realm (cold, deep, star-lit), and the roadmap is where
the reader crosses between them.

## Why the Previous Overhaul Failed

Recorded honestly, and in full, in `Analysis.md` under *Why Pass One Failed*.
In brief:

1. **The book was a claim, not an object.** "Cover board with a leaf surface"
   was, in the browser, a `max-w-[1400px]` div with a 1px border. No desk, no
   thickness, no covers, no facing pages — so nothing read as physical.
2. **Navigation was still a navbar.** Clipping a corner off a link does not
   change the mental model of a horizontal row pinned to the top of the window.
3. **There was no transition model.** Chapter changes were a 200ms opacity
   fade — the most generic route transition that exists.
4. **The skill tree had no world separation.** Merging the stage grids fixed
   the *information* problem, but it was still beige rectangles on parchment:
   a dependency diagram, not a progression screen.
5. **Every page had the same internal layout** — stacked full-width sections
   in a centred container.
6. **The mystical dimension was absent.** One warm palette end to end, so
   nothing felt magical, only old.

## New Book Architecture

Layer order, outermost first:

    desk → cover boards → page edges → page block → facing pages → turn layer

- **Desk** (`.desk`) — the room the book sits in: dark leather with an overhead
  pool of light (radial gradient) and a fine grain. Visible on all four sides;
  this is what makes the book read as an object rather than as the page.
- **Cover boards** (`.tome-cover`) — leather showing as a margin around the
  whole block, with a gilt inner rule, an inset dark bevel and a deep contact
  shadow onto the desk.
- **Page edges** (`.page-edges`) — the paper stack along both outer sides,
  drawn as repeating hairlines. Thickness comes from stacked material edges,
  not from one large blur.
- **Page block** — carries `perspective: 2600px`, which is what allows the
  turning leaf to hinge in 3D. Has a `min-h-[68vh]` floor (see *Problems
  Found* — without it the book collapsed mid-turn).
- **Facing pages** (`.page` + `.page-left` / `.page-right`) — each takes an
  inset shadow falling *away from the gutter*, which is the detail that makes
  two columns read as two pages.
- **Gutter** (`.gutter`) — a binding channel with a dark core, a gilt seam and
  repeating stitch marks.

`BookSpread.vue` is the component every view is authored through: a `#left`
apparatus slot (folio, eyebrow, chapter title, ornamental divider, context,
`#left-foot` marginalia) and a default slot for the recto body. A `full` prop
drops the verso for pages that want the whole block (the 404).

## Bookmark Navigation

`BookmarkRail.vue` + the `.ribbon` primitive. Ribbons are anchored behind the
top edge of the block and protrude upward, with a notched (cut) tail.

**Physical irregularity is the point.** Each ribbon has its own insertion depth
(0–14px) and lean (−1.1°…+1.2°) from a fixed table, so the set reads as
something inserted over time. Even spacing and equal heights are exactly what
kept pass one's "index tabs" reading as a tab bar. Values are fixed rather than
random so the book looks the same on every visit.

States: inactive sits shallower and quieter; hover pushes the ribbon a little
further into the book and brightens it; active is taller, brighter, ringed in
gilt, and drops a short tongue down into the page it marks. `aria-current="page"`
carries the same information non-visually.

Responsive: the rail is a horizontally scrollable strip of the same ribbons —
the same object with less room, never a hamburger.

## Page-Turn System

`useBookTurn.ts` + the turn layer in `TomeShell.vue`.

**The router is never blocked.** An earlier design held navigation in a
`beforeEach` guard until the animation finished; that breaks browser
back/forward and makes direct URLs feel broken. Instead the route changes
immediately and the *visual* turn is layered over the block, so history, deep
links and the back button behave exactly as before.

Sequence: chapter change detected → turn layer raised → `.turn-leaf` rotates
about the gutter (`transform-origin: left center`, `rotateY(0 → −168deg)`,
620ms) → the seal ignites mid-turn → content swaps behind the leaf (150ms
opacity handoff) → leaf completes, seal fades, spread settles. Total ~760ms.

Only **chapter** changes turn a page: the trigger keys off the first path
segment, so opening a node (`?node=` on the same route) does not flip the book.
Because it watches the resolved route rather than click handlers, browser
back/forward triggers the identical sequence — verified.

## Arcane Loading / Magic Circle

`ArcaneSeal.vue` — entirely original SVG geometry: concentric rules, a rune
ring of 24 ticks turning slowly, counter-rotating inscribed hexagram in astral
and arcane inks, an inner sanctum, the four elemental sigils at the cardinal
points, and a central arcane sigil. A soft radial wash underneath represents
the page catching the light of the spell.

It is explicitly not a spinner — nothing here is a single arc chasing its tail
— and it is not a full-screen overlay: it is drawn inside the page block, so
the browser never stops reading as a book.

## Frontispiece

`HomeView` is now the opening spread. Verso: the seesaw `6-7` eyebrow, the
Cinzel title, ornamental divider, the intro paragraph, the two actions, and the
**census of contents** as a ruled register. `#left-foot` carries the Shafiqa
Iqbal quotation as marginalia. Recto: the three disciplines as struck plates
with insignia bands, then the full essay with its sticky short-version
sidenotes. All prose moved verbatim.

## Skill Tree Portal

`SkillTree.vue` was rewritten. The page now carries an **aperture**: scribed
corner marks in the parchment, then `.portal` — an engraved gilt lip, a
parchment step, an ink rule, and then the material falling away into the void
through layered inset shadows. The portal is a hole in the page, not a card on
it.

Structure is still driven entirely by the data (`col` lane, `row`), with stage
rows compacted onto consecutive grid rows and stage bands sharing the single
row axis so branches cross them without a seam.

## Celestial Star Field

`CelestialField.vue`. Six stacked layers, not one gradient:

1. the void; 2. three nebula regions (arcane, astral, ember radial washes);
3. faint orbital geometry; 4. four charted constellations; 5. three depth bands
of stars — 190 far / 75 mid / 24 near, with size and opacity ranges per band;
6. a vignette closing the dark in at the aperture edge.

Stars come from a **seeded mulberry32 PRNG**: a fixed seed means the sky is
identical on every render (an unseeded random would reshuffle the heavens on
every reactive update), and ~290 static SVG circles cost far less than the
equivalent animated DOM. Twinkle periods are spread 3–12s so the field never
pulses in unison, which would read as a loading state rather than a sky.

## Arcane Symbol System

`ArcaneSigil.vue` + `sigils.ts`. Nine original sigils — fire, water, earth,
air, arcane, celestial, void, nature, knowledge — each built from geometric
primitives (triangles, chords, rings, bars), not from Unicode glyphs.

Assignment is deterministic: `sigilFor(id)` hashes the node/stage id with
FNV-1a, so the same content always draws the same sigil and the symbol layer
never flickers between renders. They are **visual metadata only** — no content
was renamed or reordered to accommodate them.

## Mystical Skill Nodes

`SkillNode.vue` was rewritten as `.astral-plate`: a translucent plate floating
in the void with a thin astral border, an inner starlight highlight and a faint
internal glow, so the star field stays visible around it.

**Legibility is the governing constraint** — the plate is dark enough
(`--void-deep` at 82%) to carry text over stars, because "beautiful screenshot
nobody can read" is the failure mode of this idea. Each node has a sigil well,
the status label, a Cinzel title, the tagline and the time estimate.

States: locked is veiled and dashed with no glow but still discoverable;
available is clear astral; in-progress gathers ember light along the edge and
the sigil drifts; sealed carries druid-green energy plus a struck completion
mark over the sigil. State is always carried by material **and** sigil **and**
text label, never colour alone.

## Magical Connectors

Each pathway is drawn twice: a broad low-opacity halo in the state's ink, then
a bright thin filament over it — so the connector reads as light rather than as
a stroke. Sealed routes burn druid-green, walkable routes astral, dormant
routes are barely charted (2/8 dash at 0.22 opacity). Live paths animate their
dash only when motion is allowed.

## Projects Page

Recomposed as a spread: verso carries the brief, the "I'm bored" action and a
live shown/total count; recto carries the filters and the tiered project
records. Titles, blurbs, tiers and briefs untouched.

## Resources Page

Spread: verso carries the archive statement and the shown/total count; recto
carries the filters and the grouped folios. All 234 URLs untouched.

## Progress Ledger

Spread: verso carries the seal (progress ring), current skill level and current
roadmap; recto carries the register of standing as ruled ledger rows, the
`LedgerGrid` record of practice, per-roadmap standing, pick-back-up, recently
cleared, achievements and the reset block. All figures and captions unchanged.

## Manuscript Modals

`ManuscriptModal.vue` was re-evaluated and kept: a loose sheet with deckled
top/bottom edges, corner registration marks, a heavy ink rule under the header
and a hard offset shadow, entering with `set-down` (a short fall, hard stop and
one settle). It already reads as a physical sheet placed on the book, and its
focus-trap/escape/scroll-lock contract is depended on by both call sites.

## Responsive Design

Desktop ≥`lg`: full spread, verso + gutter + recto, ribbons along the top.
Below `lg`: a single page — the apparatus stacks above the body, the gutter is
withdrawn, margins condense — while the desk, covers, page edges and ribbons
all persist, so it still reads as a page in a book. The portal keeps its full
celestial treatment on mobile; only the tree layout falls back to a single
column.

`min-w-0` on both pages is load-bearing (see *Problems Found*).

## Accessibility

- Semantic `nav` (`aria-label="Chapters"`), `main`, `button`, `a`; skip link
  retained.
- The entire turn layer is `aria-hidden` + `pointer-events-none` — scenery,
  never content; focus can never land inside the leaf.
- `aria-current="page"` on the active ribbon; `aria-current` on the active node.
- Node state is carried by material **and** sigil **and** visible text label,
  so it never depends on hue — important now that nodes sit on a dark field.
- Reduced motion: `useBookTurn` takes a separate branch that skips the leaf
  entirely (`motion-reduce:hidden`) and runs a short seal + crossfade, keeping
  the conceptual beat without rotating a large surface. Star twinkle, sigil
  drift and connector dashes are all `motion-safe:`-gated.
- Modal focus trap, escape, focus restore and scroll-lock preserved unchanged.

## Performance

- Stars are generated once as data and rendered as static SVG circles; no
  per-frame JS, no thousands of DOM nodes.
- The turn animates `transform` and `opacity` only.
- The rAF-throttled, `ResizeObserver`-driven graph measurement was preserved
  rather than rewritten.
- All ornament is CSS/SVG; no raster textures were added.

## Content Integrity Verification

`md5sum` of every file in `src/data/` re-checked against the baseline captured
before the first overhaul — all nine byte-identical:

    achievements.ts OK   advice.ts OK   backend.ts OK   frontend.ts OK
    projects.ts OK       python.ts OK   resources.ts OK roadmaps.ts OK
    types.ts OK

That covers 93 topics, 58 projects, 234 resources and their URLs, 20
achievements, and every prerequisite, stage, description and time estimate.

Template prose grepped and confirmed present after being moved between files:
`yappucino`, `programmucino`, `DO THE PROJECTS LAZMI`, `Kidhar phuss gaya`,
`Top secret`, `crumbl`, `Shafiqa Iqbal`, `no SEO slop`.

Status labels, navigation labels, progress semantics, storage keys and the
`?node=` / `?project=` query model are unchanged. The one new label introduced
is the "Frontispiece" ribbon for `/` — an added chapter name for a route that
previously had no nav entry, not a rename of an existing one.

## Browser Verification

Headless Chromium. Asserted no `pageerror`, no `console.error`, and
`body.scrollWidth <= clientWidth` on every combination.

- **Routes (9):** `/`, `/roadmaps`, `/roadmaps/frontend`, `/roadmaps/backend`,
  `/roadmaps/python`, `/projects`, `/resources`, `/progress`, 404.
- **Themes:** light and dark, every route.
- **Widths:** 1400×1000 and 390×844.
- **Interactions:** ribbon click → turn layer and seal present mid-flight, then
  removed after settle; **browser back → turn fires again** and the URL is
  correct; node click → modal opens with `?node=`; start → complete transitions
  update the tree; Escape closes, clears the query, restores focus and unlocks
  body scroll; `Ctrl+K` opens the palette; project brief opens from `/projects`.

Result: `ALL CHECKS PASSED`.

## Problems Found

| # | Problem | How it showed up |
| --- | --- | --- |
| 1 | Ribbon labels clipped ("FRONTISPIECE" cut off) | fixed 5.25rem ribbon width could not hold the longest label |
| 2 | Ribbons floated above the book instead of being inserted into it | rail had no negative offset into the block |
| 3 | Star field too faint to read as a night sky | initial densities/opacities were too conservative |
| 4 | **The book collapsed to a strip mid-turn, and the seal vanished with it** | `mode="out-in"` unmounts the outgoing view before the incoming one mounts, so the block had no in-flow content and zero height; the absolutely-positioned turn layer collapsed with it |
| 5 | 4px horizontal overflow on mobile `/progress` | grid items default to `min-width: auto`, so a page's min-content pushed the spread (424px) wider than the 390px viewport |

## Fixes Applied

1. Ribbon switched to `min-width` + horizontal padding with `whitespace-nowrap`
   and a slightly smaller tracking.
2. Rail given `-mb-2` and top padding so ribbons tuck behind the block's edge.
3. Star bands raised to 190/75/24 with brighter opacity ranges; vignette eased
   from 0.92 to 0.8 so the outer sky is not swallowed.
4. `min-h-[68vh]` on both the page block and `main`, plus `bg-canvas` on the
   block so the paper is continuous during the swap.
5. `min-w-0` on both facing pages and `w-full` on the spread grid.

Problems 1–5 were only findable by reading rendered screenshots; the build was
clean throughout.

## Files Added

| File | Purpose |
| --- | --- |
| `src/components/book/TomeShell.vue` | The tome: desk, covers, page edges, block, colophon, turn layer |
| `src/components/book/BookSpread.vue` | The two-page spread every view is authored through |
| `src/components/book/BookmarkRail.vue` | Ribbon bookmarks |
| `src/components/arcane/ArcaneSeal.vue` | The casting seal / loading state |
| `src/components/arcane/ArcaneSigil.vue` | The nine-sigil arcane alphabet |
| `src/components/arcane/sigils.ts` | Sigil vocabulary + deterministic id→sigil hash |
| `src/components/arcane/CelestialField.vue` | The layered night sky |
| `src/composables/useBookTurn.ts` | Non-blocking page-turn coordinator |

## Files Modified

`src/App.vue` (now just the tome + routed spread), `src/style.css` (desk /
cover / page / gutter / ribbon / portal / astral-plate / turn-leaf primitives
and the world-two token set), `tailwind.config.js` (`leaf-turn`, `seal-cast`,
`rune-spin`, `twinkle`, `drift` + desk/ribbon/void/star/astral/arcane/ember
colours), `src/components/roadmap/SkillTree.vue` (rewritten as the portal),
`src/components/roadmap/SkillNode.vue` (rewritten as an astral plate),
`src/components/layout/AppFooter.vue` (now sits on the desk, so its inks were
re-toned for leather), and all seven views re-authored as spreads.

## Files Removed

`src/components/layout/AppNav.vue` — the sticky header. Its functions moved to
`TomeShell` (colophon: brand, progress, user, search, theme) and
`BookmarkRail` (chapters). References were grepped before deletion; none
remained.

## Git History

- Branch: `fantasy-revamp`, starting from `f05ee8e`.
- Pre-existing work preserved: an editor auto-format of
  `RoadmapDetailView.vue` in the working tree, and the user's own commit
  `28c7842`. Neither was reverted or overwritten.
- One commit containing the rebirth plus both documentation updates.
- Pushed to `origin/fantasy-revamp`; `main` verified non-divergent via
  `git merge-base` before integrating; fast-forwarded and pushed to
  `origin/main`; returned to `fantasy-revamp`.
- No force-push, no reset, no branch deletion, no history rewrite.

## Final State

Checked out on `fantasy-revamp`, working tree clean, `fantasy-revamp` and
`main` both at the rebirth commit. Build clean (`vue-tsc --noEmit` + Vite).
Browser verification passing across all routes, themes and widths.

---

# Polish Pass — Requested Changes and Fixes

## 1. Diamond stars

`CelestialField.vue` now emits each star as a four-pointed diamond path
(`M x,y−r  L x+r,y  L x,y+r  L x−r,y  Z`) instead of a `<circle>`. The path is
built once at generation time alongside the seeded position, so the render is
still one element per star with no per-node transform to resolve — a rotated
`<rect>` would have cost a transform on every one of ~290 stars.

Diamonds read visually smaller than discs at the same radius, so the three
depth bands were widened to compensate (far 0.7–1.3, mid 1.4–2.2, near
2.2–3.1) and the near band nudged to 26 stars.

## 2. Login modal — fixed

The modal was **invisible**: the backdrop rendered and dimmed the page, but the
dialog itself was nowhere on screen. Four separate defects, all fixed:

**a. The dialog was positioned out of the viewport (the visible bug).**
`.corner-frame` set `position: relative`. As a custom utility it is emitted
*after* Tailwind's core utilities, so it silently overrode `fixed` on the same
element — the teleported dialog was demoted to static flow and rendered below
the footer. The command palette had the identical bug.
Fix: `.corner-frame` no longer sets `position` at all; callers that need a
positioning context (`ProjectCard`, `AchievementCard`) add `relative`
themselves, and the two `fixed` dialogs are left alone.

**b. A dangling CSS class.** Both dialogs referenced `.page-edge`, whose
definition was removed during the rebirth (it was replaced by `.page-edges`,
which is a different thing — the book's paper stack). Restored as
`.inset-rule` with a name that cannot be confused with the book furniture.

**c. The field was never focused, and Escape did nothing.**
`showLoginModal` is initialised to `true` for a first-time visitor, so a lazy
watcher never fired for the exact case that needed it. The watcher is now
`immediate`, and Escape plus the Tab focus trap are bound at the window rather
than on the panel — a panel-level handler only sees keys once something inside
it already has focus, which on a cold open is never. Body scroll is now locked
while it is up, and released on close.

**d. The offline notice was unreachable.** `setUsername` closed the modal
itself, so the caller's "couldn't reach the sync server" message was written to
an already-dismissed dialog and no one had ever seen it. `setUsername` no
longer closes the modal; the caller decides once the sync result is known, and
on a failed sync the sheet is held open long enough to read the notice.

## 3. Longer arcane loading — 2 seconds

`seal-cast` runs 2s, with its keyframes reshaped so the extra time is spent
*lit* (opaque from 14% to 82%) rather than fading in slowly. `leaf-turn` was
lengthened to 850ms so the page does not finish turning long before the spell
it accompanies, and the rune rings were sped up (9s / 14s) so a 2s hold shows
visible rotation. `useBookTurn` timings follow at 2000ms / 2060ms.

A **veil** was added to make the extra second meaningful: a parchment layer
under the leaf that holds opaque while the seal burns and lifts in the last
~40% (`veil-lift`). Without it the leaf finished at 850ms and the new chapter
simply sat exposed behind a still-glowing seal for another second. Now the
spell genuinely reveals the page. Reduced motion skips both the leaf and the
veil and keeps a shorter seal-only beat.

## 4. Additional improvements

**Recommended next step marked in the tree.** The tree could already show what
was *reachable* but never where to actually go next — the single most useful
thing a progression screen can say. `SkillNode` takes a `next` flag, driven by
the existing `nextUp` selector, and marks that node with a small ember plate.
No content or ordering changed; this is presentation of a value the product
already computed.

**Deep-linked nodes no longer strand the reader.** Arriving at `?node=<id>`
from the command palette or a cross-roadmap prerequisite opened the brief while
the tree stayed scrolled to the top, so closing it left you with no idea where
that node lived. The tree now parks on it. Deliberately fires on *close*, not
open: the sheet locks body scroll while it is up, so a scroll issued at open
time silently does nothing.

**Node briefs carry their sigil.** The sheet repeats the node's portal sigil,
so it is visibly the record of *that* node rather than a generic dialog.

**Browser chrome matches the desk.** `theme-color` pointed at the old page
colours; the book now sits on a desk, and that is what meets the browser chrome
at the viewport edge.

**Focus rings survive the leather.** On the cover board the track accent can
fall to almost no contrast, so ribbons and colophon controls get a gilt ring
plus a dark halo.

### Two further bugs found while verifying the above

**Modals mounted open did nothing.** `ManuscriptModal`'s watcher was not
`immediate` either, so landing directly on `?node=<id>` mounted it with `open`
already true and it opened with no focus, no scroll lock and no Escape handler.
Same root cause as the login modal. Fixed the same way.

**A closed modal wiped the open one's scroll lock.** Two `ManuscriptModal`
instances mount at once (node sheet + project sheet). Once the watchers became
`immediate`, the closed one's teardown branch ran on its first tick and cleared
the body scroll lock the open one had just set. Both modals now guard teardown
behind a `hasOpened` flag so a sheet that was never open never runs cleanup.

## Verification

`npm run build` clean. Headless Chromium sweep re-run: 9 routes x 2 themes x 2
widths, no console errors, no horizontal overflow — `ALL CHECKS PASSED`.
Targeted checks: login modal centred at 380x380 with the field focused and
scroll locked, Escape closing and unlocking; seal present at 400/1200/1900ms
and gone by 2300ms; veil holding the page at 1200ms; deep link opening with a
lock and parking the tree at `scrollY 490` on close. `md5sum` of all nine
`src/data/` files unchanged.
