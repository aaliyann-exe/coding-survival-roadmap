import { computed, ref, watch } from "vue";
import achievements from "@/data/achievements";
import type { Achievement } from "@/data/types";
import { useProgress } from "./useProgress";

const SEEN_KEY = "roadmap-achievements-seen";

const seen = ref<string[]>([]);
const queue = ref<Achievement[]>([]);
let initialised = false;

export function useAchievements() {
  const {
    completedNodeIds,
    startedNodeIds,
    completedProjectIds,
    completedByRoadmap,
    totalByRoadmap,
    streak,
  } = useProgress();

  const unlocked = computed(() => {
    const ctx = {
      completedNodes: completedNodeIds.value,
      startedNodes: startedNodeIds.value,
      completedProjects: completedProjectIds.value,
      completedByRoadmap: completedByRoadmap.value,
      totalByRoadmap: totalByRoadmap.value,
      streak: streak.value,
    };
    return achievements.filter((a) => a.condition(ctx));
  });

  const locked = computed(() => {
    const ids = new Set(unlocked.value.map((a) => a.id));
    return achievements.filter((a) => !ids.has(a.id));
  });

  if (!initialised) {
    initialised = true;
    try {
      const raw = localStorage.getItem(SEEN_KEY);
      if (raw) seen.value = JSON.parse(raw) as string[];
    } catch {
      seen.value = [];
    }

    // Anything already earned on first load is treated as seen, so refreshing
    // the page doesn't fire twenty toasts at once.
    if (seen.value.length === 0 && unlocked.value.length > 0) {
      seen.value = unlocked.value.map((a) => a.id);
    }

    watch(
      unlocked,
      (list) => {
        const fresh = list.filter((a) => !seen.value.includes(a.id));
        if (fresh.length === 0) return;
        queue.value.push(...fresh);
        seen.value = [...seen.value, ...fresh.map((a) => a.id)];
        try {
          localStorage.setItem(SEEN_KEY, JSON.stringify(seen.value));
        } catch {
          // Not being able to remember is annoying, not fatal.
        }
      },
      { flush: "post" },
    );
  }

  function dismiss(id: string) {
    queue.value = queue.value.filter((a) => a.id !== id);
  }

  return { achievements, unlocked, locked, queue, dismiss };
}
