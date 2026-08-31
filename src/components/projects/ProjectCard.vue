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
  <!--
    The card body is not itself a button. It used to be, with the title,
    blurb and stack chips inside it — a heading and paragraphs inside a
    <button> is invalid, and it also meant a screen reader read the entire
    card out as one long button label.

    Instead the markup stays semantic and the "Brief" button in the footer is
    stretched over the whole card by a ::before. The button itself is left
    statically positioned on purpose, so `inset-0` resolves against the
    <article> rather than the button. One focus stop, one announced name, the
    whole card still clickable — and "mark as built" is lifted above that
    layer with z-10 so it stays hittable.
  -->
  <article
    class="relative corner-frame group flex h-full flex-col border-2 border-line bg-surface transition-colors hover:border-[rgb(var(--track))]"
    :class="[trackClass[project.roadmap], isProjectDone(project.id) ? 'border-seal/60' : '']"
  >
    <div class="flex flex-1 flex-col p-5">
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
    </div>

    <div class="flex items-center justify-between gap-2 border-t border-line px-5">
      <button
        type="button"
        class="relative z-10 -ml-1 flex min-h-[44px] items-center gap-1.5 px-1 font-mono text-[10px] uppercase tracking-widest transition-colors"
        :class="
          isProjectDone(project.id) ? 'text-seal' : 'text-faint hover:text-ink'
        "
        :aria-label="`Mark ${project.title} as built`"
        :aria-pressed="isProjectDone(project.id)"
        @click="toggleProject(project.id)"
      >
        <AppIcon :name="isProjectDone(project.id) ? 'check' : 'dot'" :size="12" />
        {{ isProjectDone(project.id) ? "Built it" : "Mark as built" }}
      </button>

      <button
        type="button"
        class="-mr-1 flex min-h-[44px] items-center gap-1 px-1 font-mono text-[10px] uppercase tracking-widest text-faint transition-colors before:absolute before:inset-0 before:content-[''] hover:text-ink"
        :aria-label="`Read the brief for ${project.title}`"
        @click="$emit('select', project)"
      >
        Brief <AppIcon name="arrow-right" :size="11" />
      </button>
    </div>
  </article>
</template>
