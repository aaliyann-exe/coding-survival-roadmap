# Coding Survival Roadmap

An interactive roadmap of what I actually learned in ~6 months of coding, and
the order I'd learn it in if I had to start again. Three paths — Front-End,
Back-End, and Python / AI-ML — each one a dependency graph of topics with the
reasoning, a realistic time estimate, and projects attached to every step.

It's a teaching site, not a link dump: every topic answers _why should I care_,
_what do I actually need to know_, and _what do I build to prove I know it_.

> If you were sent here to learn from it: close this file. It's the boring
> half. Go to the site. **hey no spoilers !!!**

## What's in it

| | |
| --- | --- |
| Roadmaps | 3 paths, split into stages, drawn as a real prerequisite graph |
| Topics | Each with a brief, gotchas, curated resources, and time ranges |
| Projects | Tiered beginner → "why did I do this to myself", each with stretch goals |
| Resources | Docs-first, filterable by type, track, and free/paid |
| Progress | Per-topic and per-project tracking, streaks, achievements, activity graph |

Progress lives in `localStorage` first and syncs to the backend when it's
reachable, so the site keeps working offline and with no server at all.

## Stack

- **Vue 3** (`<script setup>`, Composition API) + **TypeScript**
- **Vite** for dev/build
- **Tailwind CSS**, driven by CSS custom properties so light/dark and the
  per-roadmap accent colour are all one token swap (see `src/style.css`)
- **vue-router** with lazy-loaded views
- No component library, no icon package — the ~45 icons are inline paths in
  `src/components/ui/AppIcon.vue`
- **Go + PostgreSQL** backend for progress sync (see `backend/`)

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # type-checks, then builds to dist/
npm run preview    # serve the production build
npm run typecheck  # vue-tsc, no emit
```

The frontend runs fine with no backend — it falls back to `localStorage` and
shows an "offline" hint on the login modal. To run the sync server too, see
[`backend/README.md`](backend/README.md), and copy `.env.example` to `.env` to
point the frontend at it.

## Layout

```
src/
  data/         Content. The roadmaps, projects, resources and advice live
                here as typed objects — this is the part worth editing.
    types.ts      Shape of every content object
    frontend.ts   Front-End roadmap (nodes, stages, resources)
    backend.ts    Back-End roadmap
    python.ts     Python / AI-ML roadmap
    projects.ts   Every project brief
  composables/  useProgress (the store), useTheme, useAchievements,
                useSearch (⌘K palette), useUser
  components/   roadmap/ projects/ resources/ achievements/ ui/ layout/
  views/        One per route
backend/        Go API: usernames + completed topics/projects (see CLAUDE2.md)
```

### Adding content

Topics and projects are plain objects — no CMS, no markdown pipeline. Add a
node to the relevant file in `src/data/`, give it `prerequisites` and a `stage`,
and the graph, the search index, the resource list and the progress totals all
pick it up automatically.

## Conventions

- Colour comes from `--track`, set by a `.track-frontend` / `.track-backend` /
  `.track-python` wrapper class and inherited by everything inside it. Don't
  hardcode accent colours in components.
- Surfaces are layered `canvas → surface → raised → sunken`. Borders are
  `line` / `line-strong`. Text is `ink` / `muted` / `faint`.
- Everything animated is guarded by `prefers-reduced-motion`.

## Notes

`CLAUDE1.md`, `CLAUDE2.md`, `CLAUDE3.md` and `DEPLOYMENT.md` are the working
briefs for the frontend, the backend, later revisions, and deployment.
