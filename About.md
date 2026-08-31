# About — Coding Survival Roadmap

Technical reference for the project: what it is, how it's built, why the
pieces are shaped the way they are. Written to be read cold, without the
session history that produced it. If a claim here ever disagrees with the
code, the code is right — this file describes the state as of the
`fantasy-revamp` branch and should be re-verified against source before
being trusted blindly.

## 1. What the project actually is

A single-page Vue 3 application that presents a personal "how I learned to
code" roadmap as three dependency graphs (Front-End, Back-End, Python/AI),
each broken into topics with prerequisites, curated resources, time
estimates and attached projects. Progress is tracked per-topic (three
states: in-progress / completed / mastered) and per-project (done/not
done), with streaks and unlockable achievements layered on top.

The entire UI is skinned as a physical grimoire — a book sitting on a desk,
with cover boards, page edges, ribbon bookmarks, a page-turn animation and
an "arcane seal" loading flourish — rather than as a conventional web page
with a navbar. This is the defining design constraint of the frontend: see
§5.

The site is **offline-first**. All state lives in `localStorage`; a Go +
PostgreSQL backend exists purely as an optional sync layer so the same
person can see their progress on a second device. Every network call fails
soft — a missing, slow, or errroring backend never blocks or breaks the UI.

## 2. Stack

**Frontend**
- Vue 3, `<script setup>`, Composition API — no Options API anywhere
- TypeScript throughout, including all content data
- Vite for dev server and build (`vue-tsc --noEmit` gates the build)
- Tailwind CSS, but almost all real color/spacing decisions are pushed into
  CSS custom properties (`src/style.css`) rather than Tailwind's default
  palette — Tailwind here is mostly a utility-class layout tool
- `vue-router` (history mode), all views lazy-loaded except `HomeView`
- No component library. No icon package — every icon is a hand-written SVG
  path in `src/components/ui/AppIcon.vue`
- No state management library — plain module-level `reactive`/`ref` state
  in composables (see §4) doubles as the store

**Backend** (`backend/`)
- Go (module `roadmap-backend`), standard library `net/http` with Go 1.22+
  method+pattern routing (`GET /api/health`, etc.) — no web framework
- PostgreSQL via `pgx` (`database/sql` driver, not the native pgx API)
- No ORM, no query builder — hand-written SQL in `internal/store`
- No migration framework — two tables created with `CREATE TABLE IF NOT
  EXISTS` on startup (`internal/database/database.go`)

**Deployment target** (see `DEPLOYMENT.md`): static frontend on
Vercel/Netlify, the Go API on Render, Postgres on Neon — chosen specifically
because Neon's free tier doesn't expire, unlike Render's free Postgres
(30-day auto-delete), and this project's one hard requirement is that
progress persists indefinitely.

## 3. Repository layout

```
src/
  data/           Content, as plain typed objects. This is the part meant
                  to be hand-edited to add topics/projects/resources.
    types.ts        Shape of every content object (Roadmap, RoadmapNode,
                    Project, Resource, Achievement, SearchHit, ...)
    frontend.ts     Front-End roadmap: ~39 nodes
    backend.ts      Back-End roadmap: ~40 nodes
    python.ts       Python / AI-ML roadmap: ~37 nodes
    roadmaps.ts     Aggregates the three roadmaps; builds a global node
                    index (`nodeIndex`) keyed by node id, since ids must be
                    globally unique across all three roadmaps
    projects.ts     ~58 project briefs (tiers: beginner/intermediate/
                    advanced/"pain")
    resources.ts    ~19 general curated resources (topics also carry their
                    own inline `resources[]`)
    achievements.ts 20 achievements, each a pure predicate over progress
    advice.ts       Freeform advice/gotcha copy shown on the home page

  composables/    All app state and cross-cutting behaviour lives here as
                  singleton composables (module-scoped state, not per-call)
    useProgress.ts    The store. localStorage persistence, backend sync,
                      derived stats (streaks, percent complete, skill
                      level, "next up" suggestion)
    useUser.ts        Username-only identity (see §6)
    useAchievements.ts  Watches progress, unlocks/queues achievement toasts
    useTheme.ts       Light/dark mode, system-preference aware
    useBookTurn.ts    Drives the page-turn animation independent of routing
    useSearch.ts      Builds the ⌘K command-palette search index
    useMotion.ts      Shared motion/reduced-motion helpers

  components/
    book/           TomeShell (page frame), BookSpread (two-page layout),
                    BookmarkRail (ribbon nav)
    arcane/         ArcaneSeal (casting animation), ArcaneSigil + sigils.ts
                    (deterministic per-content symbol system), CelestialField
                    (generated starfield background for the skill tree)
    roadmap/        SkillTree, SkillNode, NodeDetail, NodeProgressControls
    projects/       ProjectCard, ProjectDetail
    resources/      ResourceCard
    achievements/   AchievementCard, AchievementToast
    search/         CommandPalette
    auth/           LoginModal
    layout/         AppFooter, ClosingQuote
    ui/             AppIcon, ManuscriptModal, ProgressBar, ProgressRing

  views/          One component per route (HomeView, RoadmapsView,
                  RoadmapDetailView, ProjectsView, ResourcesView,
                  ProgressView, NotFoundView)

  lib/api.ts      Thin fetch client for the backend; every function
                  resolves to `null` on any failure instead of throwing
  router/index.ts vue-router setup + per-route document titles
  style.css       Design tokens (see §5) + global styles
  main.ts         App bootstrap

backend/
  main.go                    wiring: config → db → store → handlers → mux
  internal/config/           env var loading (.env support)
  internal/database/         Postgres connection + inline schema
  internal/store/            all SQL
  internal/handlers/         HTTP handlers, CORS + logging middleware
  internal/models/           shared types + input validation
```

