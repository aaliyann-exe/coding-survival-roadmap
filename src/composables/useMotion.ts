import { onUnmounted, ref } from "vue";

/**
 * Honours prefers-reduced-motion so the roadmap doesn't become a
 * seizure simulator for people who asked it not to be.
 */
export function useReducedMotion() {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = ref(query.matches);

  const onChange = (event: MediaQueryListEvent) => {
    prefersReducedMotion.value = event.matches;
  };
  query.addEventListener("change", onChange);
  onUnmounted(() => query.removeEventListener("change", onChange));

  return { prefersReducedMotion };
}
