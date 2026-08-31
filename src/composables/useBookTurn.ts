/**
 * The page-turn coordinator.
 *
 * Design constraint that drives everything here: the router is never blocked.
 * An earlier idea was to hold navigation in a `beforeEach` guard until the
 * animation finished, but that breaks browser back/forward and makes direct
 * URLs feel broken. Instead the route changes immediately and the *visual*
 * turn is layered over the page block, so history, deep links and the back
 * button all behave exactly as they did before.
 *
 * Only chapter changes turn a page. Opening a node writes `?node=` to the
 * same route, and flipping the whole book for a drawer would be absurd — so
 * the turn keys off the first path segment only.
 */
import { readonly, ref } from "vue";
import type { RouteLocationNormalized } from "vue-router";

export type TurnPhase = "idle" | "turning";

const phase = ref<TurnPhase>("idle");
/** Set while the seal is lit, slightly outlasting the leaf. */
const casting = ref(false);

let timers: number[] = [];

function clearTimers() {
  for (const t of timers) window.clearTimeout(t);
  timers = [];
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** The chapter a route belongs to — its first path segment. */
export function chapterOf(route: RouteLocationNormalized | { path: string }) {
  return route.path.split("/").filter(Boolean)[0] ?? "home";
}

/**
 * Run the turn. Durations are matched to the CSS animations
 * (`leaf-turn` 850ms, `seal-cast` 2s) — the seal is the long beat, so the
 * phase has to outlast it or the spell would be cut off mid-cast.
 */
function start() {
  clearTimers();

  if (prefersReducedMotion()) {
    // Same conceptual beat — the seal is still cast — but nothing large
    // rotates. The leaf is not rendered at all in this mode.
    phase.value = "turning";
    casting.value = true;
    timers.push(window.setTimeout(() => (casting.value = false), 900));
    timers.push(window.setTimeout(() => (phase.value = "idle"), 950));
    return;
  }

  phase.value = "turning";
  casting.value = true;
  timers.push(window.setTimeout(() => (casting.value = false), 2000));
  timers.push(window.setTimeout(() => (phase.value = "idle"), 2060));
}

export function useBookTurn() {
  return {
    phase: readonly(phase),
    casting: readonly(casting),
    start,
    chapterOf,
  };
}
