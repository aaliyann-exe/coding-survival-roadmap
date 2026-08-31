<script setup lang="ts">
import { onUnmounted, watch } from "vue";
import { useAchievements } from "@/composables/useAchievements";
import AppIcon from "@/components/ui/AppIcon.vue";

const { queue, dismiss } = useAchievements();

const VISIBLE_MS = 6000;

/**
 * Auto-dismiss so celebrations don't become clutter.
 *
 * One timer per achievement, tracked by id. The previous version scheduled a
 * timeout for every item in the queue on every change to the queue — so
 * unlocking a second achievement, or dismissing one by hand, gave everything
 * still on screen an extra timer, and those fired against ids that were
 * already gone.
 */
const timers = new Map<string, number>();

watch(
  queue,
  (list) => {
    for (const achievement of list) {
      if (timers.has(achievement.id)) continue;
      timers.set(
        achievement.id,
        window.setTimeout(() => dismiss(achievement.id), VISIBLE_MS),
      );
    }
    // Anything dismissed by hand no longer needs its timer.
    for (const [id, timer] of timers) {
      if (list.some((a) => a.id === id)) continue;
      window.clearTimeout(timer);
      timers.delete(id);
    }
  },
  { deep: true },
);

onUnmounted(() => {
  for (const timer of timers.values()) window.clearTimeout(timer);
  timers.clear();
});
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed bottom-4 right-4 z-[130] flex w-[min(340px,calc(100vw-2rem))] flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-3 opacity-0"
        leave-active-class="transition duration-200 ease-in absolute"
        leave-to-class="translate-x-4 opacity-0"
      >
        <div
          v-for="achievement in queue"
          :key="achievement.id"
          class="pointer-events-auto flex items-start gap-3 border border-line bg-surface p-4 shadow-lift"
        >
          <span
            class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border"
            style="
              border-color: rgb(var(--track) / 0.4);
              background-color: rgb(var(--track) / 0.1);
              color: rgb(var(--track));
            "
          >
            <AppIcon :name="achievement.icon" :size="16" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="label-mono mb-1">Achievement unlocked</p>
            <p class="text-sm font-medium text-ink">{{ achievement.title }}</p>
            <p class="mt-1 text-[12px] font-light leading-relaxed text-muted">
              {{ achievement.description }}
            </p>
          </div>
          <button
            type="button"
            class="-mr-2 -mt-2 flex h-9 w-9 shrink-0 items-center justify-center text-faint transition-colors hover:text-ink"
            :aria-label="`Dismiss ${achievement.title}`"
            @click="dismiss(achievement.id)"
          >
            <AppIcon name="close" :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
