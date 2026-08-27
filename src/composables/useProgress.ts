import { computed, reactive, watch } from "vue";
import type { NodeStatus, RoadmapId, RoadmapNode } from "@/data/types";
import { allNodes, nodeIndex, roadmaps } from "@/data/roadmaps";
import projects from "@/data/projects";

const STORAGE_KEY = "roadmap-progress-v2";
const LEGACY_KEY = "roadmap-completed-steps";

type TopicState = "in-progress" | "completed" | "mastered";

interface ProgressState {
  topics: Record<string, TopicState>;
  projects: Record<string, true>;
  /** ISO dates (YYYY-MM-DD) on which anything was marked. Newest last. */
  activeDays: string[];
}

const state = reactive<ProgressState>({
  topics: {},
  projects: {},
  activeDays: [],
});

let initialised = false;

const today = () => new Date().toISOString().slice(0, 10);

function daysBetween(a: string, b: string) {
  const ms = new Date(b + "T00:00:00Z").getTime() - new Date(a + "T00:00:00Z").getTime();
  return Math.round(ms / 86_400_000);
}

function load() {
  if (initialised) return;
  initialised = true;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ProgressState>;
      if (parsed.topics) Object.assign(state.topics, parsed.topics);
      if (parsed.projects) Object.assign(state.projects, parsed.projects);
      if (Array.isArray(parsed.activeDays)) state.activeDays = parsed.activeDays;
    } else {
      migrateLegacy();
    }
  } catch {
    // A corrupt blob shouldn't take the whole site down. Start clean.
  }

  watch(
    state,
    () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Storage full or blocked (private mode). Progress just won't persist.
      }
    },
    { deep: true },
  );
}

/**
 * The first version of this site stored completions keyed by topic title.
 * Several of those topics still exist under the same title, so carry them over
 * instead of wiping someone's progress during the revamp.
 */
function migrateLegacy() {
  const raw = localStorage.getItem(LEGACY_KEY);
  if (!raw) return;
  try {
    const old = JSON.parse(raw) as Record<string, boolean>;
    const byTitle = new Map(allNodes.map((n) => [n.title, n.id]));
    for (const [title, done] of Object.entries(old)) {
      const id = byTitle.get(title);
      if (done && id) state.topics[id] = "completed";
    }
  } catch {
    // Old data was malformed. Nothing to migrate.
  }
}

function touchToday() {
  const day = today();
  if (state.activeDays[state.activeDays.length - 1] === day) return;
  state.activeDays.push(day);
  if (state.activeDays.length > 400) state.activeDays.splice(0, state.activeDays.length - 400);
}

// ---------------------------------------------------------------- selectors

const completedNodeIds = computed(
  () =>
    new Set(
      Object.entries(state.topics)
        .filter(([, s]) => s === "completed" || s === "mastered")
        .map(([id]) => id),
    ),
);

const startedNodeIds = computed(
  () =>
    new Set(
      Object.entries(state.topics)
        .filter(([, s]) => s === "in-progress")
        .map(([id]) => id),
    ),
);

const completedProjectIds = computed(() => new Set(Object.keys(state.projects)));

function statusOf(node: RoadmapNode): NodeStatus {
  const explicit = state.topics[node.id];
  if (explicit === "mastered") return "mastered";
  if (explicit === "completed") return "completed";
  if (explicit === "in-progress") return "in-progress";
  const unlocked = node.prerequisites.every((p) => completedNodeIds.value.has(p));
  return unlocked ? "available" : "locked";
}

const streak = computed(() => {
  const days = state.activeDays;
  if (days.length === 0) return 0;
  const last = days[days.length - 1];
  const gap = daysBetween(last, today());
  // A streak survives "yesterday" so you don't lose it before the day is over.
  if (gap > 1) return 0;
  let count = 1;
  for (let i = days.length - 1; i > 0; i--) {
    if (daysBetween(days[i - 1], days[i]) === 1) count++;
    else break;
  }
  return count;
});

const longestStreak = computed(() => {
  const days = state.activeDays;
  let best = 0;
  let run = 0;
  for (let i = 0; i < days.length; i++) {
    run = i > 0 && daysBetween(days[i - 1], days[i]) === 1 ? run + 1 : 1;
    if (run > best) best = run;
  }
  return best;
});

/**
 * A rough study-hour estimate derived from each topic's "useful in projects"
 * range, assuming the pace those ranges are written for (~1.5 focused hours a
 * day). It's an estimate and the UI says so — it is not a stopwatch.
 */
