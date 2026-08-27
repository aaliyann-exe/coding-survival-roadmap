# Deployment Guide

This walks through taking the roadmap site from "runs on my machine" to
"works from any browser, for the ~4-5 people using it, for free." It assumes
no prior deployment experience.

The final shape:

```text
        Browser
           │
           ▼
  Frontend (static site) ──── Vercel / Netlify, free
           │  HTTPS
           ▼
  Go API (backend/) ───────── Render, free
           │
           ▼
  PostgreSQL ───────────────── Neon, free
```

Why these three specifically: Render's own free PostgreSQL **expires after
30 days** and gets deleted, which fails the one hard requirement of this
project (progress must persist indefinitely) — so the database lives on
Neon instead, and Render is used only for the stateless Go process, which is
fine to lose and recreate. Neon's free tier is a fixed 0.5 GB / one project
with no time limit — plenty for 4-5 users and ~150 roadmap items. All of
this can change over time; if you're doing this months from now, skim each
provider's current free-tier page before signing up.

---

## 1. Create the PostgreSQL database (Neon)

1. Go to [neon.com](https://neon.com) and sign up (GitHub login is fastest).
2. Create a new project — any name/region is fine.
3. Neon gives you a connection string that looks like:
   ```
   postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
   ```
   Copy it. This is your production `DATABASE_URL`.
4. Optional but recommended: create a **second** Neon project (or a branch
   off the first) to use as your local development database, so you're
   never developing against production data. Copy its connection string
   too — that's your local `DATABASE_URL`.

Keep both connection strings somewhere private. Never commit them.

## 2. Run the backend locally against it (sanity check before deploying)

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your **development** connection
string from step 1. Then:

```bash
go run .
```

You should see `roadmap-backend listening on :8080 ...`. Visit
`http://localhost:8080/api/health` — it should return
`{"ok":true,"database":"ok"}`. The schema (two tables) is created
automatically on first connect.

## 3. Deploy the backend (Render)

1. Push this repo to GitHub if it isn't already there.
2. Go to [render.com](https://render.com) and sign up.
3. **New > Blueprint**, connect the repo, and point it at
   `backend/render.yaml`. (Alternatively: **New > Web Service**, connect the
   repo, set the root directory to `backend`, and let Render detect
   `Dockerfile`.)
4. Render will ask for the environment variables marked `sync: false` in
   `render.yaml`:
   - `DATABASE_URL` — your **production** Neon connection string from step 1.
   - `ALLOW_ORIGIN` — leave a placeholder like `http://localhost:5173` for
     now; you'll update it in step 5 once you know your frontend's real URL.
5. Deploy. Render assigns a public URL like
   `https://roadmap-backend-xxxx.onrender.com`.
6. Visit `https://<your-service>.onrender.com/api/health` and confirm it
   returns `{"ok":true,"database":"ok"}`.

Note: Render's free web services spin down after 15 minutes of no traffic
and take a few seconds to wake back up on the next request. For a personal
project with a handful of users, that's a fine trade for $0/month — just
expect an occasional slow first request.

## 4. Deploy the frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign up, then **Add New >
   Project**, and import this repo.
2. Vercel auto-detects Vite; the default build command
   (`vue-tsc --noEmit && vite build`, from `package.json`) and output
   directory (`dist`) both work as-is.
3. Before deploying, add an environment variable:
   - `VITE_API_URL` = your Render backend URL from step 3
     (e.g. `https://roadmap-backend-xxxx.onrender.com`).
4. Deploy. Vercel gives you a public URL like
   `https://your-project.vercel.app`.

(Netlify or Cloudflare Pages work the same way if you'd rather use those —
same build command, same single environment variable.)

## 5. Wire up CORS

Go back to Render, open the backend service's environment variables, and set
`ALLOW_ORIGIN` to your actual deployed frontend URL from step 4
(`https://your-project.vercel.app`, no trailing slash). Save — Render
redeploys automatically. Without this step, the browser will block every
request from the deployed frontend with a CORS error.

## 6. Test the whole thing end-to-end

- Visit your Vercel URL. The login modal should appear.
- Enter a username (e.g. `aaliyan`), complete a task and a project, refresh
  the page — they should still be marked complete.
- Open the site in a different browser (or an incognito window) and log in
  with a **different** username. You should not see the first user's
  progress.
- Switch back to the first browser/username and refresh again — their
  progress should still be there, untouched by the second user.
- If anything looks off, check the Render service logs (Render dashboard >
  your service > Logs) — every request is logged with its method, path, and
  timing.

If this all works, the data is genuinely persisted remotely rather than
just sitting in one browser's local storage.

## Local development

Local development targets a separate (Neon) database from production —
never point your local `.env` at the production `DATABASE_URL`. Day to day:

```bash
# terminal 1
cd backend && go run .

# terminal 2
npm run dev
```

The frontend's `.env.local` (if you need one — copy `.env.example`) can
leave `VITE_API_URL` unset; it already defaults to `http://localhost:8080`.

## Running the backend's tests

The tests need a real, disposable PostgreSQL database — they `TRUNCATE` it
before every test, so never point this at anything you care about:

```bash
cd backend
TEST_DATABASE_URL=postgresql://... go test ./...
```

Without `TEST_DATABASE_URL` set, the tests skip cleanly rather than
failing — useful in CI or sandboxed environments with no database at hand.
