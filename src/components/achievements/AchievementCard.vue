<script setup lang="ts">
import type { Achievement } from "@/data/types";
import AppIcon from "@/components/ui/AppIcon.vue";

defineProps<{ achievement: Achievement; unlocked: boolean }>();
</script>

<template>
  <div
    class="flex items-start gap-3 border p-4 transition-colors"
    :class="
      unlocked
        ? 'border-emerald-500/35 bg-emerald-500/[0.04]'
        : 'border-line bg-raised'
    "
  >
    <span
      class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border"
      :class="
        unlocked
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'border-line text-faint'
      "
    >
      <AppIcon :name="unlocked ? achievement.icon : 'lock'" :size="15" />
    </span>
    <div class="min-w-0">
      <h3
        class="text-[14px] font-medium leading-snug"
        :class="unlocked ? 'text-ink' : 'text-muted'"
      >
        {{ achievement.title }}
      </h3>
      <p class="mt-1 text-[12.5px] font-light leading-relaxed text-muted">
        {{ unlocked ? achievement.description : achievement.hint }}
      </p>
    </div>
  </div>
</template>
