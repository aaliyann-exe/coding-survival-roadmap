# CLAUDE2.md — Backend Instructions

## Context

This project is a personal coding roadmap website.

The frontend has already been built and is documented in `CLAUDE1.md`. **Read `CLAUDE1.md` and inspect the existing codebase before making any backend changes.** The backend should integrate cleanly with the existing frontend rather than changing or rebuilding the frontend unnecessarily.

The roadmap currently contains:

- 93 tasks
- 58 projects
- Around 10–12 potential users, realistically around 4–5
- Each task/project is essentially a completion toggle/button
- The important persistent data is whether each user has completed each task/project

I want a **very simple Go backend** for persistence.

This is a small personal project, so do **not** overengineer it with microservices, complicated architecture, Redis, Kubernetes, JWT infrastructure, OAuth, etc.

---

## Main Goal

Build a basic Go backend that:

1. Allows a user to identify themselves with a username.
2. Stores that username.
3. Stores which roadmap tasks the user has completed.
4. Stores which roadmap projects the user has completed.
5. Lets the frontend retrieve a user's progress.
6. Lets the frontend mark/unmark tasks and projects as completed.
7. Persists the data in a simple database.
8. Works locally with the existing frontend.
9. Is simple enough for a small personal project and easy to maintain.

---

## Authentication / Login

I do NOT want passwords or a complicated authentication system.

The first time someone uses the website:

- Show a simple login modal.
- Ask only for a username.
- No password.
- No email.
- No account verification.

Example:

> What's your username?
>
> [ Aaliyan ]
>
> [ Continue ]

After they submit their username:

- Save the username in the browser using `localStorage`.
- On future visits, automatically use the saved username.
- The login modal should not appear again unless the user chooses to switch users/log out.
- Provide a simple way to switch users if appropriate.

The backend should also know which username the progress belongs to.

### Important

This is NOT intended to be secure authentication.

It is simply a way to distinguish users on a private/personal roadmap.

Do not introduce passwords, sessions, OAuth, JWT, refresh tokens, or other unnecessary authentication complexity unless there is a strong technical reason.

---

## Data Model

Use a simple relational database.

SQLite is preferred because:

- There will only be around 4–5 realistic users.
- There are only 151 roadmap items.
- There is no need for a separate database server.
- It is easy to run locally.
- The database can simply be a file.

Design the schema sensibly.

A simple approach could be:

### users

- id
- username
- created_at

### progress

- id
- user_id
- item_type (`task` or `project`)
- item_id
- completed
- updated_at

However, use your judgment if another simple schema is cleaner.

There should be a uniqueness constraint so that a user cannot accidentally have duplicate progress records for the same roadmap item.

---

## API

Create a small REST API.

Keep the API straightforward and easy for the frontend to consume.

At minimum, support:

### Identify/Create User

`POST /api/users`

Example request:

```json
{
  "username": "aaliyan"
}
```

If the username already exists, return the existing user.

If it does not exist, create it.

Return the user's basic information.

---

### Get User Progress

`GET /api/users/{username}/progress`

Return the user's completed tasks/projects.

Example:

```json
{
  "tasks": ["task-1", "task-7", "task-23"],
  "projects": ["project-2", "project-5"]
}
```

Use whatever ID format makes sense based on how the existing frontend identifies roadmap items.

---

### Update Progress

Have a simple endpoint for toggling/updating an item's completion status.

For example:

`PUT /api/users/{username}/progress`

Request:

```json
{
  "type": "task",
  "item_id": "task-7",
  "completed": true
}
```

The same endpoint should work for projects.

Example:

```json
{
  "type": "project",
  "item_id": "project-3",
  "completed": false
}
```

---

## Frontend Integration

This is important.

**Inspect the existing frontend before deciding how the API should integrate.**

Find:

- Where the 93 tasks are defined.
- Where the 58 projects are defined.
- How their IDs are currently represented.
- How completion state is currently stored.
- How clicking a task/project currently changes its state.
- Whether the frontend currently uses localStorage or React/browser state for progress.
- What framework/build system is being used.
- How the existing frontend is structured.

Then connect the backend to the existing implementation.

### Desired behavior

When the website loads:

1. Check localStorage for the username.
2. If there is no username, show the login modal.
3. If there is a username, fetch their progress from the Go backend.
4. Display completed tasks/projects based on the backend response.

When the user clicks a task/project:

1. Update the UI immediately if appropriate.
2. Send the completion state to the backend.
3. Backend saves it to SQLite.
4. Progress remains after refreshing the page or opening the website later.

