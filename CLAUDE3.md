# CLAUDE3.md — Remote Backend & Deployment

## Context

The previous instructions in `CLAUDE2.md` have now been implemented.

The Go backend currently works locally and uses SQLite/local persistence.

I now want to make the entire project **fully online and remote**.

The goal is:

```text
User's Browser
      ↓
Online Frontend
      ↓
Online Go REST API
      ↓
Remote PostgreSQL Database
```

The user's computer should NOT need to run the Go server, SQLite database, or anything else.

The website should work for the small group of users from anywhere.

This is still a small personal project with roughly 4–5 realistic users, so keep everything simple and inexpensive/free.

---

# IMPORTANT: Inspect Before Changing

Before making changes:

1. Read `CLAUDE1.md`.
2. Read `CLAUDE2.md`.
3. Inspect everything that was implemented from `CLAUDE2.md`.
4. Understand the current Go backend.
5. Understand the current frontend → backend communication.
6. Understand the current SQLite schema and database operations.

Do NOT rebuild the application from scratch.

Do NOT unnecessarily change the frontend.

The existing implementation should be preserved wherever possible.

---

# Main Goal

Convert the current local backend into a remotely deployable backend.

Current:

```text
Frontend
   ↓
Go API
   ↓
Local SQLite file
```

Desired:

```text
Frontend
   ↓ HTTPS
Deployed Go API
   ↓
Remote PostgreSQL
```

The final application should be usable entirely through the public website.

---

# Database

Replace the local SQLite persistence with **PostgreSQL**.

The PostgreSQL database must be remotely hosted.

Do NOT store the production database inside the Go application's filesystem.

Do NOT depend on a local `.db` file for production.

The application should use a PostgreSQL connection string supplied through an environment variable, for example:

```text
DATABASE_URL
```

Never hardcode database credentials.

Never commit database credentials to Git.

---

# Database Migration

Inspect the existing SQLite schema and preserve the existing data model.

If the current database contains:

- users
- progress
- task/project completion

then create the equivalent PostgreSQL tables.

Preserve:

- username uniqueness
- user IDs
- task/project IDs
- completion state
- timestamps
- appropriate constraints/indexes

Use PostgreSQL-appropriate types and SQL.

Do not introduce unnecessary tables.

---

# Go Backend

Modify the existing Go backend so that it connects to PostgreSQL using `DATABASE_URL`.

The API behavior should remain essentially the same as the current implementation.

Existing endpoints should continue to work unless there is a strong reason to change them.

The backend should:

- Connect to PostgreSQL on startup.
- Fail clearly if `DATABASE_URL` is missing/invalid.
- Use parameterized queries.
- Properly close database connections/resources.
- Handle database errors gracefully.
- Continue returning JSON responses.

Do not introduce a large backend framework.

Keep the existing simple Go architecture.

---

# Configuration

The application must support environment-based configuration.

At minimum:

```text
DATABASE_URL
PORT
```

If the existing implementation has other configuration values that should be environment variables, handle those appropriately.

For local development, provide a `.env.example` or equivalent documentation.

Example:

```text
DATABASE_URL=postgresql://...
PORT=8080
```

Do NOT put real credentials in `.env.example`.

Make sure `.gitignore` prevents real `.env` files from being committed.

---

# CORS

The frontend and backend will be hosted separately.

Configure CORS so that the deployed frontend can communicate with the deployed Go API.

Do not use a permanently open wildcard CORS policy unless there is a genuine reason.

Make the allowed frontend origin configurable through an environment variable if appropriate.

For example:

```text
FRONTEND_URL=https://example.com
```

During local development, localhost should still work.

---

# Frontend

The frontend currently communicates with the Go API.

Change it so that the API base URL is configurable.

Do NOT hardcode:

```text
http://localhost:8080
```

throughout the application.

Instead, use an environment variable appropriate for the frontend framework.

For example:

```text
VITE_API_URL=https://your-api-domain.com
```

Use the actual environment-variable convention of the existing frontend framework.

The development environment should still be able to use:

```text
http://localhost:8080
```

while production uses the deployed API URL.

Do not alter the UI/design unless necessary.

---

# Deployment Target

Prepare the Go backend for deployment on a free hosting service such as **Render** or another suitable free service that supports Go.

Before selecting a provider, verify the provider's current free-tier limitations.

Important:

The backend's filesystem must be treated as ephemeral.

The production application must NOT depend on local files for persistent user data.

The PostgreSQL database must be the source of truth.

Create whatever deployment configuration is appropriate, such as:

- `render.yaml`
- Dockerfile
- build/start commands
- health endpoint

Only add files that are actually useful.

---

# Health Endpoint

Add a simple health endpoint if one does not already exist:

```text
GET /health
```

