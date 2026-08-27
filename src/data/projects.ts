import type { Project } from "./types";

/**
 * Projects are the point. Reading docs gets you familiarity, building gets you
 * the actual skill. Every project here maps back to roadmap nodes so you can
 * see what it's meant to exercise.
 */
const projects: Project[] = [
  // ============================================================== FRONTEND
  {
    id: "fe-portfolio",
    title: "Personal Portfolio",
    tier: "beginner",
    roadmap: "frontend",
    blurb:
      "The traditional first project. Yes it's a cliche. It's also the thing you'll send people.",
    description:
      "One page about you, your projects and how to reach you. The point isn't the content, it's that you own every pixel — no template, no builder. Get it semantic, get it responsive, get it on a real URL, and you've quietly practiced the whole HTML and CSS stage at once.",
    time: "3-6 days",
    stack: ["HTML", "CSS", "Tailwind CSS", "Netlify / Vercel"],
    skills: ["html", "css", "layout-systems", "responsive", "deployment"],
    features: [
      "Semantic structure with real landmarks, not a pile of divs",
      "Responsive from 320px up, with no horizontal scroll",
      "A projects section driven by an array, not copy-pasted markup",
      "Working contact link and accessible focus states",
      "Deployed with a custom domain if you have one",
    ],
    stretch: [
      "Dark mode using CSS custom properties",
      "Scroll-reveal animations with IntersectionObserver, respecting prefers-reduced-motion",
      "Perfect Lighthouse accessibility score",
    ],
  },
  {
    id: "fe-landing",
    title: "Responsive Landing Page",
    tier: "beginner",
    roadmap: "frontend",
    blurb:
      "Copy a real product's landing page pixel by pixel. Best CSS practice there is.",
    description:
      "Pick a landing page you like — Stripe, Linear, Vercel, whatever — and rebuild it from scratch by eye. No inspecting their CSS. You'll hit every layout problem that exists: sticky headers, hero grids, card rows that wrap, footers with four columns that become one on mobile.",
    time: "4-7 days",
    stack: ["HTML", "CSS", "Flexbox", "Grid"],
    skills: ["html", "css", "layout-systems", "responsive", "modern-css"],
    features: [
      "Sticky navigation with a working mobile menu",
      "Hero section that survives being squeezed to 320px",
      "Feature grid using CSS Grid, not floats and prayers",
      "Consistent spacing scale rather than random pixel values",
      "Hover and focus states on everything interactive",
    ],
    stretch: [
      "Rebuild the same page with container queries",
      "Add a fluid type scale with clamp()",
      "Do it a second time without any framework classes at all",
    ],
  },
  {
    id: "fe-calculator",
    title: "Calculator",
    tier: "beginner",
    roadmap: "frontend",
    blurb:
      "Looks trivial until you try to handle 5 + + 3 and your brain leaves.",
    description:
      "A calculator is the classic 'easy project that isn't'. The UI takes an hour. Then you hit state: what happens when someone presses an operator twice, or equals with nothing entered, or divides by zero, or types a second decimal point. It's a small, contained exercise in thinking about every possible input.",
    time: "2-4 days",
    stack: ["HTML", "CSS", "JavaScript"],
    skills: ["js-core", "js-essentials", "css"],
    features: [
      "Full keypad plus keyboard support",
      "Chained operations that behave the way people expect",
      "Clear and delete-last-character",
      "Handles divide by zero and repeated operators without breaking",
      "Display that truncates sensibly instead of overflowing",
    ],
    stretch: [
      "Calculation history you can click to reuse",
      "Correct operator precedence instead of left-to-right",
      "Keyboard-only usability with visible focus",
    ],
  },
  {
    id: "fe-todo",
    title: "Todo Application",
    tier: "beginner",
    roadmap: "frontend",
    blurb:
      "Every developer builds one. Build it properly and it teaches more than it looks like it should.",
    description:
      "Add, edit, complete, delete, filter, persist. It's the smallest project that contains a real CRUD lifecycle, list rendering, and state that has to survive a refresh. Build it in plain JavaScript first so you feel the DOM work a framework will later do for you.",
    time: "2-4 days",
    stack: ["HTML", "CSS", "JavaScript", "localStorage"],
    skills: ["js-core", "js-essentials", "web-apis"],
    features: [
      "Add, edit inline, toggle complete, delete",
      "Filter by all / active / completed",
      "Persist to localStorage and reload correctly",
      "Empty state that says something useful",
      "Item count and a clear-completed action",
    ],
    stretch: [
      "Drag to reorder",
      "Undo the last delete",
      "Rebuild it in Vue afterwards and compare how much code disappeared",
    ],
  },
  {
    id: "fe-quiz",
    title: "Quiz Application",
    tier: "beginner",
    roadmap: "frontend",
    blurb:
      "Questions, answers, a timer, and a score. Good practice at data-driven UI.",
    description:
      "The whole quiz lives in an array of objects, and the UI is generated from it — which is the single most important habit in frontend. Add a timer, track the score, show which answers were wrong at the end, and let people retry.",
    time: "3-5 days",
    stack: ["HTML", "CSS", "JavaScript"],
    skills: ["js-core", "js-essentials"],
    features: [
      "Questions defined as data, UI rendered from it",
      "One question at a time with progress indicator",
      "Countdown timer per question or per quiz",
      "Score screen with a review of wrong answers",
      "Restart without reloading the page",
    ],
    stretch: [
      "Pull questions from a public trivia API",
      "Shuffle questions and answer order each run",
      "Persist a high score",
    ],
  },
  {
    id: "fe-pomodoro",
    title: "Minimalist Pomodoro Timer",
    tier: "beginner",
    roadmap: "frontend",
    legacyLevel: "Level 1: Beginner",
    blurb:
      "Construct a sleek, focus-driven circular countdown clock.",
    description:
      "Construct a sleek, focus-driven circular countdown clock. Work with core web browser interval APIs, reactive state switches, and simple dark mode layout toggles.",
    time: "2-4 days",
    stack: ["HTML5", "Vite", "Tailwind CSS", "Local Storage"],
    skills: ["js-essentials", "web-apis", "css"],
    features: [
      "Work and break intervals that cycle automatically",
      "Circular progress indicator drawn with SVG",
      "Start, pause, reset that don't drift over time",
      "Dark mode toggle that persists",
      "Session count for the day",
    ],
    stretch: [
      "Notification API alert when a session ends",
      "Configurable interval lengths",
      "Keep accurate time when the tab is backgrounded (timers get throttled — this is the real lesson)",
    ],
  },
  {
    id: "fe-weather",
    title: "Weather Dashboard",
    tier: "beginner",
    roadmap: "frontend",
    blurb:
      "Your first real API project. Loading states, error states, and someone else's JSON.",
    description:
      "Search a city, get the weather. Simple on the surface, and it's the project where you learn that an API call has at least four possible outcomes and your UI needs an answer for each one. Use a free weather API and handle the case where the city doesn't exist.",
    time: "3-5 days",
    stack: ["JavaScript", "Fetch API", "Weather API", "Tailwind CSS"],
    skills: ["js-async", "fetch-apis", "js-essentials"],
    features: [
      "City search with a debounced input",
      "Current conditions plus a multi-day forecast",
      "Distinct loading, error and empty states",
      "Geolocation for 'use my location'",
      "Remember the last searched city",
    ],
    stretch: [
      "Cache responses so switching back doesn't refetch",
      "Unit toggle between celsius and fahrenheit",
      "Cancel the in-flight request when the search changes",
    ],
  },
  {
    id: "fe-expense",
    title: "Expense Tracker",
    tier: "beginner",
    roadmap: "frontend",
    blurb:
      "Add expenses, categorise them, watch a chart tell you something you'd rather not know.",
    description:
      "CRUD plus aggregation plus a chart. You'll practice deriving computed values from state (totals per category, totals per month) instead of storing them, which is a habit that pays off in every framework you ever use.",
    time: "4-6 days",
    stack: ["Vue 3", "TypeScript", "Tailwind CSS", "localStorage"],
    skills: ["reactive-frameworks", "vue-forms", "web-apis"],
    features: [
      "Add expenses with amount, category, date and note",
      "Running total and per-category breakdown as computed values",
      "Filter by month and category",
      "Simple bar or donut chart, hand-drawn with SVG",
      "Persist everything locally",
    ],
    stretch: [
      "Budget limits with a warning when you approach them",
      "Export to CSV",
      "Recurring expenses",
    ],
  },
  {
    id: "fe-markdown",
    title: "Collaborative Markdown Editor",
    tier: "intermediate",
    roadmap: "frontend",
    legacyLevel: "Level 2: Intermediate",
    blurb:
      "Implement a beautiful split-screen markdown compiler with local data persistence.",
    description:
      "Implement a beautiful split-screen markdown compiler with local data persistence, auto-saving indicators, and simple syntax theme customizations.",
    time: "1-2 weeks",
    stack: ["Vue 3 / React", "Marked.js", "Tailwind CSS", "Local Storage"],
    skills: ["reactive-frameworks", "vue-composition", "frontend-security"],
    features: [
      "Live split-screen preview with synced scrolling",
      "Debounced autosave with a visible saved indicator",
      "Multiple documents with a sidebar",
      "Keyboard shortcuts for bold, italic, link",
      "Export to .md and to HTML",
    ],
    stretch: [
      "Syntax highlighting inside code blocks",
      "Sanitise the rendered HTML properly — this is a genuine XSS lesson",
      "Full-text search across documents",
    ],
  },
  {
    id: "fe-movies",
    title: "Movie Discovery App",
    tier: "intermediate",
    roadmap: "frontend",
    blurb:
      "Search, filter, paginate, and find out what a race condition feels like.",
    description:
      "Built against a public movie API. The interesting parts aren't the cards — they're debounced search, pagination that keeps its state in the URL, cancelling stale requests when someone types fast, and caching so going back doesn't refetch everything.",
    time: "1-2 weeks",
    stack: ["Vue 3", "TypeScript", "Vue Router", "TMDB API"],
    skills: ["fetch-apis", "state-routing", "vue-api-integration"],
    features: [
      "Debounced search with results in the URL query",
      "Pagination or infinite scroll, done server-side",
      "Detail route per movie with proper deep-linking",
      "Genre and year filters that survive a refresh",
      "Skeleton loading states rather than a spinner",
    ],
    stretch: [
      "Favourites list persisted locally",
      "Cancel stale requests with AbortController",
      "Cache responses per query and revalidate in the background",
    ],
  },
  {
    id: "fe-github",
    title: "GitHub Profile Analyzer",
    tier: "intermediate",
    roadmap: "frontend",
    blurb:
      "Enter a username, get charts. Also get rate-limited, which is educational.",
    description:
      "Pull a user's repos, languages and activity from the GitHub API and visualise it. You'll meet rate limits, pagination via link headers, and the need to make several requests and combine them — all real API integration problems in a project small enough to finish.",
    time: "1 week",
    stack: ["Vue 3", "TypeScript", "GitHub REST API", "SVG charts"],
    skills: ["fetch-apis", "vue-api-integration", "typescript"],
    features: [
      "Profile summary with repos, stars and followers",
      "Language breakdown chart aggregated across repos",
      "Repo list sortable by stars, forks and updated date",
      "Graceful handling of rate limits and missing users",
      "Parallel requests with Promise.all instead of a slow loop",
    ],
    stretch: [
      "Contribution-style heatmap drawn by hand in SVG",
      "Compare two users side by side",
      "Cache results in localStorage with a TTL",
    ],
  },
  {
    id: "fe-kanban",
    title: "Real-Time Kanban Dashboard",
    tier: "intermediate",
    roadmap: "frontend",
    legacyLevel: "Level 3: Advanced",
    blurb:
      "Create a highly interactive workspace with drag-and-drop lists and card filtering.",
    description:
      "Create a highly interactive workspace with drag-and-drop lists, card filtering, custom labels, and realistic animation frames.",
    time: "2-3 weeks",
    stack: ["Vue 3", "Tailwind CSS", "SortableJS", "Pinia Store"],
    skills: ["state-routing", "vue-composition", "frontend-a11y"],
    features: [
      "Multiple columns with drag-and-drop between them",
      "Card create, edit, delete with labels and due dates",
      "Filter by label, assignee or text",
      "Store-driven state so several components stay in sync",
      "Persistence so a refresh doesn't wipe the board",
    ],
    stretch: [
      "Keyboard-accessible card moving (drag-and-drop alone excludes people)",
      "Undo the last action",
      "Multiple boards with routing per board",
    ],
  },
  {
    id: "fe-admin",
    title: "Admin Dashboard",
    tier: "intermediate",
    roadmap: "frontend",
    blurb:
      "Tables, filters, forms and charts. Unglamorous, and it's what most frontend jobs actually are.",
    description:
      "A data-heavy interface: a sortable, filterable, paginated table, detail views, edit forms with validation, and a few summary charts. Every piece of this appears in real work, and doing it well means building reusable table and form components rather than one enormous view.",
    time: "2-3 weeks",
    stack: ["Vue 3", "TypeScript", "Vue Router", "Pinia", "Tailwind CSS"],
    skills: [
      "state-routing",
      "vue-api-integration",
      "vue-forms",
      "frontend-architecture",
    ],
    features: [
      "Reusable data table with sort, filter and server-side pagination",
      "Filters stored in the URL so views are shareable",
      "Create and edit forms with real validation and error display",
      "Summary cards with animated counters",
      "Responsive layout that becomes usable cards on mobile",
    ],
    stretch: [
      "Optimistic updates with rollback on failure",
      "Bulk selection and bulk actions",
      "Column visibility preferences saved per user",
    ],
  },
  {
    id: "fe-auth-dashboard",
    title: "Authentication Dashboard",
    tier: "intermediate",
    roadmap: "frontend",
    blurb:
      "Login, signup, protected routes, and the token refresh dance.",
    description:
      "Wire a real auth flow to a backend — ideally the one you build on the Go path. Signup, login, protected routes, role-based UI, token refresh, and logout that actually clears state. Pair it with your own API and you've built a full stack.",
    time: "1-2 weeks",
    stack: ["Vue 3", "TypeScript", "Vue Router", "Pinia"],
    skills: ["frontend-auth", "state-routing", "vue-forms"],
    features: [
      "Signup and login forms with server-side error display",
      "Route guards with redirect back to the intended page",
      "Auth state in a store, hydrated on app load",
      "Automatic token refresh, queuing requests during it",
      "Role-based UI that hides what the server also protects",
    ],
    stretch: [
      "Remember-me vs session-only",
      "Password strength meter that isn't annoying",
      "Handle the token expiring while a tab was left open overnight",
    ],
  },
  {
    id: "fe-ecommerce",
    title: "E-commerce Frontend",
    tier: "intermediate",
    roadmap: "frontend",
    blurb:
      "Catalogue, cart, checkout. The cart state is harder than it looks.",
    description:
      "Product listing with filters, product detail pages, a cart that survives refreshes, and a multi-step checkout with validation. Cart logic is a genuinely good state management exercise: quantities, variants, stock limits, and totals that must always be derived rather than stored.",
    time: "2-4 weeks",
    stack: ["Vue 3", "TypeScript", "Pinia", "Vue Router", "Tailwind CSS"],
    skills: [
      "state-routing",
      "vue-api-integration",
      "vue-forms",
      "frontend-perf",
    ],
    features: [
      "Product grid with faceted filters and sorting in the URL",
      "Product detail with variant selection",
      "Persistent cart with quantity limits and derived totals",
      "Multi-step checkout with per-step validation",
      "Lazy-loaded images with reserved space to prevent layout shift",
    ],
    stretch: [
      "Wishlist and recently viewed",
      "Coupon codes with server validation",
      "Skeleton loading and route-level code splitting",
    ],
  },
  {
    id: "fe-saas",
    title: "Full SaaS Dashboard",
    tier: "advanced",
    roadmap: "frontend",
    blurb:
      "Multi-tenant, role-aware, chart-heavy. The final boss of ordinary frontend work.",
    description:
      "Organisations, members with roles, billing state, settings, and an analytics view. Building this teaches you app architecture more than any tutorial can, because the number of features finally exceeds what you can hold in your head — which is exactly when structure starts mattering.",
    time: "1-2 months",
    stack: ["Nuxt / Vue 3", "TypeScript", "Pinia", "Tailwind CSS"],
    skills: [
      "frontend-architecture",
      "frontend-auth",
      "vue-api-integration",
      "nuxt",
      "frontend-testing",
    ],
    features: [
      "Organisation switching with scoped data",
      "Role-based permissions across the whole UI",
      "Settings, team management, invitations",
      "Analytics view with several chart types",
      "Feature-based folder architecture that stays navigable",
    ],
    stretch: [
      "Server-side rendering for the marketing pages, client for the app",
      "Component tests for the permission logic",
      "Command palette for navigation",
    ],
  },
  {
    id: "fe-analytics",
    title: "Analytics Platform",
    tier: "advanced",
    roadmap: "frontend",
    blurb:
      "Lots of data, drawn fast, without melting a mid-range laptop.",
    description:
      "A dashboard rendering thousands of data points: time series, filters, date ranges, drill-downs. The challenge is performance — virtualised lists, canvas or SVG charts you wrote yourself, and being careful about how often you recompute derived data.",
    time: "3-6 weeks",
    stack: ["Vue 3", "TypeScript", "SVG / Canvas", "Web Workers"],
    skills: ["frontend-perf", "vue-composition", "frontend-architecture"],
    features: [
      "Time-series charts drawn without a heavy charting library",
      "Date range and dimension filters",
      "Virtualised table for large result sets",
      "Heavy aggregation moved into a Web Worker",
      "Measured performance with a before/after profile",
    ],
    stretch: [
      "Brush-to-zoom on the time axis",
      "Export the current view as CSV or PNG",
      "Streaming updates without re-rendering everything",
    ],
  },
  {
    id: "fe-pwa",
    title: "Offline-First PWA",
    tier: "advanced",
    roadmap: "frontend",
    blurb:
      "Works on the metro with no signal. Sync conflicts included, free of charge.",
    description:
      "An app that stores data locally, works fully offline, and syncs when the connection returns. Service workers, IndexedDB, a sync queue, and the genuinely hard part: deciding what happens when the same record changed in two places.",
    time: "3-6 weeks",
    stack: ["Vue 3", "TypeScript", "Service Worker", "IndexedDB"],
    skills: ["web-apis", "frontend-perf", "frontend-architecture"],
    features: [
      "Installable with a manifest and offline shell",
      "Local-first data in IndexedDB",
      "Queue of pending changes flushed on reconnect",
      "Clear online/offline indication in the UI",
      "Cache strategy chosen deliberately per resource type",
    ],
    stretch: [
      "Conflict resolution UI when the same record changed twice",
      "Background sync API",
      "Push notifications",
    ],
  },
  {
    id: "fe-collab-editor",
    title: "Real-Time Collaborative Editor",
    tier: "pain",
    roadmap: "frontend",
    blurb:
      "Two people typing in the same document. Enjoy learning what a CRDT is.",
    description:
      "Multiple cursors, live text sync, presence indicators, and conflict resolution that doesn't corrupt the document. This is a genuinely hard distributed systems problem wearing a text editor costume — do not attempt it as project number four.",
    time: "1-3 months",
    stack: ["Vue 3", "TypeScript", "WebSockets", "Yjs / CRDT", "Go backend"],
    skills: ["web-apis", "frontend-architecture", "websockets"],
    features: [
      "Live text synchronisation between clients",
      "Remote cursors and selections with user colours",
      "Presence list of who's currently in the document",
      "Offline edits that merge on reconnect",
      "Document history",
    ],
    stretch: [
      "Implement the sync layer yourself before reaching for Yjs, just to feel the problem",
      "Comments anchored to text ranges",
      "Permissions per document",
    ],
  },
  {
    id: "fe-site-builder",
    title: "Visual Website Builder",
    tier: "pain",
    roadmap: "frontend",
    blurb:
      "Drag components onto a canvas, edit their props, export HTML. You will question your choices.",
    description:
      "A drag-and-drop page builder with a component tree, a properties panel, undo/redo, and export. It forces you to think about recursive rendering, a serialisable document model, and command-pattern history — architecture problems most projects never make you confront.",
    time: "1-3 months",
    stack: ["Vue 3", "TypeScript", "Pinia", "Drag & Drop API"],
    skills: ["frontend-architecture", "vue-composition", "web-apis"],
    features: [
      "Component palette with drag onto a canvas",
      "Recursive tree rendering with nesting",
      "Properties panel bound to the selected node",
      "Undo/redo via a command history",
      "Export to clean, standalone HTML",
    ],
    stretch: [
      "Responsive breakpoint editing per component",
      "Save and load projects",
      "Keyboard navigation of the component tree",
    ],
  },
  {
    id: "fe-game",
    title: "Multiplayer Browser Game",
    tier: "pain",
    roadmap: "frontend",
    blurb:
      "Game loops, canvas rendering, and network latency all at once. Extremely fun, extremely annoying.",
    description:
      "Something simple in concept — snake, pong, a small arena — but multiplayer and real-time. You'll learn requestAnimationFrame game loops, canvas rendering, and the hard truth that the network is slow enough that you have to predict and correct.",
    time: "1-2 months",
    stack: ["TypeScript", "Canvas API", "WebSockets", "Go backend"],
    skills: ["web-apis", "frontend-perf", "websockets"],
    features: [
      "Fixed-timestep game loop with requestAnimationFrame",
      "Canvas rendering at a stable frame rate",
      "Server-authoritative state over WebSockets",
      "Lobby and room joining",
      "Score and game-over handling",
    ],
    stretch: [
      "Client-side prediction and reconciliation",
      "Interpolation so other players move smoothly",
      "Spectator mode",
    ],
  },

  // =============================================================== BACKEND
  {
    id: "be-cli-tasks",
    title: "CLI Task Manager",
    tier: "beginner",
    roadmap: "backend",
    blurb:
      "No HTTP, no database, no browser. Just you, the terminal and Go.",
    description:
      "A command-line task manager that stores tasks in a JSON file. It's the perfect first Go project because there's nothing to distract you: arguments, structs, JSON marshalling, file I/O and error handling, all in one small program you'll actually use.",
    time: "3-5 days",
    stack: ["Go", "encoding/json", "flag", "os"],
    skills: ["go-syntax", "go-cli", "go-structs"],
    features: [
      "add, list, done, delete subcommands",
      "Tasks persisted to a JSON file",
      "Priorities and due dates",
      "Filter and sort options via flags",
      "Sensible errors instead of panics when the file is missing or corrupt",
    ],
    stretch: [
      "Coloured terminal output",
      "Store in the user's config directory rather than the working directory",
      "Install it with go install and actually use it for a week",
    ],
  },
  {
    id: "be-file-server",
    title: "Simple File Server",
    tier: "beginner",
    roadmap: "backend",
    blurb:
      "Serve files over HTTP, then add the bits that make it not immediately dangerous.",
    description:
      "Start with http.FileServer in three lines, then make it real: upload endpoints, size limits, content-type detection, and directory traversal protection. It's the shortest path to understanding that every HTTP feature you add is also an attack surface.",
    time: "3-5 days",
    stack: ["Go", "net/http", "io"],
    skills: ["go-cli", "http-servers", "backend-security"],
    features: [
      "Serve a directory over HTTP with directory listing",
      "File upload with a maximum size",
      "Correct content types and download headers",
      "Path traversal protection (try to break it yourself)",
      "Request logging middleware",
    ],
    stretch: [
      "Basic auth on the upload endpoint",
      "Range requests so large files can resume",
      "Streaming upload rather than buffering into memory",
    ],
  },
  {
    id: "be-url-shortener",
    title: "URL Shortener",
    tier: "beginner",
    roadmap: "backend",
    blurb:
      "The classic backend project because it's small on the outside and deep on the inside.",
    description:
      "POST a long URL, get a short code, GET the short code and redirect. Fifty lines to start. Then you add collision-free code generation, click analytics, expiry, custom aliases and rate limits — and it quietly becomes a real service.",
    time: "4-7 days",
    stack: ["Go", "net/http", "SQLite / Postgres"],
    skills: ["http-servers", "api-design", "sql"],
    features: [
      "Create short links and redirect with a 301 or 302 (know which and why)",
      "Collision-safe code generation",
      "Click counting per link",
      "Custom aliases with conflict handling",
      "URL validation so it isn't an open redirect",
    ],
    stretch: [
      "Link expiry and scheduled cleanup",
      "Cache hot links in memory or Redis",
      "Per-IP rate limiting on creation",
    ],
  },
  {
    id: "be-rest-api",
    title: "Multi-User Task REST API",
    tier: "beginner",
    roadmap: "backend",
    legacyLevel: "Level 1: Beginner",
    blurb:
      "Deploy a clean backend system allowing users to sign-up, securely log-in, and manage custom task catalogs.",
    description:
      "Deploy a clean backend system allowing users to sign-up, securely log-in, and manage custom task catalogs. Include full request parsing, data schemas, and status handling.",
    time: "1-2 weeks",
    stack: ["NodeJS / Express", "SQLite", "bcrypt", "JSON Web Tokens"],
    skills: ["http-servers", "api-design", "security-auth", "validation-dto"],
    features: [
      "Signup and login with properly hashed passwords",
      "Full CRUD on tasks, scoped to the owning user",
      "Correct status codes and a consistent error shape",
      "Request validation before anything touches the database",
      "Ownership checks on every single task operation",
    ],
    stretch: [
      "Pagination and filtering on the list endpoint",
      "Refresh tokens",
      "Table-driven tests for every handler using httptest",
    ],
  },
  {
    id: "be-auth-api",
    title: "Authentication API",
    tier: "intermediate",
    roadmap: "backend",
    blurb:
      "The one feature where a bug isn't a bug, it's an incident.",
    description:
      "A standalone auth service: registration, login, refresh, logout, password reset, email verification. Build it carefully and read the OWASP cheat sheets rather than a blog post, because this is the area of backend work with the highest ratio of confident to correct tutorials.",
    time: "2-3 weeks",
    stack: ["Go", "Postgres", "bcrypt / argon2", "JWT or sessions"],
    skills: ["security-auth", "authorization", "middleware", "go-db"],
    features: [
      "Registration with password hashing (bcrypt or argon2, never SHA)",
      "Login issuing access and refresh tokens",
      "Refresh rotation with reuse detection",
      "Password reset via a single-use, expiring token",
      "Rate limiting on login and reset endpoints",
    ],
    stretch: [
      "Email verification flow",
      "OAuth login with one provider",
      "Session revocation that takes effect immediately",
    ],
  },
  {
    id: "be-blog-api",
    title: "Blog Backend",
    tier: "intermediate",
    roadmap: "backend",
    blurb:
      "Posts, comments, tags, users. Relationships you can actually reason about.",
    description:
      "A blog is the friendliest way to practice relational modelling: users have posts, posts have comments, posts have many tags and tags have many posts. Add drafts, publishing and search and you've covered most of what a content API ever needs.",
    time: "2-3 weeks",
    stack: ["Go", "Postgres", "sqlc", "chi or net/http"],
    skills: ["sql", "data-modeling", "api-design", "layered-architecture"],
    features: [
      "Posts with draft and published states",
      "Comments with author and moderation flag",
      "Many-to-many tags via a join table",
      "Pagination on listings, done in SQL",
      "Full-text search using Postgres, not a LIKE query",
    ],
    stretch: [
      "Slug generation with collision handling",
      "Nested comment threads",
      "Fix the inevitable N+1 query and measure the difference",
    ],
  },
  {
    id: "be-postgres-api",
    title: "PostgreSQL-Powered API",
    tier: "intermediate",
    roadmap: "backend",
    blurb:
      "Migrations, transactions, indexes, connection pools. The unglamorous core skill.",
    description:
      "Take any domain you like and build the data layer properly: versioned migrations, a connection pool tuned deliberately, transactions across multiple writes, and indexes justified by an actual EXPLAIN ANALYZE rather than a guess.",
    time: "2-3 weeks",
    stack: ["Go", "PostgreSQL", "pgx", "golang-migrate", "sqlc"],
    skills: ["postgres", "go-db", "data-modeling", "layered-architecture"],
    features: [
      "Versioned up/down migrations",
      "Repository layer behind an interface",
      "Multi-statement transactions with rollback on error",
      "Connection pool configured on purpose",
      "Indexes added based on EXPLAIN ANALYZE output",
    ],
    stretch: [
      "Seed data and an integration test suite against a real Postgres in Docker",
      "Soft deletes with a partial unique index",
      "Optimistic locking with a version column",
    ],
  },
  {
    id: "be-ecommerce-api",
    title: "E-commerce API",
    tier: "intermediate",
    roadmap: "backend",
    blurb:
      "Products, stock, carts, orders. Where you learn why transactions exist.",
    description:
      "The interesting problem is inventory: two people buy the last item at the same moment. Solving that properly means transactions, row locking and thinking about isolation levels, which is a lesson you can't really get from a todo app.",
    time: "3-4 weeks",
    stack: ["Go", "PostgreSQL", "Redis", "JWT"],
    skills: [
      "layered-architecture",
      "go-db",
      "data-modeling",
      "security-auth",
      "caching-queues",
    ],
    features: [
      "Product catalogue with categories and variants",
      "Cart operations tied to a user",
      "Order placement inside a transaction that decrements stock safely",
      "Order status lifecycle",
      "Idempotency keys so a retried request doesn't double-order",
    ],
    stretch: [
      "Reserve stock with a timeout instead of decrementing immediately",
      "Cache the catalogue with sensible invalidation",
      "Simulate concurrent checkouts and prove you don't oversell",
    ],
  },
  {
    id: "be-chat-server",
    title: "Real-Time WebSocket Chat Server",
    tier: "intermediate",
    roadmap: "backend",
    legacyLevel: "Level 2: Intermediate",
    blurb:
      "Establish a scalable chat router holding secure room channels and real-time message relays.",
    description:
      "Establish a scalable chat router holding secure room channels, real-time message relays, historical query lookups, and system alerts.",
    time: "2-3 weeks",
    stack: ["NodeJS", "WebSockets / Socket.io", "Redis Pub/Sub", "PostgreSQL"],
    skills: ["websockets", "goroutines", "channels", "caching-queues"],
    features: [
      "Hub managing connections, rooms, join and leave",
      "Message broadcast to a room",
      "Message history persisted and paginated",
      "Authenticated connections",
      "Heartbeats to detect dead clients",
    ],
    stretch: [
      "Scale across instances with Redis pub/sub",
      "Typing indicators and read receipts",
      "Handle a slow client without blocking the whole hub",
    ],
  },
  {
    id: "be-rate-limited-api",
    title: "Rate-Limited API",
    tier: "intermediate",
    roadmap: "backend",
    blurb:
      "Because the internet will find your endpoint and it will not be gentle.",
    description:
      "Build an API with real rate limiting: token bucket per user and per IP, tiered limits by plan, proper 429 responses with Retry-After, and limits shared across instances via Redis rather than living in one process's memory.",
    time: "1-2 weeks",
    stack: ["Go", "Redis", "net/http"],
    skills: ["backend-security", "middleware", "caching-queues"],
    features: [
      "Token bucket limiter as middleware",
      "Per-user and per-IP limits",
      "429 responses with Retry-After and remaining-quota headers",
      "Distributed limits in Redis so multiple instances agree",
      "Different tiers for different plans",
    ],
    stretch: [
      "Sliding window instead of fixed window",
      "Load test it and watch the limiter hold",
      "Circuit breaker on a downstream dependency",
    ],
  },
  {
    id: "be-job-queue",
    title: "Job Queue",
    tier: "advanced",
    roadmap: "backend",
    blurb:
      "Do the slow thing later, and survive the worker dying halfway through.",
    description:
      "A background job system: enqueue work, workers pull and process it, failures retry with backoff, permanent failures land in a dead letter queue. Writing one yourself is the single best way to understand every queue product you'll ever use afterwards.",
    time: "3-4 weeks",
    stack: ["Go", "Redis or Postgres", "goroutines", "context"],
    skills: [
      "concurrency-patterns",
      "channels",
      "caching-queues",
      "observability",
    ],
    features: [
      "Enqueue with a job type and payload",
      "Worker pool with configurable concurrency",
      "Retry with exponential backoff and a max attempt count",
      "Dead letter queue for permanent failures",
      "Graceful shutdown that finishes in-flight jobs",
    ],
    stretch: [
      "Scheduled and recurring jobs",
      "Job priorities",
      "A small dashboard showing queue depth and failure rate",
    ],
  },
  {
    id: "be-notifications",
    title: "Real-Time Notification System",
    tier: "advanced",
    roadmap: "backend",
    blurb:
      "One event, many channels, and nobody gets the same email twice.",
    description:
      "Events come in, notifications go out over WebSocket, email and push, respecting each user's preferences. The hard parts are deduplication, delivery guarantees, and batching so a busy hour doesn't produce forty separate emails.",
    time: "3-4 weeks",
    stack: ["Go", "PostgreSQL", "Redis", "WebSockets"],
    skills: ["websockets", "caching-queues", "concurrency-patterns"],
    features: [
      "Event ingestion with a typed payload",
      "Per-user channel preferences",
      "Real-time delivery to connected clients, queued for offline ones",
      "Read/unread state and a notification centre endpoint",
      "Deduplication so retries don't double-notify",
    ],
    stretch: [
      "Digest batching (one summary instead of forty pings)",
      "Quiet hours per user timezone",
      "Delivery status tracking per channel",
    ],
  },
  {
    id: "be-microservices",
    title: "Microservice Billing Pipeline",
    tier: "advanced",
    roadmap: "backend",
    legacyLevel: "Level 3: Advanced",
    blurb:
      "Build a highly scalable, event-driven subscription processor handling transaction queues and webhook alerts.",
    description:
      "Build a highly scalable, event-driven subscription processor handling transaction queues, webhook alerts, and async invoice exports securely.",
    time: "1-2 months",
    stack: ["Docker", "NodeJS / Go", "RabbitMQ / Kafka", "PostgreSQL", "Redis"],
    skills: [
      "system-design",
      "caching-queues",
      "docker",
      "deploy-cloud",
      "observability",
    ],
    features: [
      "Separate services communicating over a broker",
      "Subscription lifecycle events",
      "Webhook receiver with signature verification and idempotency",
      "Async invoice generation as a queued job",
      "docker compose bringing the whole system up locally",
    ],
    stretch: [
      "Distributed tracing across services",
      "Outbox pattern so database writes and events can't diverge",
      "Deliberately kill a service mid-flow and prove nothing is lost",
    ],
  },
  {
    id: "be-payments",
    title: "Payment Processing Simulation",
    tier: "advanced",
    roadmap: "backend",
    blurb:
      "Money makes every bug expensive. Idempotency stops being theoretical.",
    description:
      "A simulated payment flow: authorise, capture, refund, with webhooks and a ledger. Never store real card data — the point is the state machine, the idempotency and the audit trail, all of which apply to any system where doing something twice is unacceptable.",
    time: "3-5 weeks",
    stack: ["Go", "PostgreSQL", "Redis", "webhooks"],
    skills: ["system-design", "security-auth", "go-db", "observability"],
    features: [
      "Payment state machine with only valid transitions allowed",
      "Idempotency keys on every mutating endpoint",
      "Immutable, append-only ledger",
      "Webhook delivery with retries and signature verification",
      "Full audit log of every state change",
    ],
    stretch: [
      "Reconciliation job that detects and reports mismatches",
      "Partial refunds",
      "Simulate a network failure mid-capture and prove the ledger still balances",
    ],
  },
  {
    id: "be-high-concurrency",
    title: "High-Concurrency API",
    tier: "advanced",
    roadmap: "backend",
    blurb:
      "Load test it until it breaks, then find out which part broke first.",
    description:
      "Take an API you've already built and make it survive serious load. Profile it, find the bottleneck (it's usually the database, then allocations), fix it, measure again. This is the project where pprof stops being a word you've heard and becomes a tool you use.",
    time: "2-4 weeks",
    stack: ["Go", "PostgreSQL", "Redis", "pprof", "k6 or vegeta"],
    skills: [
      "concurrency-patterns",
      "observability",
      "caching-queues",
      "system-design",
    ],
    features: [
      "Load testing harness with a repeatable scenario",
      "pprof CPU and memory profiles before and after",
      "Connection pool tuning with measured results",
      "Caching layer with measured hit rate",
      "Latency percentiles reported, not averages",
    ],
    stretch: [
      "Run two instances behind a load balancer",
      "Add graceful degradation when a dependency is slow",
      "Write up what you changed and what it bought you",
    ],
  },
  {
    id: "be-distributed-cache",
    title: "Distributed Cache",
    tier: "pain",
    roadmap: "backend",
    blurb:
      "Build your own mini-Redis. Consistent hashing included, sanity not included.",
    description:
      "An in-memory key-value store with TTLs, eviction, and multiple nodes sharing keys via consistent hashing. You will learn more about distributed systems from the failure cases here than from any amount of reading about them.",
    time: "1-2 months",
    stack: ["Go", "net", "goroutines", "sync"],
    skills: [
      "concurrency-patterns",
      "sync-context",
      "system-design",
      "caching-queues",
    ],
    features: [
      "GET / SET / DELETE over a TCP protocol you designed",
      "TTL expiry with background cleanup",
      "LRU eviction under a memory limit",
      "Consistent hashing across multiple nodes",
      "Concurrent access that survives the race detector",
    ],
    stretch: [
      "Replication with a follower node",
      "Persistence with a write-ahead log",
      "Benchmark against real Redis and be humbled",
    ],
  },
  {
    id: "be-event-driven",
    title: "Event-Driven Service",
    tier: "pain",
    roadmap: "backend",
    blurb:
      "Event sourcing, projections, eventual consistency. Genuinely hard, genuinely worth doing once.",
    description:
      "Instead of storing current state, store every event that ever happened and derive state by replaying them. It gives you a perfect audit log and time travel, and it costs you simplicity everywhere else. Build one to understand the tradeoff first-hand rather than from a conference talk.",
    time: "1-2 months",
    stack: ["Go", "PostgreSQL", "Kafka or NATS", "Docker"],
    skills: ["system-design", "caching-queues", "data-modeling", "observability"],
    features: [
      "Append-only event store",
      "Aggregates rebuilt by replaying events",
      "Read-model projections updated from the stream",
      "Idempotent consumers that tolerate duplicate delivery",
      "Replay from zero to rebuild all projections",
    ],
    stretch: [
      "Snapshots so replay doesn't take forever",
      "Schema evolution for old event versions",
      "Deliberately break a projection and rebuild it from the log",
    ],
  },

  // ================================================================ PYTHON
  {
    id: "py-csv-analyzer",
    title: "CSV Analyzer",
    tier: "beginner",
    roadmap: "python",
    blurb:
      "Point it at any CSV, get a report. The first genuinely useful thing you'll build.",
    description:
      "A script that loads a CSV, reports its shape, column types, missing values, basic statistics and possible problems. Start with the csv module to feel the manual version, then rewrite it with Pandas and notice how much disappears.",
    time: "3-5 days",
    stack: ["Python", "pandas", "argparse"],
    skills: ["py-syntax", "py-errors", "pandas"],
    features: [
      "Load any CSV given as a command-line argument",
      "Report rows, columns, dtypes and memory usage",
      "Missing value count and percentage per column",
      "Summary statistics for numeric columns",
      "Flag likely problems: constant columns, high-cardinality strings, duplicate rows",
    ],
    stretch: [
      "Handle files bigger than memory by chunking",
      "Output a small HTML report",
      "Detect and parse date columns automatically",
    ],
  },
  {
    id: "py-expense-analysis",
    title: "Expense Analysis",
    tier: "beginner",
    roadmap: "python",
    blurb:
      "Analyse your own bank statement. Confronting, educational, free dataset.",
    description:
      "Export your transactions, load them into Pandas, categorise them, and find out where the money goes. Real personal data is messy in exactly the ways real work data is messy, and you care about the answer, which makes the debugging bearable.",
    time: "3-6 days",
    stack: ["Python", "pandas", "matplotlib"],
    skills: ["pandas", "data-cleaning", "matplotlib"],
    features: [
      "Load and clean a bank export",
      "Rule-based categorisation of merchants",
      "Monthly totals and per-category breakdown with groupby",
      "Trend chart over time",
      "Flag unusual transactions",
    ],
    stretch: [
      "Detect recurring subscriptions automatically",
      "Compare month over month with percentage change",
      "Simple forecast for next month's spend",
    ],
  },
  {
    id: "py-weather-analysis",
    title: "Weather Data Analysis",
    tier: "beginner",
    roadmap: "python",
    blurb:
      "Time series without the finance stress. Resampling, rolling averages, seasonality.",
    description:
      "Grab historical weather data for your city and actually interrogate it. Time series work has its own set of skills — parsing dates properly, resampling to different frequencies, rolling windows — and weather is a friendly dataset to learn them on.",
    time: "4-6 days",
    stack: ["Python", "pandas", "matplotlib", "seaborn"],
    skills: ["pandas", "data-cleaning", "matplotlib", "statistics"],
    features: [
      "Load a historical dataset with proper datetime parsing",
      "Resample daily data to monthly and yearly",
      "Rolling averages to smooth noise",
      "Seasonal patterns visualised",
      "Handle gaps in the record honestly",
    ],
    stretch: [
      "Compare two cities on the same axes",
      "Look for a trend over decades and be careful about claiming one",
      "Interactive plot with a date range selector",
    ],
  },
  {
    id: "py-netflix",
    title: "Netflix / Movie Dataset Analysis",
    tier: "beginner",
    roadmap: "python",
    blurb:
      "A messy public dataset and a set of questions. Pure exploratory analysis practice.",
    description:
      "Take a public catalogue dataset and answer real questions with it: how has content changed over time, which countries produce what, how do genres cluster. The value is in the messy bits — multi-value columns, missing countries, inconsistent date formats.",
    time: "4-7 days",
    stack: ["Python", "pandas", "seaborn", "Jupyter"],
    skills: ["pandas", "data-cleaning", "seaborn"],
    features: [
      "Clean multi-value columns (genres, cast, countries) into usable form",
      "Answer at least five specific questions with charts",
      "Handle missing values with a documented decision per column",
      "Correlation and distribution exploration",
      "A written summary of what you found, not just plots",
    ],
    stretch: [
      "Text analysis on descriptions",
      "Build a simple genre-based recommender",
      "Publish the notebook with narrative between the cells",
    ],
  },
  {
    id: "py-viz-dashboard",
    title: "Data Visualization Dashboard",
    tier: "beginner",
    roadmap: "python",
    blurb:
      "Charts that communicate, not charts that decorate.",
    description:
      "Build a multi-panel dashboard from a dataset you care about. The exercise is as much about restraint as technique — choosing the right chart for each question, labelling everything, and removing the decoration that doesn't carry information.",
    time: "4-7 days",
    stack: ["Python", "matplotlib", "seaborn", "Streamlit (optional)"],
    skills: ["matplotlib", "seaborn", "pandas"],
    features: [
      "Multi-panel figure with a consistent visual style",
      "Right chart type per question, justified",
      "Every axis labelled, every chart titled",
      "Colorblind-safe palette",
      "Exported at presentation quality",
    ],
    stretch: [
      "Make it interactive with Streamlit",
      "Add filters that update every panel",
      "Show the same data badly and well side by side, and explain why",
    ],
  },
  {
    id: "py-house-prices",
    title: "House Price Prediction",
    tier: "intermediate",
    roadmap: "python",
    blurb:
      "The canonical first regression problem. Do it properly, not just to a leaderboard.",
    description:
      "Predict prices from property features. It's a well-worn problem precisely because it contains everything: missing values, categorical encoding, skewed targets, feature engineering, and a metric choice that changes what 'good' means.",
    time: "1-2 weeks",
    stack: ["Python", "pandas", "scikit-learn", "matplotlib"],
    skills: [
      "scikit-learn",
      "supervised",
      "model-evaluation",
      "feature-engineering",
    ],
    features: [
      "Exploratory analysis before any modelling",
      "Preprocessing inside a Pipeline so nothing leaks",
      "Baseline (predict the mean) before anything clever",
      "Compare at least three model families",
      "Cross-validated RMSE, with the metric choice explained",
    ],
    stretch: [
      "Engineer features from domain reasoning and measure the gain",
      "Residual analysis — where does it fail and why",
      "SHAP values to explain individual predictions",
    ],
  },
  {
    id: "py-spam-classifier",
    title: "Spam Classifier",
    tier: "intermediate",
    roadmap: "python",
    blurb:
      "Text in, binary out. Your first NLP project and a lesson in precision vs recall.",
    description:
      "Classify messages as spam or not. It introduces text vectorisation (bag of words, TF-IDF) and forces the precision/recall conversation: a false positive means someone's real email vanished, which is much worse than a false negative.",
    time: "1 week",
    stack: ["Python", "scikit-learn", "pandas", "NLTK (optional)"],
    skills: ["scikit-learn", "supervised", "model-evaluation"],
    features: [
      "Text preprocessing: lowercasing, punctuation, stopwords",
      "TF-IDF vectorisation inside the pipeline",
      "Naive Bayes and logistic regression compared",
      "Confusion matrix with the business cost of each error discussed",
      "Threshold chosen deliberately, not left at 0.5",
    ],
    stretch: [
      "Inspect the most predictive words and sanity check them",
      "Try character n-grams for obfuscated spam",
      "Test on messages you write yourself to try to fool it",
    ],
  },
  {
    id: "py-churn",
    title: "Customer Churn Prediction",
    tier: "intermediate",
    roadmap: "python",
    blurb:
      "Imbalanced classes, business context, and the trap of 95% accuracy.",
    description:
      "Predict which customers will leave. The dataset is imbalanced, which is exactly the point: a model that predicts 'nobody churns' scores 95% accuracy and is worth nothing. You'll learn to pick metrics that reflect what the business actually needs.",
    time: "1-2 weeks",
    stack: ["Python", "scikit-learn", "pandas", "XGBoost"],
    skills: [
      "supervised",
      "model-evaluation",
      "feature-engineering",
      "data-cleaning",
    ],
    features: [
      "Explicit class imbalance handling (weights or resampling)",
      "Precision-recall curve rather than accuracy",
      "Feature engineering from tenure and usage patterns",
      "Model comparison with honest cross-validation",
      "Threshold tuned to a stated business tradeoff",
    ],
    stretch: [
      "Estimate the monetary value of the model at your chosen threshold",
      "SHAP to explain who is at risk and why",
      "Check for leakage — is any feature only known after they churned?",
    ],
  },
  {
    id: "py-recommender",
    title: "Recommendation System",
    tier: "intermediate",
    roadmap: "python",
    blurb:
      "'People who liked this also liked' — mostly matrix maths and a cold start problem.",
    description:
      "Build content-based and collaborative filtering recommenders and compare them. Then hit the cold start problem: what do you recommend to someone brand new with no history? There's no clean answer, which is the lesson.",
    time: "1-2 weeks",
    stack: ["Python", "pandas", "scikit-learn", "NumPy"],
    skills: ["unsupervised", "numpy", "model-evaluation"],
    features: [
      "Content-based recommendations using item features",
      "Collaborative filtering from a user-item matrix",
      "Cosine similarity implemented and understood",
      "Evaluation with a held-out set",
      "A stated strategy for new users and new items",
    ],
    stretch: [
      "Matrix factorisation with SVD",
      "Hybrid of both approaches",
      "Measure diversity, not just accuracy — a recommender that only shows blockbusters is technically accurate and useless",
    ],
  },
  {
    id: "py-sentiment",
    title: "Sentiment Analysis",
    tier: "intermediate",
    roadmap: "python",
    blurb:
      "Positive or negative? Sarcasm says otherwise, and that's the fun part.",
    description:
      "Classify review sentiment, starting with classical methods (TF-IDF plus a linear model) before reaching for a transformer. Comparing the two teaches you something important: the simple model is often 90% as good, ten times faster, and infinitely easier to explain.",
    time: "1-2 weeks",
    stack: ["Python", "scikit-learn", "pandas", "Hugging Face (optional)"],
    skills: ["supervised", "feature-engineering", "model-evaluation"],
    features: [
      "TF-IDF plus logistic regression baseline",
      "Proper train/validation/test methodology",
      "Error analysis on the misclassified examples",
      "Comparison with a pretrained transformer",
      "Honest cost/benefit comparison between the two",
    ],
    stretch: [
      "Fine-tune a small transformer and measure the gain",
      "Handle negation and sarcasm cases specifically",
      "Aspect-based sentiment (the food was good, the service was not)",
    ],
  },
  {
    id: "py-image-classifier",
    title: "Image Classifier",
    tier: "intermediate",
    roadmap: "python",
    blurb:
      "Your first neural network. Transfer learning means you don't need a datacentre.",
    description:
      "Classify images into categories using a pretrained model with a new head. Training from scratch would need enormous data and compute; transfer learning gets you a good model from a few hundred images and a laptop, which is how this is done in practice anyway.",
    time: "1-2 weeks",
    stack: ["Python", "PyTorch", "torchvision", "matplotlib"],
    skills: ["deep-learning", "model-evaluation", "numpy"],
    features: [
      "Dataset loading with augmentation",
      "Pretrained backbone with a replaced classifier head",
      "Training loop with validation each epoch",
      "Confusion matrix over the classes",
      "Visualise the images it gets wrong",
    ],
    stretch: [
      "Unfreeze and fine-tune deeper layers",
      "Learning rate finder",
      "Deploy it behind a FastAPI endpoint",
    ],
  },
  {
    id: "py-model-api",
    title: "Model Serving API",
    tier: "advanced",
    roadmap: "python",
    blurb:
      "The step that turns a notebook into something other people can use.",
    description:
      "Wrap a trained pipeline in FastAPI with validated inputs, a documented schema, and a container. The discipline that matters: the preprocessing that runs at inference must be byte-for-byte the same as the one that ran at training.",
    time: "1-2 weeks",
    stack: ["Python", "FastAPI", "Pydantic", "joblib", "Docker"],
    skills: ["model-deployment", "py-typing", "mlops"],
    features: [
      "POST endpoint accepting validated features",
      "Whole pipeline (preprocessing + model) loaded from one artifact",
      "Automatic OpenAPI docs",
      "Health check plus model version in the response",
      "Dockerfile that builds and runs cleanly",
    ],
    stretch: [
      "Batch prediction endpoint",
      "Log every prediction for later analysis",
      "Load test it and report latency percentiles",
    ],
  },
  {
    id: "py-semantic-search",
    title: "Semantic Document Searcher",
    tier: "advanced",
    roadmap: "python",
    legacyLevel: "Level 1: Beginner",
    blurb:
      "Index custom textual lines and perform mathematical similarity queries against natural questions.",
    description:
      "Index custom textual lines and perform mathematical similarity queries against natural questions. Connect to embedding models and display results instantly.",
    time: "1-2 weeks",
    stack: ["Python", "OpenAI Embedding API", "ChromaDB / SQLite"],
    skills: ["embeddings", "python-ai-apis", "numpy"],
    features: [
      "Document loading and chunking with overlap",
      "Embedding generation with batching and caching",
      "Vector storage and nearest-neighbour retrieval",
      "Results ranked with similarity scores shown",
      "Comparison against a plain keyword search baseline",
    ],
    stretch: [
      "Hybrid search combining keyword and semantic",
      "Metadata filters alongside the vector query",
      "Implement cosine similarity yourself in NumPy before using a library",
    ],
  },
  {
    id: "py-rag-app",
    title: "RAG Application",
    tier: "advanced",
    roadmap: "python",
    blurb:
      "Ask questions about your own documents and get answers with citations.",
    description:
      "Retrieval plus generation: chunk documents, embed them, retrieve the relevant pieces for a question, and have a model answer using only those pieces — with citations, and with a clear 'I don't know' when the answer isn't in the documents.",
    time: "2-4 weeks",
    stack: ["Python", "FastAPI", "vector DB", "LLM API"],
    skills: ["rag", "embeddings", "prompt-engineering", "ai-eval"],
    features: [
      "Document ingestion pipeline with structure-aware chunking",
      "Retrieval with tunable top-k",
      "Answer generation constrained to retrieved context",
      "Citations linking back to source chunks",
      "Explicit 'not found in the documents' path",
    ],
    stretch: [
      "Reranking after retrieval",
      "Evaluate retrieval quality separately from answer quality",
      "Streaming responses to the client",
    ],
  },
  {
    id: "py-doc-qa",
    title: "Document Question-Answering System",
    tier: "advanced",
    roadmap: "python",
    blurb:
      "Like RAG, but the documents are PDFs, and PDFs are a hate crime against structure.",
    description:
      "Extend RAG to real documents: PDFs with tables, scanned pages, multi-column layouts, and headers that repeat on every page. Parsing is genuinely most of the work, and it's the part every tutorial skips.",
    time: "3-5 weeks",
    stack: ["Python", "PyMuPDF", "vector DB", "FastAPI", "LLM API"],
    skills: ["rag", "embeddings", "ai-eval", "model-deployment"],
    features: [
      "PDF parsing preserving structure where possible",
      "Table extraction handled separately from prose",
      "Page-level citations in the answer",
      "Multi-document search with source filters",
      "Evaluation set of question/answer pairs you wrote by hand",
    ],
    stretch: [
      "OCR fallback for scanned documents",
      "Cross-document comparison questions",
      "Confidence signal when retrieval quality is poor",
    ],
  },
  {
    id: "py-multiagent",
    title: "Multi-Agent Support Assistant",
    tier: "advanced",
    roadmap: "python",
    legacyLevel: "Level 2: Intermediate",
    blurb:
      "Design an automated helpdesk router holding secondary specialized agents.",
    description:
      "Design an automated helpdesk router holding secondary specialized agents (billing, technical, refunds) that communicate via clean function interfaces.",
    time: "3-5 weeks",
    stack: ["Python", "FastAPI", "OpenAI Tool Calling", "LangChain"],
    skills: ["prompt-engineering", "python-ai-apis", "ai-eval"],
    features: [
      "Router that classifies an incoming request",
      "Specialised handlers with their own tools and prompts",
      "Tool calling with proper result handling",
      "Conversation state across turns",
      "Escalation path to a human with the context attached",
    ],
    stretch: [
      "Guard against prompt injection in user messages",
      "Evaluation set covering routing accuracy specifically",
      "Cost and latency tracking per conversation",
    ],
  },
  {
    id: "py-cv-app",
    title: "Computer Vision Application",
    tier: "advanced",
    roadmap: "python",
    blurb:
      "Detection or segmentation on real images. Also, a lesson in how bad your training data is.",
    description:
      "Object detection or segmentation applied to a real problem you pick. The modelling is largely solved by pretrained weights; the work is in your data — annotation quality, class imbalance, and images that look nothing like the training set.",
    time: "1-2 months",
    stack: ["Python", "PyTorch", "OpenCV", "FastAPI"],
    skills: ["deep-learning", "model-evaluation", "model-deployment"],
    features: [
      "Dataset with annotations you gathered or verified",
      "Pretrained detection or segmentation model fine-tuned",
      "Proper evaluation (mAP or IoU, not accuracy)",
      "Inference pipeline on new images",
      "Served behind an API with an image upload",
    ],
    stretch: [
      "Real-time inference on a video stream",
      "Analyse failure cases and improve the data rather than the model",
      "Quantise the model and compare speed against accuracy",
    ],
  },
  {
    id: "py-ml-monitoring",
    title: "ML Monitoring Dashboard",
    tier: "advanced",
    roadmap: "python",
    blurb:
      "Watch your model quietly get worse over time, and catch it before someone else does.",
    description:
      "Log production predictions, track input distributions, detect drift, and surface it on a dashboard. Since true labels usually arrive late or never, you monitor the inputs and the prediction distribution as proxies — which is how it's actually done.",
    time: "3-5 weeks",
    stack: ["Python", "FastAPI", "PostgreSQL", "Streamlit / Plotly"],
    skills: ["mlops", "model-deployment", "statistics"],
    features: [
      "Prediction logging with input features and metadata",
      "Feature distribution comparison against the training set",
      "Drift detection with a statistical test",
      "Alerting when drift crosses a threshold",
      "Dashboard showing volume, latency and distributions over time",
    ],
    stretch: [
      "Delayed label ingestion to compute real accuracy later",
      "Segment metrics by user group to catch fairness issues",
      "Automatic retraining trigger",
    ],
  },
  {
    id: "py-ml-pipeline",
    title: "End-to-End ML Pipeline",
    tier: "pain",
    roadmap: "python",
    blurb:
      "Raw data to deployed model, fully automated, reproducible from a single command.",
    description:
      "Every step wired together: ingestion, validation, preprocessing, training, evaluation, registration and deployment — versioned, tracked, and runnable end to end. It's the project that takes you from 'can train a model' to 'can run an ML system', and it is a lot of unglamorous plumbing.",
    time: "1-3 months",
    stack: ["Python", "MLflow", "Docker", "FastAPI", "PostgreSQL"],
    skills: ["mlops", "model-deployment", "py-testing", "feature-engineering"],
    features: [
      "Data ingestion with schema validation that fails loudly",
      "Reproducible preprocessing and training, seeded",
      "Experiment tracking with metrics and artifacts",
      "Automatic evaluation gate before any deploy",
      "One command runs the whole thing from scratch",
    ],
    stretch: [
      "Scheduled retraining on new data",
      "Champion/challenger comparison before promotion",
      "Full rollback to a previous model version",
    ],
  },
  {
    id: "py-code-assistant",
    title: "Custom Code Assistant Engine",
    tier: "pain",
    roadmap: "python",
    legacyLevel: "Level 3: Advanced",
    blurb:
      "Host a quantized code generation LLM locally and generate clean syntax patches asynchronously.",
    description:
      "Host a quantized code generation LLM locally, parse contextual project files, feed prompt repositories, and generate clean syntax patches asynchronously.",
    time: "1-3 months",
    stack: ["Docker", "vLLM / llama.cpp", "FastAPI", "ChromaDB", "Python"],
    skills: ["local-inference", "rag", "ai-eval", "model-deployment"],
    features: [
      "Local model served with an OpenAI-compatible API",
      "Repository indexing with code-aware chunking",
      "Retrieval of relevant files as context",
      "Patch generation in a structured, applicable format",
      "Async request handling with a queue",
    ],
    stretch: [
      "Evaluate generated patches by actually running the test suite",
      "Compare a quantised local model against a hosted one on the same eval set",
      "Cost analysis: is self-hosting genuinely cheaper here?",
    ],
  },
];

export default projects;
