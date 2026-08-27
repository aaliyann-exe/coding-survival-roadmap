<script setup lang="ts">
import { watch } from "vue";
import { useAchievements } from "@/composables/useAchievements";
import AppIcon from "@/components/ui/AppIcon.vue";

const { queue, dismiss } = useAchievements();

// Auto-dismiss so celebrations don't become clutter.
watch(
  queue,
  (list) => {
    for (const achievement of list) {
      window.setTimeout(() => dismiss(achievement.id), 6000);
    }
  },
  { deep: true },
);
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
            class="-mr-1 -mt-1 p-1 text-faint transition-colors hover:text-ink"
            aria-label="Dismiss"
            @click="dismiss(achievement.id)"
          >
            <AppIcon name="close" :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
