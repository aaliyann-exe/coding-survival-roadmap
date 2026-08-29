# Analysis.md — Pre-Implementation Investigation

This document records the codebase investigation carried out **before** the
Grimoire Overhaul was implemented. It describes the application as it existed
at commit `9f23e4f` (branch `fantasy-revamp`), why its UI still read as a
generic dashboard despite two earlier theming passes, and the technical
strategy chosen for the rebuild.

---

## 1. Repository understanding

### 1.1 Project shape

| Aspect | Finding |
| --- | --- |
| Framework | Vue 3 (`<script setup>`, Composition API), TypeScript |
| Build system | Vite 8, `vue-tsc --noEmit` typecheck in the `build` script |
| Styling | Tailwind CSS 3 (`darkMode: "class"`) + a hand-written token layer in `src/style.css` |
| Routing | `vue-router` 4, `createWebHistory` |
| State | Module-scoped `reactive()` singletons in composables — no Pinia/Vuex |
| Persistence | `localStorage`, with best-effort sync to an optional Go backend |
| Backend | `backend/` (Go + PostgreSQL). Entirely optional; the site works offline |

### 1.2 Important directories

```
src/
  components/
    achievements/  AchievementCard, AchievementToast
    auth/          LoginModal
    layout/        AppNav, AppFooter
    projects/      ProjectCard, ProjectDetail
    resources/     ResourceCard
    roadmap/       RoadmapGraph, RoadmapNodeCard, NodeDetail, NodeProgressControls
    search/        CommandPalette
    ui/            AppIcon, BaseDrawer, ProgressBar, ProgressRing
  composables/     useProgress, useAchievements, useTheme, useSearch, useUser, useMotion
  data/            frontend, backend, python, projects, resources, achievements, advice, types, roadmaps
  views/           HomeView, RoadmapsView, RoadmapDetailView, ProjectsView, ResourcesView, ProgressView, NotFoundView
  router/index.ts
  lib/api.ts
  style.css
public/fonts/      self-hosted woff2 (added in the previous pass)
```

### 1.3 Routing architecture

`src/router/index.ts` defines seven routes. `HomeView` is eagerly imported;
every other view is lazy (`() => import(...)`).

| Path | Name | View |
| --- | --- | --- |
| `/` | home | HomeView |
| `/roadmaps` | roadmaps | RoadmapsView |
| `/roadmaps/:id` | roadmap | RoadmapDetailView |
| `/projects` | projects | ProjectsView |
| `/resources` | resources | ResourcesView |
| `/progress` | progress | ProgressView |
| `/:pathMatch(.*)*` | not-found | NotFoundView |

**Critical routing detail:** node and project detail panels are *not* routes.
They are driven by the query string — `?node=<id>` and `?project=<id>` — and
`scrollBehavior` deliberately returns `false` when `to.path === from.path` so
opening a panel does not scroll the page. Any modal rebuild must keep this
query-driven model intact, or deep links and back-button behaviour break.

### 1.4 State management / data flow

State lives in module-scope singletons created once per page load and shared by
every component that calls the composable. There is no store library.

- **`useProgress`** — the core. Holds `state = reactive({ topics, projects, activeDays })`.
  - `topics: Record<nodeId, "in-progress" | "completed" | "mastered">`
  - `projects: Record<projectId, true>`
  - `activeDays: string[]` of ISO dates, newest last, capped at 400 entries.
  - Persists to `localStorage["roadmap-progress-v2"]` via a deep `watch`.
  - Migrates the v1 key `roadmap-completed-steps` (which was keyed by node
    *title*, not id) on first load.
  - Derives: `completedNodeIds`, `startedNodeIds`, `completedProjectIds`,
    `statusOf(node)`, `streak`, `longestStreak`, `totalEstimatedHours`,
    `perRoadmap`, `overallPercent`, `skillLevel`, `nextUp`.
  - **`statusOf` is the single source of node state** and computes `locked`
    vs `available` from `prerequisites.every(p => completed.has(p))`. This is
    the function the whole skill-tree visualisation must consume.
- **`useUser`** — username-only pseudo-identity (not auth). Changing the user
  re-hydrates progress from the backend; logging out blanks local state so one
  user's data cannot flash on screen while another logs in.
- **`useTheme`** — toggles `.dark` on `<html>`, persists to `localStorage.theme`.
  Mirrored by an inline script in `index.html` that runs before first paint to
  avoid a white flash.
- **`useAchievements`** — evaluates `data/achievements.ts` conditions against a
  progress snapshot and maintains an unlock queue for toasts.
- **`useSearch`** — builds the command-palette index over nodes, projects,
  resources and pages.
- **`useMotion`** — `useReducedMotion()` wraps `prefers-reduced-motion`.

