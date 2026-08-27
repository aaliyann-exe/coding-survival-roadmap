<script setup lang="ts">
import type { Project, ProjectTier } from "@/data/types";
import { useProgress } from "@/composables/useProgress";
import AppIcon from "@/components/ui/AppIcon.vue";

defineProps<{ project: Project }>();
defineEmits<{ select: [project: Project] }>();

const { isProjectDone, toggleProject } = useProgress();

const tierLabel: Record<ProjectTier, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  pain: "Why did I do this to myself?",
};

const trackClass: Record<Project["roadmap"], string> = {
  frontend: "track-frontend",
  backend: "track-backend",
  python: "track-python",
};
</script>

<template>
  <article
    class="group flex h-full flex-col border border-line bg-surface transition-colors hover:border-line-strong"
    :class="[trackClass[project.roadmap], isProjectDone(project.id) ? 'border-emerald-500/40' : '']"
  >
    <button
      type="button"
      class="flex flex-1 flex-col items-start p-5 text-left"
      @click="$emit('select', project)"
    >
      <div class="mb-3 flex w-full items-center gap-2">
        <span
          class="h-1.5 w-1.5 shrink-0"
          style="background-color: rgb(var(--track))"
        />
        <span class="label-mono truncate">{{ tierLabel[project.tier] }}</span>
        <span class="ml-auto shrink-0 font-mono text-[10px] text-faint">{{
          project.time
        }}</span>
      </div>

      <h3 class="mb-2 text-[15px] font-medium leading-snug text-ink">
        {{ project.title }}
      </h3>
      <p class="mb-4 text-[13px] font-light leading-relaxed text-muted">
        {{ project.blurb }}
      </p>

      <div class="mt-auto flex flex-wrap gap-1">
        <span v-for="tech in project.stack.slice(0, 4)" :key="tech" class="chip">{{
          tech
        }}</span>
        <span v-if="project.stack.length > 4" class="chip"
          >+{{ project.stack.length - 4 }}</span
        >
      </div>
    </button>

    <div class="flex items-center justify-between border-t border-line px-5 py-2.5">
      <button
        type="button"
        class="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors"
        :class="
          isProjectDone(project.id)
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-faint hover:text-ink'
        "
        :aria-pressed="isProjectDone(project.id)"
        @click="toggleProject(project.id)"
      >
        <AppIcon :name="isProjectDone(project.id) ? 'check' : 'dot'" :size="12" />
        {{ isProjectDone(project.id) ? "Built it" : "Mark as built" }}
      </button>
      <button
        type="button"
        class="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-faint transition-colors hover:text-ink"
        @click="$emit('select', project)"
      >
        Brief <AppIcon name="arrow-right" :size="11" />
      </button>
    </div>
  </article>
</template>
