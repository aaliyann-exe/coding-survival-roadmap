import type { Achievement } from "./types";

const countIn = (set: Set<string>, ids: string[]) =>
  ids.reduce((n, id) => n + (set.has(id) ? 1 : 0), 0);

const allIn = (set: Set<string>, ids: string[]) => ids.every((id) => set.has(id));

const API_PROJECTS = [
  "be-rest-api",
  "be-url-shortener",
  "be-auth-api",
  "be-blog-api",
  "be-postgres-api",
  "be-ecommerce-api",
  "py-model-api",
];

const PY_CORE = [
  "py-syntax",
  "py-functions",
  "py-env",
  "py-oop",
  "py-errors",
  "py-idioms",
];

const FE_CORE = [
  "html",
  "css",
  "layout-systems",
  "js-core",
  "js-essentials",
  "js-async",
  "typescript",
];

const GO_CORE = [
  "go-syntax",
  "go-packages",
  "go-structs",
  "go-interfaces",
  "go-errors",
  "go-testing",
];

const achievements: Achievement[] = [
  {
    id: "first-blood",
    title: "First Blood",
    description: "You marked your first topic as done. It counts. It all counts.",
    hint: "Complete any topic",
    icon: "spark",
    condition: (c) => c.completedNodes.size >= 1,
  },
  {
    id: "ground-floor",
    title: "Ground Floor Cleared",
    description:
      "You did the boring foundational stuff instead of skipping straight to the framework. Genuinely rare.",
    hint: "Complete How The Web Works, Git and DevTools",
    icon: "layers",
    condition: (c) => allIn(c.completedNodes, ["how-web-works", "git", "devtools"]),
  },
  {
    id: "it-works",
    title: "It Works On My Machine",
    description:
      "First project finished. It probably has three bugs you haven't found yet, and that's fine.",
    hint: "Complete any project",
    icon: "box",
    condition: (c) => c.completedProjects.size >= 1,
  },
  {
    id: "touch-grass",
    title: "Touch Grass",
    description:
      "Ten topics deep. Go outside for twenty minutes, the roadmap will still be here.",
    hint: "Complete 10 topics",
    icon: "leaf",
    condition: (c) => c.completedNodes.size >= 10,
  },
  {
    id: "dependency-enjoyer",
    title: "Dependency Enjoyer",
    description:
      "You learned package management, which means you now understand why node_modules is like that.",
    hint: "Complete a package / environment topic",
    icon: "package",
    condition: (c) =>
      countIn(c.completedNodes, ["build-tools", "go-packages", "py-env"]) >= 1,
  },
  {
    id: "fewer-explosions",
    title: "Fewer Mysterious Explosions",
    description:
      "TypeScript done. Your errors have relocated from 3am in production to 3pm in your editor.",
    hint: "Complete TypeScript",
    icon: "shield",
    condition: (c) => c.completedNodes.has("typescript"),
  },
  {
    id: "api-goblin",
    title: "API Goblin",
    description: "Three APIs built. You dream in status codes now.",
    hint: "Complete 3 API projects",
    icon: "server",
    condition: (c) => countIn(c.completedProjects, API_PROJECTS) >= 3,
  },
  {
    id: "sql-survivor",
    title: "SQL Survivor",
    description:
      "Database fundamentals done. You will never write NULL = NULL again.",
    hint: "Complete SQL and PostgreSQL",
    icon: "database",
    condition: (c) => allIn(c.completedNodes, ["sql", "postgres"]),
  },
  {
    id: "concurrency-brain",
    title: "Concurrency Brain Damage",
    description:
      "Goroutines, channels and context. You've seen a deadlock and lived to tell about it.",
    hint: "Complete the Go concurrency core",
    icon: "shuffle",
    condition: (c) =>
      allIn(c.completedNodes, ["goroutines", "channels", "sync-context"]),
  },
  {
    id: "python-wrangler",
    title: "Python Wrangler",
    description:
      "Python fundamentals complete. Mutable default arguments can no longer hurt you.",
    hint: "Complete the Python fundamentals stage",
    icon: "terminal",
    condition: (c) => allIn(c.completedNodes, PY_CORE),
  },
  {
    id: "frontend-menace",
    title: "Frontend Menace",
    description:
      "HTML through TypeScript, all of it. You can build things people can actually use now.",
    hint: "Complete the frontend core",
    icon: "browser",
    condition: (c) => allIn(c.completedNodes, FE_CORE),
  },
  {
    id: "backend-gremlin",
    title: "Backend Gremlin",
    description:
      "Go fundamentals done, interfaces and all. if err != nil is muscle memory now.",
    hint: "Complete the Go fundamentals",
    icon: "cpu",
    condition: (c) => allIn(c.completedNodes, GO_CORE),
  },
  {
    id: "ml-victim",
    title: "Machine Learning Victim",
    description:
      "You started ML. Somewhere a dataset is already lying to you and you don't know it yet.",
    hint: "Start Machine Learning Fundamentals",
    icon: "scatter",
    condition: (c) =>
      c.startedNodes.has("ml-fundamentals") ||
      c.completedNodes.has("ml-fundamentals"),
  },
  {
    id: "touching-production",
    title: "Touching Production",
    description:
      "You deployed something. It has a URL. Strangers could theoretically break it.",
    hint: "Complete a deployment topic",
    icon: "rocket",
    condition: (c) =>
      countIn(c.completedNodes, [
        "deployment",
        "deploy-cloud",
        "model-deployment",
      ]) >= 1,
  },
  {
    id: "project-machine",
    title: "Project Machine",
    description:
      "Five projects done. You are officially past the tutorial trap. This is the hard part and you cleared it.",
    hint: "Complete 5 projects",
    icon: "grid",
    condition: (c) => c.completedProjects.size >= 5,
  },
  {
    id: "not-a-vibe-coder",
    title: "Certified Non-Vibe-Coder",
    description:
      "Twenty-five topics, learned properly. Your seniors were right and you actually listened.",
    hint: "Complete 25 topics",
    icon: "check",
    condition: (c) => c.completedNodes.size >= 25,
  },
  {
    id: "halfway",
    title: "Halfway There",
    description: "Fifty percent of a whole roadmap. The second half goes faster. Usually.",
    hint: "Reach 50% on any roadmap",
    icon: "half",
    condition: (c) =>
      (Object.keys(c.completedByRoadmap) as (keyof typeof c.completedByRoadmap)[]).some(
        (id) =>
          c.totalByRoadmap[id] > 0 &&
          c.completedByRoadmap[id] / c.totalByRoadmap[id] >= 0.5,
      ),
  },
  {
    id: "absolute-unit",
    title: "Absolute Unit",
    description:
      "An entire roadmap, finished. Genuinely, most people do not get here. Go tell someone.",
    hint: "Complete every topic in one roadmap",
    icon: "trophy",
    condition: (c) =>
      (Object.keys(c.completedByRoadmap) as (keyof typeof c.completedByRoadmap)[]).some(
        (id) =>
          c.totalByRoadmap[id] > 0 &&
          c.completedByRoadmap[id] === c.totalByRoadmap[id],
      ),
  },
  {
    id: "week-one",
    title: "One Week Strong",
    description:
      "Seven days in a row. Consistency beats intensity every single time, this is the proof.",
    hint: "Keep a 7 day streak",
    icon: "flame",
    condition: (c) => c.streak >= 7,
  },
  {
    id: "consistency-gremlin",
    title: "Consistency Gremlin",
    description:
      "Fourteen days straight. At this point it's a habit, not a phase.",
    hint: "Keep a 14 day streak",
    icon: "flame",
    condition: (c) => c.streak >= 14,
  },
];

export default achievements;