function estimatedHours(node: RoadmapNode): number {
  const text = node.time.useful || node.time.basics;
  const numbers = text.match(/\d+/g);
  if (!numbers) return 0;
  const values = numbers.map(Number);
  const mid = values.reduce((a, b) => a + b, 0) / values.length;
  const unit = /month/i.test(text) ? 30 : /week/i.test(text) ? 7 : 1;
  return Math.round(mid * unit * 1.5);
}

const totalEstimatedHours = computed(() =>
  allNodes
    .filter((n) => completedNodeIds.value.has(n.id))
    .reduce((sum, n) => sum + estimatedHours(n), 0),
);

const perRoadmap = computed(() =>
  roadmaps.map((roadmap) => {
    const total = roadmap.nodes.length;
    const completed = roadmap.nodes.filter((n) =>
      completedNodeIds.value.has(n.id),
    ).length;
    const inProgress = roadmap.nodes.filter((n) =>
      startedNodeIds.value.has(n.id),
    ).length;
    const roadmapProjects = projects.filter((p) => p.roadmap === roadmap.id);
    return {
      roadmap,
      total,
      completed,
      inProgress,
      percent: total ? Math.round((completed / total) * 100) : 0,
      projectsTotal: roadmapProjects.length,
      projectsCompleted: roadmapProjects.filter((p) =>
        completedProjectIds.value.has(p.id),
      ).length,
    };
  }),
);

const overallPercent = computed(() =>
  allNodes.length
    ? Math.round((completedNodeIds.value.size / allNodes.length) * 100)
    : 0,
);

const skillLevel = computed(() => {
  const done = completedNodeIds.value.size;
  if (done === 0) return "Not started";
  if (done < 6) return "Just arrived";
  if (done < 15) return "Dangerous with a tutorial";
  if (done < 30) return "Builds things that work";
  if (done < 50) return "Knows why it works";
  if (done < 70) return "Genuinely competent";
  return "Reads the docs for fun";
});

/** The next topic worth starting, based on prerequisites and roadmap order. */
const nextUp = computed(() => {
  const inProgress = allNodes.find((n) => startedNodeIds.value.has(n.id));
  if (inProgress) {
    return { node: inProgress, reason: "in-progress" as const };
  }
  const available = allNodes
    .filter((n) => statusOf(n) === "available" && !n.optional)
    .sort((a, b) => a.row - b.row);
  const preferred =
    available.find((n) => {
      const entry = nodeIndex.get(n.id);
      if (!entry) return false;
      const started = entry.roadmap.nodes.some(
        (x) => completedNodeIds.value.has(x.id) || startedNodeIds.value.has(x.id),
      );
      return started;
    }) ?? available[0];
  return preferred ? { node: preferred, reason: "available" as const } : null;
});

// ------------------------------------------------------------------ actions

function setTopic(id: string, next: TopicState | null) {
  if (next === null) delete state.topics[id];
  else state.topics[id] = next;
  touchToday();
}

function startTopic(id: string) {
  setTopic(id, "in-progress");
}

function completeTopic(id: string) {
  setTopic(id, "completed");
}

function masterTopic(id: string) {
  setTopic(id, "mastered");
}

function resetTopic(id: string) {
  setTopic(id, null);
}

function cycleTopic(id: string) {
  const current = state.topics[id];
  if (!current) startTopic(id);
  else if (current === "in-progress") completeTopic(id);
  else if (current === "completed") masterTopic(id);
  else resetTopic(id);
}

function toggleProject(id: string) {
  if (state.projects[id]) delete state.projects[id];
  else state.projects[id] = true;
  touchToday();
}

function isProjectDone(id: string) {
  return Boolean(state.projects[id]);
}

function resetEverything() {
  state.topics = {};
  state.projects = {};
  state.activeDays = [];
}

const completedByRoadmap = computed(() => {
  const out = {} as Record<RoadmapId, number>;
  for (const r of roadmaps) {
    out[r.id] = r.nodes.filter((n) => completedNodeIds.value.has(n.id)).length;
  }
  return out;
});

const totalByRoadmap = computed(() => {
  const out = {} as Record<RoadmapId, number>;
  for (const r of roadmaps) out[r.id] = r.nodes.length;
  return out;
});

export function useProgress() {
  load();
  return {
    state,
    completedNodeIds,
    startedNodeIds,
    completedProjectIds,
    completedByRoadmap,
    totalByRoadmap,
    statusOf,
    streak,
    longestStreak,
    totalEstimatedHours,
    estimatedHours,
    perRoadmap,
    overallPercent,
    skillLevel,
    nextUp,
    startTopic,
    completeTopic,
    masterTopic,
    resetTopic,
    cycleTopic,
    toggleProject,
    isProjectDone,
    resetEverything,
  };
}