### 1.5 Styling / theme architecture

`src/style.css` defines RGB-triplet CSS custom properties consumed by Tailwind
through `rgb(var(--x) / <alpha-value>)` colour definitions. Surfaces are
layered `canvas → surface → raised → sunken`, plus `line`, `line-strong`,
`ink`, `muted`, `faint`, and `track`.

`--track` is a **per-roadmap accent** set by the `.track-frontend`,
`.track-backend`, `.track-python` scope classes (declared in
`data/*.ts` as `trackClass`) and inherited by descendants. This is an elegant
existing mechanism and the redesign should build on it rather than replace it —
it is exactly the hook needed to make the three roadmaps feel like distinct
disciplines.

### 1.6 Graph / roadmap architecture

`RoadmapGraph.vue` is the most technically involved component.

- Node positions come from the data: every `RoadmapNode` carries `col` (lane
  index, 0-based) and `row` (a **globally increasing** row index across the
  whole roadmap). `roadmap.lanes` is `3` for all three roadmaps.
- The template renders **one `<section>` per stage**, each with its own
  independent CSS grid, and remaps the global `row` to a stage-local row via
  `localRow()`.
- Connector edges are drawn in a single absolutely-positioned `<svg>` overlay
  sized to the container. Geometry is measured imperatively:
  `measure()` reads `getBoundingClientRect()` for every card (collected into
  `cardEls` via template refs) and emits cubic-Bézier `d` strings.
- `measure()` is throttled through `requestAnimationFrame` and re-run by a
  `ResizeObserver`, a `window.resize` listener, and a `watch` on
  `[roadmap.id, completedNodeIds.size]`.
- Edges are only drawn at `≥768px` (`isWide`); below that the SVG is skipped
  entirely.

Row/lane distribution measured from the data:

| Roadmap | Nodes | Stages | Row range | Lanes used |
| --- | --- | --- | --- | --- |
| frontend | 31 | 7 | 0–23 | 0,1,2 |
| backend | 32 | 5 | 0–17 | 0,1,2 |
| python | 30 | 5 | 0–15 | 0,1,2 |

Stage row bands are contiguous and occasionally share a boundary row (e.g.
backend `http` spans 3–6 and `data` spans 6–9).

### 1.7 Modal architecture

`BaseDrawer.vue` is a generic right-hand drawer used for both node briefs and
project briefs. It handles: `Teleport` to body, focus capture and restore,
`Escape` to close, a Tab focus trap over a `FOCUSABLE` selector, and
`document.body.style.overflow` locking. Content is injected via a default slot
and an optional `#footer` slot.

This behavioural core is genuinely good and must be **preserved**; only its
visual presentation and composition are in scope.

---

## 2. UI audit — why it still reads as generic

Two earlier passes changed colours, fonts, border radii and border weights, but
left the **structural** vocabulary of a SaaS dashboard untouched. Concretely:

1. **Layout model is a stack of full-width bands.** Every view is
   `mx-auto max-w-6xl px-4 py-12` with sections stacked vertically. That is the
   canonical marketing-site/dashboard skeleton; recolouring it does not change
   what it *is*.
2. **Navigation is a conventional sticky header.** Logo left, horizontal link
   row, icon buttons right, hamburger below `md`. This is the single most
   recognisable "generic web app" signature on the page.
3. **The roadmap is still a list of card grids.** Splitting the tree into one
   `<section>` per stage means it reads top-to-bottom as seven separate card
   grids, not as one branching tree. Prerequisite edges are drawn, but the
   *composition* fights them.
4. **Nodes are rectangles with a border.** Cut corners and a wax-seal badge
   were added, but the silhouette, internal layout (header strip / body /
   footer strip) and grid placement are still card-like.
5. **The detail panel is a right-hand drawer** — the single most standard
   "modern web app" disclosure pattern there is.
6. **Progress is an analytics dashboard.** A ring, a 2×3 stat tile grid, a
   contribution heatmap, a card grid of achievements. This is Vercel/GitHub
   Insights composition.
7. **Repetition.** The same bordered-panel primitive is reused for stats,
   filters, achievements, projects, resources and roadmap summaries, so every
   page has an identical texture.

**Conclusion:** the presentation layer must be rebuilt structurally, not
restyled again. The visual identity has to come from composition, geometry and
interaction — not from tokens.

---

## 3. Content inventory (immutable material)

All user-facing content is data, cleanly separated from presentation. This is
fortunate: the redesign can replace 100% of the rendering layer without
touching a single string.

