# roadmap-backend

A very small Go REST API that persists which roadmap tasks/projects a user
has completed. There are no passwords — a username is just an identifier so
a handful of people sharing this site each see their own progress, nothing
more. See `../CLAUDE2.md` for the original design brief and `../CLAUDE3.md`
for why this talks to PostgreSQL instead of a local SQLite file.

## Requirements

- Go 1.26+
- A PostgreSQL database (see [DEPLOYMENT.md](../DEPLOYMENT.md) for a free
  hosted option — Neon works well and doesn't expire like Render's free
  Postgres does)

## Running locally

```bash
cd backend
cp .env.example .env
# edit .env: set DATABASE_URL to a real (ideally throwaway/dev) Postgres
# connection string
go run .
```

The server listens on `:8080` by default (`PORT` in `.env` to change it) and
applies its schema automatically on startup — there's no separate migration
step to run.

## Configuration

All configuration is environment variables, optionally loaded from a local
`.env` file (see `.env.example`):

| Variable       | Required | Default                 | Meaning                                              |
| -------------- | -------- | ------------------------ | ----------------------------------------------------- |
| `DATABASE_URL` | yes      | —                         | PostgreSQL connection string                          |
| `PORT`         | no       | `8080`                    | Port the server listens on                             |
| `ALLOW_ORIGIN` | no       | `http://localhost:5173`  | Browser origin allowed to call this API (CORS)         |

## API

| Method | Path                            | Purpose                                    |
| ------ | -------------------------------- | ------------------------------------------- |
| GET    | `/api/health`                    | Health check (also pings the database)      |
| POST   | `/api/users`                     | Create a user, or return the existing one   |
| GET    | `/api/users/{username}/progress` | Get a user's completed tasks/projects       |
| PUT    | `/api/users/{username}/progress` | Mark/unmark a task or project                |

`PUT` accepts either `{"status": "in-progress" \| "completed" \| "mastered"}`
(for the three-state topics the frontend tracks) or the simpler
`{"completed": true \| false}` (all a project needs). See
`internal/handlers/handlers.go` for the exact request/response shapes.

## How the data is stored

Two tables — `users` and `progress` — created automatically on startup (see
`internal/database/database.go`). `progress` has a `UNIQUE (user_id,
item_type, item_id)` constraint, so marking the same task twice just updates
one row instead of creating duplicates.

## Tests

Tests need a real (throwaway) PostgreSQL database — set `TEST_DATABASE_URL`
before running them, or they skip automatically:

```bash
TEST_DATABASE_URL=postgresql://user:pass@host:5432/roadmap_test go test ./...
```

Each test truncates that database before it runs, so point it at something
you don't mind being wiped repeatedly — never at your real dev or production
database.

## Project layout

```text
backend/
├── main.go                     wires everything together and starts the server
├── internal/config/            env var loading
├── internal/database/          Postgres connection + schema
├── internal/store/             all SQL lives here
├── internal/handlers/          HTTP handlers + CORS/logging middleware
└── internal/models/            shared types and input validation
```

## Deploying

See [DEPLOYMENT.md](../DEPLOYMENT.md) for the full guide to getting this
running publicly for free (Neon for the database, Render for the API).
