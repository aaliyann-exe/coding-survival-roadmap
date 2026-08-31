# Coding Survival Roadmap 📖

A website that pretends to be a cursed spellbook, but is actually just
someone's notes on "how I taught myself to code in 6 months" turned into a
map you can click through.

> If you were sent here to learn from it: close this file. It's the boring
> half. Go to the site. **hey no spoilers !!!**

## Okay but what IS it

You open the site, it looks like a big old book. The pages *turn* when you
click a chapter. There's a little glowing magic circle that flashes while
it turns. This is deeply unnecessary and we regret nothing.

Inside the book:

- 🖥️ **Three roadmaps** — Front-End, Back-End, and Python/AI. Each one is a
  big graph of topics connected like a skill tree, so you always know
  what to learn next and what it needs first.
- 🧪 **Projects** — from "cute little thing" to "why did I do this to
  myself," attached to the topics that unlock them.
- 📚 **Resources** — the actual good docs/courses/videos, not a 400-tab
  homework dump.
- 🔥 **Progress tracking** — check things off, keep a streak, unlock
  achievements. It's basically a to-do list cosplaying as an RPG.

No sign-up, no password. Type any name and it just remembers you (on your
device). Progress is saved right in your browser, so the site works fine
with zero internet and zero backend. If the little Go server *is* up, it
quietly backs your progress up too. If it's not, nothing breaks — the book
doesn't care.

## Running it yourself

```bash
npm install
npm run dev        # http://localhost:5173
```

That's it. That's the whole website, offline, no backend needed.

If you also want the optional sync server (so progress follows you across
devices), see [`backend/README.md`](backend/README.md) — it's a tiny Go +
Postgres API. Copy `.env.example` to `.env` to point the site at it.

## Made of

Vue 3 + TypeScript + Vite + Tailwind on the front, a small Go + PostgreSQL
API on the back, and an unreasonable number of `<svg>` sigils that someone
drew by hand instead of sleeping.

## Want the actual deep-dive?

See [`About.md`](About.md) — it explains every gear turning under the
leather cover, for whoever (probably future-me) needs to remember how any
of this works.