| Source | Contents |
| --- | --- |
| `src/data/frontend.ts` | 31 nodes, 7 stages, roadmap prose (`tagline`, `overview`, `intro`, `difficulty`, `totalTime`) |
| `src/data/backend.ts` | 32 nodes, 5 stages, roadmap prose |
| `src/data/python.ts` | 30 nodes, 5 stages, roadmap prose |
| `src/data/projects.ts` | 58 project briefs (`blurb`, `description`, `features`, `stretch`, `stack`, `time`, `tier`) |
| `src/data/resources.ts` | 234 resources; general list + per-node lists, each with a live external `url` |
| `src/data/achievements.ts` | 20 achievements (`title`, `description`, `hint`, unlock `condition`) |
| `src/data/advice.ts` | `generalAdvice`, `nobodyTellsYou` card copy |
| `src/views/HomeView.vue` | **The long-form "docs" essay is authored inline in the template**, not in a data file |
| `src/views/NotFoundView.vue` | 404 easter egg (poke counter, fake stack trace, the "Kidhar phuss gaya yr 💀" reveal) |
| `src/components/layout/AppFooter.vue` | Footer copy + the "Top secret 🤓👉" YouTube easter egg |
| `src/main.ts` | Two joke `console.log` lines |

**Highest-risk content:** the HomeView essay and the NotFoundView easter egg
are prose living inside templates being restructured. Every paragraph must be
moved verbatim, never retyped. The footer YouTube link and all 234 resource
URLs must survive untouched.

Per-node content model: `id`, `title`, `tagline`, `description`, `why`,
`stage`, `difficulty`, `time{basics,useful,mastery?}`, `prerequisites[]`,
`skills[]`, `resources[]`, `projects?[]`, `gotchas?[]`, `optional?`, `col`,
`row`.

A baseline `md5sum` of every file in `src/data/` was captured before work
began so content integrity can be proven mechanically afterwards.

---

## 4. Technical analysis

### 4.1 Component dependencies and event flow

```
RoadmapDetailView (owns ?node= / ?project= query state)
├── RoadmapGraph        :roadmap :active-id      @select → router.push({query:{node}})
│   └── RoadmapNodeCard :node :status :active    @select → emit up
├── BaseDrawer (node)   :open :title :eyebrow    @close  → router.replace(drop query)
│   ├── NodeDetail      :node                    @open-node / @open-project
│   └── NodeProgressControls :node               → useProgress mutations
└── BaseDrawer (project)
    └── ProjectDetail   :project                 @open-node
```

`ProjectsView` reuses `BaseDrawer` + `ProjectDetail` with the same query
pattern, so any modal replacement must serve both call sites.

### 4.2 Regression risks identified

1. **Graph measurement.** `measure()` depends on template refs collected into
   `cardEls` and on the container being the offset parent. Restructuring the
   DOM will invalidate the geometry unless refs and the positioning context are
   carried across deliberately.
2. **Layout thrashing.** `measure()` reads `getBoundingClientRect()` in a loop.
   Increasing node count per canvas (by merging stages into one grid) increases
   that cost, so the rAF throttle and observer wiring must be preserved.
3. **Focus management.** `BaseDrawer`'s trap queries live DOM for focusable
   elements. A restructured panel must keep a single focus-scoped root.
4. **Body scroll lock.** Set imperatively in `BaseDrawer` *and* `CommandPalette`;
   both must clean up on unmount or the page can be left unscrollable.
5. **Query-driven panels.** Replacing the drawer with a component that owns its
   own open state would break deep links and browser back.
6. **`--track` inheritance.** The accent only works if `trackClass` stays on an
   ancestor of everything that reads `var(--track)`.
7. **Content in templates.** HomeView/NotFoundView prose must be moved, not
   rewritten.

---

## 5. Redesign strategy

### 5.1 Global composition — the artifact shell

Introduce a `GrimoireFrame` shell that gives the app a physical silhouette:
an outer cover/board, inset page margins, and a visible binding edge, so
content no longer sits flush against the viewport. Below `lg` the frame relaxes
into a compact "field manual" rather than forcing desktop geometry onto a phone.

### 5.2 Navigation — chapter tabs, not a header bar

Replace the logo-left/links-centre/icons-right header with **index tabs cut
into the edge of the book**: stamped chapter plates with the active tab
physically joined to the page below it (no bottom border). On mobile the tabs
become a horizontally scrollable strip of the same plates — the same object,
smaller — instead of a hamburger drawer.

### 5.3 Roadmap — one continuous skill tree

The core structural change. Replace *N* per-stage grids with **one continuous
CSS grid spanning the whole roadmap**:

- Compute an explicit grid row for every element in a single pass: for each
  stage, emit a full-width chapter band, then place that stage's nodes at
  `bandRow + (node.row - stageMinRow) + 1`.
- Nodes keep `gridColumn: col + 1`, so the authored lane structure — and
  therefore the branching — is preserved exactly.