Historical working documents (`CLAUDE1.md`, `CLAUDE2.md`, `CLAUDE3.md`,
`DEPLOYMENT.md`, `Analysis.md`, `FantasyChange.md`, `Revamp*.md`,
`report.md`, `Features.md`) are design briefs and progress notes from
earlier passes over this project. They're historical record, not
necessarily an accurate description of the current code — this file is the
one meant to stay current.

## 4. State management

There is no Pinia/Vuex. Each composable module keeps its state as a
module-level `reactive`/`ref`, calls its own `load()`/`init()` guarded by an
`initialised` flag, and every component that calls the composable shares the
same singleton state. This works because the app is small enough that a
handful of these singletons cover everything, and it avoids a store
boilerplate layer entirely.

### `useProgress` — the core store

- Two localStorage keys: `roadmap-progress-v2` (current) and
  `roadmap-completed-steps` (legacy, from the pre-revamp site — migrated
  once by matching topic *titles*, since some old titles still map to
  current node ids).
- State shape: `{ topics: Record<id, TopicState>, projects: Record<id,
  true>, activeDays: string[] }`. `activeDays` is a capped (400 entries)
  append-only log of ISO dates used to compute streaks.
- A node's displayed status (`locked`/`available`/`in-progress`/
  `completed`/`mastered`) is *derived*, not stored directly for the locked/
  available cases: it's computed from `prerequisites.every(p =>
  completed.has(p))`. Only in-progress/completed/mastered are explicit.
- `deep: true` watcher writes the whole state to localStorage on every
  change; failures (private-mode storage, quota) are swallowed silently —
  persistence is best-effort by design.
- On login/user-switch, `hydrateFromServer()` overwrites local state with
  whatever the backend returns for that username; a failed fetch leaves
  local state untouched. On logout, state is wiped so the next person's
  login doesn't briefly show the previous user's progress.
- Every mutation (`setTopic`, `toggleProject`) updates local state
  synchronously, then fires an async, best-effort push to the backend
  (`syncTopic`/`syncProject`) — the UI never waits on the network.
- Derived stats exposed: `overallPercent`, `perRoadmap` (per-roadmap
  completion + project counts), `streak`/`longestStreak` (streak survives a
  1-day gap so you don't lose it mid-day), `estimatedHours` (parsed from
  each node's human-readable time range, assuming ~1.5 focused hours/day),
  `skillLevel` (a joke tier label from "Not started" to "Reads the docs for
  fun"), and `nextUp` (best-guess next topic: prefers an in-progress topic,
  else the earliest available, non-optional topic in a roadmap you've
  already started).

### `useUser` — identity, not authentication

Deliberately not a real auth system. A username is a free-text local label
so a handful of people sharing the same deployed site each see their own
progress — there is no password, and setting a username always "succeeds"
locally even if the backend is unreachable. This is intentional (see
`CLAUDE2.md` for the original reasoning) and should not be "fixed" into a
real login system without that being an explicit decision.

### `useAchievements`

Achievements are pure predicates (`(ctx: AchievementContext) => boolean`)
evaluated reactively against progress. A `seen` list in localStorage
(`roadmap-achievements-seen`) prevents already-unlocked achievements from
re-firing toasts on page load; only newly-crossed achievements are queued
for the toast UI.

### `useBookTurn`

Coordinates the page-turn animation *independent of routing* — the router
navigation is never blocked or delayed by the animation (an earlier design
that gated navigation in a `beforeEach` guard broke back/forward and direct
URLs, per the code comment in `useBookTurn.ts`). Instead:
- The route changes immediately.
- A `watch` on the route's "chapter" (first path segment, via `chapterOf`)
  triggers `start()`, which flips `phase` to `"turning"` for a duration
  matched to the CSS animations (~2060ms normally, ~950ms under
  `prefers-reduced-motion`, where the leaf graphic is skipped entirely and
  only the seal flashes).
- Only *chapter* changes turn a page — opening a topic drawer just adds a
  `?node=` query param to the same route, which correctly does not trigger
  a turn.

## 5. Design system — "the tome"

The visual language is built around one governing idea, stated directly in
`TomeShell.vue`'s own comments: *the viewport holds a book on a desk, not a
page*. Concretely this means the desk is visible on all four sides, the
leather cover shows as a margin, page edges show paper thickness, and a
real gutter splits left/right content — as opposed to a max-width column
with a border that "would still just be a web page no matter what colour
it's painted."

**Tokens** (`src/style.css`, `@layer base`): two palettes sharing one
naming scheme — light is the "Ancient Tome" (parchment `--canvas`, brass
`--line-strong`, deep-brown `--ink`), dark is the "Cursed Grimoire" (the
same tome after fire and age). Surfaces layer `board → canvas → surface →
raised → sunken` from outer cover to an inset well; borders are `line` /
`line-strong`; text is `ink` / `muted` / `faint`. Status colors are named
in-world: `--gild` (aged gold, in-progress), `--seal` (druid green,
mastered), `--wax` (crimson, danger/locked).

**Per-roadmap accent**: a single `--track` custom property, set once by a
wrapper class (`.track-frontend` / `.track-backend` / `.track-python`) and
inherited by everything inside it. Components never hardcode an accent
color — this is a hard convention (see §9).

**Typography**: self-hosted variable fonts (Cinzel for display, EB Garamond
for body/serif, Fira Code for mono), loaded via `@font-face` with local
`woff2` files as the primary source and a Google Fonts `<link>` in
`index.html` as a fallback — done this way because network-blocked CDNs
silently fall back to a system serif with an `@import`-only setup. A few
"demo" display faces (Transcity, Kugile, Kultum Ramadhan) are declared for
flourish text like the epigraph.

**Physical UI pieces**:
- `TomeShell.vue` — the outer frame: desk → cover boards → page edges →
  page block → the turn layer. `perspective` is set on the page block so
  the turning leaf can hinge in 3D; the casting seal is deliberately
  rendered *outside* that element and pinned with `position: fixed`,
  because an ancestor with `perspective` becomes the containing block for
  fixed descendants, which previously made the seal scroll away with the
  page instead of staying centered on the viewport.
- `BookmarkRail.vue` — chapter navigation as ribbon bookmarks at fixed,
  hand-picked insertion depths (not random, so the layout is stable across
  visits) rather than an evenly-spaced tab bar, specifically to avoid
  reading as a navbar in a different paint job.
- `ArcaneSeal.vue` + `ArcaneSigil.vue` / `sigils.ts` — the loading
  flourish shown while a page turns: concentric rules, a counter-rotating
  rune ring, cardinal elemental sigils (fire/water/earth/air), all drawn
  from SVG geometry rather than a single spinning arc. Which sigil
  represents a given piece of content is deterministic: an FNV-1a hash of
  its id picks consistently from a 9-symbol alphabet (`fire`, `water`,
  `earth`, `air`, `arcane`, `celestial`, `void`, `nature`, `knowledge`), so
  the same node always draws the same symbol.
- `CelestialField.vue` — the starfield behind the skill-tree graph.
  Generated once from a seeded PRNG (mulberry32) and rendered as SVG so the
  sky is identical on every render (an unseeded RNG would reshuffle stars
  on every reactive update) and so a few hundred stars cost far less than
  the same count of animated DOM elements.

Everything animated is guarded by `prefers-reduced-motion` throughout —
this is treated as a hard requirement, not a nice-to-have, and shows up in
`useBookTurn`, the seal, and the leaf-turn CSS animations alike.

## 6. Content model

All roadmap content is plain typed data (`src/data/types.ts`), no CMS, no
markdown pipeline. A `RoadmapNode` carries: `tagline` (card summary),
`description` (drawer detail), `why` (motivation), `stage`, `difficulty`,
a three-number `TimeEstimate` (`basics` / `useful` / `mastery` — described
in the type comment as "three honest numbers instead of one dishonest
one"), `prerequisites` (also used to draw the dependency-graph edges),
`skills`, `resources`, optional linked `projects`, optional `gotchas`, and
graph position (`col`/`row`) for layout. Adding a new topic is: add an
object to the relevant `src/data/*.ts` file with a `stage` and
`prerequisites` — the graph, the search index, the resource list and every
progress total pick it up automatically with no other wiring.

## 7. Backend

A deliberately minimal Go REST API (`backend/`) whose only job is: given a
username, remember which task/project ids are done.

**Schema** — two tables, `users` (id, username, created_at) and `progress`
(user_id, item_type, item_id, status, updated_at), with a `UNIQUE(user_id,
item_type, item_id)` constraint so re-marking the same item updates one row
rather than duplicating it. Applied via `CREATE TABLE IF NOT EXISTS` on
every startup — there is no migration tool because there has never been a
need for one yet.

**Endpoints**:
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | liveness + DB ping |
| POST | `/api/users` | create-or-return a user by username |
| GET | `/api/users/{username}/progress` | fetch a user's `{tasks, projects}` |
| PUT | `/api/users/{username}/progress` | upsert one task or project's status |

`PUT` accepts either `{"status": "in-progress"|"completed"|"mastered"}` for
a task, or `{"completed": true|false}` for a project — validated in
`internal/models` with an explicit regex allow-list for both usernames
(`^[a-zA-Z0-9 _-]{1,32}$`) and item ids (`^[a-zA-Z0-9_-]{1,100}$}`), so
malformed input is rejected before it ever reaches SQL.

**Connection handling**: pool capped at 5 open / 2 idle connections with a
5-minute max lifetime — sized deliberately small because free-tier hosted
Postgres (Neon et al.) caps concurrent connections and this backend serves
a handful of users, not a real audience.

**Frontend↔backend contract** (`src/lib/api.ts`): every request has a
5-second timeout via `AbortController`; any non-2xx response, timeout, or
network error resolves to `null` rather than throwing. A refused connection
(nothing listening) flips a module-level `reachable` flag to `false` for
the rest of the session, so a missing backend costs exactly one failed
request rather than one per navigation. `VITE_API_URL` configures the
target explicitly; with nothing configured, dev mode falls back to
`http://localhost:8080` for convenience, but a production build with no
env var set simply runs sync-off from localStorage — it deliberately does
**not** default to `localhost` in production, since that previously made
every visitor's browser try to open a connection to their own machine.

## 8. Routing

Standard `vue-router` history-mode setup (`src/router/index.ts`), all views
lazy-loaded except `HomeView`. Per-route `document.title` is set in
`router.afterEach` (not a navigation guard) so the tab title only changes
once the new page is actually showing; the roadmap detail route derives its
title from the roadmap's own data rather than a static table. Scroll
position is restored on browser back/forward and reset to top on a real
page change, but explicitly *not* reset when only the query string changes
(`?node=`) — that's a drawer opening, not a navigation.

## 9. Conventions worth preserving

- **Never hardcode an accent color.** Always go through `--track`, set by
  a `.track-*` wrapper.
- **Surfaces are layered**, always `canvas → surface → raised → sunken`;
  don't invent a new surface level ad hoc.
- **Every animation respects `prefers-reduced-motion`.**
- **Every network call in `lib/api.ts` fails soft.** Nothing in the UI
  should ever await a backend call in a way that can hang or throw.
- **Content is data, not markup.** New topics/projects/resources are
  objects in `src/data/`, not new template code.
- Progress and identity are both **localStorage-first**; the backend is
  strictly an optional sync convenience, never a hard dependency.

## 10. Known easter eggs

- The 404 page's "404" label is clickable; five clicks produces a confession
  message, with escalating hints along the way, plus a fake stack trace
  panel showing the attempted route.
- The footer's old "TOP SECRET" link survived the footer rewrite as a
  rickroll, now reading "Top secret 🤓👉".
- The home page has a "6-7" that bobs on hover.

These are intentional and documented in `Features.md`/`stuff-to-add.md` —
don't clean them up as if they were leftover debug code.