Avoid unnecessary API requests.

---

## Error Handling

Handle basic failures gracefully.

For example:

- Backend is unavailable.
- Username is invalid/empty.
- Invalid item type.
- Invalid item ID.
- Database error.
- API request fails.

The frontend should not completely break if the backend temporarily cannot be reached.

Show a small/simple error state where appropriate.

Do not build an elaborate notification system unless the existing UI already has one.

---

## CORS

If the frontend and Go backend run on different local ports during development, configure CORS appropriately.

For example:

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:8080
```

Use the actual frontend development port discovered from the project rather than assuming it.

Do not use `Access-Control-Allow-Origin: *` blindly if there is a cleaner configuration for the project.

---

## Go Project Structure

Keep the Go backend simple.

Something along the lines of:

```text
backend/
├── main.go
├── go.mod
├── database/
│   └── ...
├── handlers/
│   └── ...
├── models/
│   └── ...
└── roadmap.db
```

But do not force this exact structure if the existing project suggests something simpler.

For a backend this small, fewer files are preferable to excessive abstraction.

---

## Dependencies

Prefer the Go standard library wherever practical.

Only add dependencies when they provide meaningful value.

SQLite is fine to use with a small, well-maintained Go SQLite driver.

Avoid unnecessary frameworks.

I want to understand the backend rather than have a huge framework doing everything.

---

## Security

This is a personal project, so security requirements are intentionally minimal.

Still:

- Validate usernames.
- Validate API input.
- Use parameterized SQL queries.
- Do not construct SQL queries using raw user input.
- Do not expose unnecessary database functionality.
- Do not store sensitive information because there is no sensitive authentication data.
- Do not pretend username-only login provides real authentication.

Do not overengineer security for a website with ~5 users.

---

## Important: Do Not Break the Existing Frontend

Before changing anything:

1. Read `CLAUDE1.md`.
2. Inspect the frontend architecture.
3. Identify how the roadmap data and completion state currently work.
4. Understand the existing components and styling.
5. Make the smallest reasonable frontend changes required to connect the backend.

Do not redesign the website.

Do not change the visual design.

Do not replace existing components unnecessarily.

Do not rewrite working code just because you would personally structure it differently.

The existing frontend is the source of truth for UI/UX.

---

## Development

Make the backend easy to run.

Ideally the developer should be able to do something like:

```bash
cd backend
go run .
```

and have the API available locally.

Document:

- Required Go version.
- How to install dependencies.
- How to start the backend.
- Which port it uses.
- How the frontend should connect to it.
- Where the SQLite database is stored.

If useful, add a simple `.env` configuration for things such as the server port, but do not introduce unnecessary configuration.

---

## Testing

Add basic tests for the important backend behavior.

At minimum test:

- Creating a user.
- Finding an existing user.
- Saving task completion.
- Saving project completion.
- Updating completion from true → false.
- Retrieving progress.
- Invalid input.

Do not build a huge testing suite.

---

## What I Want From You

Work through this in stages:

### Step 1 — Inspect

Read `CLAUDE1.md` and inspect the existing project.

Do not start coding immediately.

Determine:

- Frontend framework.
- Existing roadmap data structure.
- Task/project ID structure.
- Current completion-state implementation.
- Current localStorage usage.
- Existing API/data-fetching patterns.

### Step 2 — Plan

Create a short implementation plan for:

- Go server.
- SQLite schema.
- API routes.
- Frontend integration.
- Login modal.
- localStorage username persistence.

Keep the plan practical and simple.

### Step 3 — Implement

Implement the backend and integrate it with the frontend.

Prioritize working functionality over abstraction.

### Step 4 — Test

Run the backend and frontend.

Test:

- First-time username entry.
- Username persistence after refresh.
- Different users having independent progress.
- Completing a task.
- Uncompleting a task.
- Completing a project.
- Refreshing the page and seeing progress persist.
- Switching users and seeing the other user's progress.

### Step 5 — Explain

When finished, explain briefly:

- What files you created/changed.
- How the backend works.
- How the database works.
- What API endpoints exist.
- How the frontend communicates with it.
- How to run the project locally.

Keep the explanation understandable to someone who knows frontend/WordPress but is relatively new to Go backend development.

---

## General Rule

**Keep this backend boring.**

This is a small personal coding roadmap for a handful of users.

The ideal result is:

**Frontend → simple REST API → Go → SQLite**

with username-based user identification and persistent roadmap progress.

Do not turn this into a production SaaS authentication system.

Do not add complexity unless the existing codebase genuinely requires it.