- Because it is now one grid, prerequisite edges span the entire tree
  uninterrupted, and the eye can follow origin → branch → mastery.
- Stage bands become **landmarks inside the tree**, not separators between
  grids.
- Keep the existing rAF-throttled `measure()` + `ResizeObserver` approach; only
  the geometry inputs change.

Connectors get a state-aware visual language: mastered paths inked solid in the
track accent, reachable paths in ink, locked paths faint and broken.

### 5.4 Node system — plaques, not cards

`SkillNode` replaces `RoadmapNodeCard` with a plaque silhouette: a rune/seal
glyph column, an engraved title, and state carried by **material** rather than
by a coloured border — plus a non-colour secondary indicator (glyph + label) so
state never depends on hue alone.

### 5.5 Modal — a document placed on the desk

Replace the right-hand drawer with a centred **manuscript sheet**: heavy top and
bottom framing, a torn/deckled edge, corner registration marks, and a header
separated by a thick ink rule. Motion becomes a document being set down
(short travel, slight settle) rather than a slide-in drawer. All of
`BaseDrawer`'s focus-trap, escape, scroll-lock and slot API is retained so both
call sites keep working unchanged.

### 5.6 Progress — a guild ledger

Recompose the analytics dashboard as a **scribe's record**: ruled ledger rows
with right-aligned figures instead of stat tiles, and the contribution graph
redrawn as hand-inked ledger cells with visible rules and month/day gutters.
The underlying `activeDays` data and all derived numbers are untouched.

### 5.7 Typography, theme, motion, a11y, performance

- **Typography.** Cinzel (display/ceremonial), EB Garamond (body/long-form),
  Fira Code (technical/stamped). Already self-hosted in `public/fonts/`.
  The directive also asks for the Google Fonts `<link>` in `index.html`; it
  will be added as a progressive-enhancement fallback while the self-hosted
  `@font-face` rules remain the primary source, since the CDN can be blocked.
- **Theme.** Light = Ancient Tome (`#F4EFE6`/`#EAE0C8` parchment, `#2C241B`
  ink, `#C6A664` brass). Dark = Cursed Grimoire (`#1A1514` charred leather,
  `#D4C9B9` faded silver, `#8A6B32` tarnished gold) — re-authored, not inverted.
- **Motion.** Weight and friction over spring and glow; all decorative motion
  behind `prefers-reduced-motion`.
- **Accessibility.** Preserve semantics and focus order; state communicated by
  glyph + text label as well as colour; maintain contrast; keep controls
  tappable; no hover-only information.
- **Performance.** No large raster textures — ornament is CSS/SVG. Keep graph
  measurement rAF-throttled and observer-driven.

---

## 6. Preservation requirements

**Immutable:**
- Everything in `src/data/` (verified by md5 baseline).
- The HomeView essay, NotFoundView easter egg, footer copy and links,
  `main.ts` console jokes.
- Progress semantics: state machine, storage keys, legacy migration, streak
  rules, estimation maths.
- Query-driven panel model (`?node=`, `?project=`) and `scrollBehavior`.
- Backend sync behaviour and `localStorage` keys.
- `BaseDrawer`'s focus/escape/scroll-lock contract.

**Free to change:** DOM structure, component hierarchy, layout, CSS, ornament,
transitions, visual state treatment, information grouping, navigation
metaphor, node/modal/progress composition.

---

## 7. Verification strategy

1. **Build health** — `npm run build` (runs `vue-tsc --noEmit` then Vite).
2. **Content integrity** — re-run `md5sum src/data/*.ts` and diff against the
   captured baseline; expect zero changes. Grep the preserved prose (essay
   paragraphs, easter eggs, footer link) in the rebuilt templates.
3. **Runtime health** — drive the app with headless Chromium; assert
   `pageerror`/`console.error` are empty on every route.
4. **Routes** — `/`, `/roadmaps`, `/roadmaps/frontend|backend|python`,
   `/projects`, `/resources`, `/progress`, and a 404 path.
5. **Themes** — every route in both light and dark.
6. **Responsive** — desktop (1400px) and mobile (390px); assert
   `scrollWidth <= clientWidth` on `<body>` to catch horizontal overflow.
7. **Interactions** — open/close a node panel, open a project panel, toggle
   theme, mark a topic in-progress → completed → mastered and confirm the tree
   state and connectors update, open the command palette, follow a
   prerequisite link between roadmaps.
8. **Accessibility** — keyboard-only panel open/close, Escape, focus restore to
   the invoking element, visible focus rings, non-colour state indicators.
9. **Git** — commit, push `fantasy-revamp`, integrate with `main`, push `main`,
   return to `fantasy-revamp`.

Results are recorded in `FantasyChange.md`.