It should return a simple successful JSON response when the API is running.

If practical, distinguish between:

- API is running
- API cannot reach the database

Keep it simple.

This endpoint will be useful for deployment/testing.

---

# Production Behavior

Make sure the Go server listens on the port supplied by the hosting provider.

Do NOT assume:

```text
localhost:8080
```

in production.

Use:

```text
PORT
```

with a sensible local default such as `8080`.

The server must listen on the appropriate host/interface for cloud deployment.

---

# Free Hosting

The project should be designed to cost $0 for the expected usage.

However, do NOT compromise data persistence just to use a particular free service.

In particular:

**Do not use a hosting provider's ephemeral filesystem as the database.**

The database must remain persistent independently of the Go server.

If the initially suggested hosting/database combination has a free-tier limitation that makes it unsuitable for permanent data, identify that clearly and use a better free remote database option.

Do not assume pricing/free-tier terms without checking them.

---

# Security

This is still a username-only personal application.

Do NOT add:

- passwords
- OAuth
- JWT
- refresh tokens
- email verification
- complicated authentication

The username remains an identifier rather than secure authentication.

However:

- Validate usernames.
- Validate request bodies.
- Use parameterized SQL.
- Don't expose database credentials.
- Don't expose environment variables.
- Don't expose unnecessary server information.
- Configure CORS properly.

---

# Deployment Documentation

Create a concise deployment guide, for example:

```text
DEPLOYMENT.md
```

It should explain exactly how to deploy this project from a fresh machine/account.

Include:

1. Create the remote PostgreSQL database.
2. Obtain the database connection string.
3. Configure environment variables.
4. Deploy the Go backend.
5. Deploy the frontend.
6. Configure the frontend API URL.
7. Configure CORS.
8. Test the `/health` endpoint.
9. Test creating/logging in as a user.
10. Test task/project completion.
11. Test persistence after refreshing.
12. Test from another device/browser.

Do not assume the reader already knows how deployment works.

---

# Data Persistence Test

After deployment, verify this exact flow:

### Browser A

Login as:

```text
aaliyan
```

Complete:

```text
task-1
task-2
project-1
```

Refresh.

The completed items should remain.

### Browser B

Login as another username.

The second user should NOT see Aaliyan's completed items.

Complete different items.

### Browser A

Refresh again.

Aaliyan's original progress should still be there.

This proves that the data is actually stored remotely rather than only in browser state.

---

# Local Development Must Still Work

Do not break local development.

There should be a clear distinction between:

### Development

```text
Frontend localhost
      ↓
Go localhost
      ↓
Development PostgreSQL
```

and:

### Production

```text
Public frontend
      ↓
Public Go API
      ↓
Production PostgreSQL
```

If practical, use separate development and production databases.

Do not accidentally point local development at production data.

---

# Git

Make sure sensitive files are not committed.

Check:

```text
.gitignore
```

and ensure things like:

```text
.env
.env.*
```

are appropriately ignored, while `.env.example` remains committed.

Do not commit:

- database passwords
- connection strings containing passwords
- API secrets
- private keys

---

# Final Cleanup

After implementation:

- Remove obsolete SQLite production code.
- Remove unnecessary dependencies.
- Remove hardcoded localhost API URLs.
- Remove debug logging.
- Keep useful error logging.
- Make sure the project builds cleanly.
- Make sure the Go backend starts correctly.
- Make sure the frontend builds correctly.

Do not delete useful local-development functionality.

---

# What I Want You To Do

Work in this order:

## 1. Inspect

Understand the implementation from `CLAUDE2.md`.

## 2. Audit

Identify everything that currently assumes:

- SQLite
- local filesystem persistence
- localhost
- local-only API
- development-only configuration

## 3. Plan

Give a short plan before making major changes.

## 4. Implement

Convert the backend to remote PostgreSQL and make it deployment-ready.

## 5. Configure

Make frontend/backend URLs and database configuration environment-based.

## 6. Test

Test local development first.

Then verify the production build/deployment configuration.

## 7. Document

Create/update `DEPLOYMENT.md` with exact deployment steps.

---

# Important Philosophy

This is a tiny personal project.

The final architecture should be approximately:

```text
                 INTERNET
                    │
                    ▼
          ┌──────────────────┐
          │     Frontend     │
          │   Static Site    │
          └────────┬─────────┘
                   │ HTTPS
                   ▼
          ┌──────────────────┐
          │    Go REST API   │
          │   Cloud Hosted   │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ Remote PostgreSQL│
          │    Persistent    │
          └──────────────────┘
```

Keep it boring, small, understandable, and cheap.

The most important requirement is:

**The user's progress must be stored remotely and persist independently of the user's browser and independently of the Go server's filesystem.**
