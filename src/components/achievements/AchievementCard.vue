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
        ? 'relative corner-frame border-emerald-600/50 bg-emerald-500/[0.05]'
        : 'border-line border-dashed bg-raised opacity-80'
    "
  >
    <span
      class="wax-seal mt-0.5 shrink-0"
      :class="
        unlocked
          ? 'border-emerald-600/60 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
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
