<script setup lang="ts">
import { computed } from "vue";
import type { RoadmapNode } from "@/data/types";
import { nodeById, unlockedBy } from "@/data/roadmaps";
import projectList from "@/data/projects";
import { useProgress } from "@/composables/useProgress";
import AppIcon from "@/components/ui/AppIcon.vue";
import ArcaneSigil from "@/components/arcane/ArcaneSigil.vue";
import ResourceCard from "@/components/resources/ResourceCard.vue";

const props = defineProps<{ node: RoadmapNode }>();
const emit = defineEmits<{ openProject: [id: string]; openNode: [id: string] }>();

const { statusOf, isProjectDone } = useProgress();

const status = computed(() => statusOf(props.node));

const prereqs = computed(() =>
  props.node.prerequisites
    .map((id) => nodeById(id))
    .filter((n): n is RoadmapNode => Boolean(n)),
);

const unlocks = computed(() => unlockedBy(props.node.id));

const relatedProjects = computed(() =>
  (props.node.projects ?? [])
    .map((id) => projectList.find((p) => p.id === id))
    .filter((p): p is (typeof projectList)[number] => Boolean(p)),
);

const difficultyLabel = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;
</script>

<template>
  <div class="px-5 py-6 sm:px-7 sm:py-8">
    <!-- The node's own sigil, repeated from the portal so the sheet is
         visibly the record *of that node* rather than a generic dialog. -->
    <div class="mb-5 flex items-center gap-3">
      <span
        class="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-line text-track"
        aria-hidden="true"
      >
        <ArcaneSigil :seed="node.id" :size="17" />
      </span>
      <span class="h-px flex-1 bg-line/40" aria-hidden="true" />
    </div>

    <!-- status + difficulty -->
    <div class="mb-6 flex flex-wrap items-center gap-2">
      <span class="chip">{{ difficultyLabel[node.difficulty] }}</span>
      <span v-if="node.optional" class="chip">Optional detour</span>
      <span
        class="chip"
        :class="
          status === 'completed' || status === 'mastered'
            ? 'chip-sealed'
            : status === 'in-progress'
              ? 'chip-active'
              : ''
        "
      >
        {{
          status === "in-progress"
            ? "In progress"
            : status === "completed"
              ? "Completed"
              : status === "mastered"
                ? "Mastered"
                : status === "locked"
                  ? "Prerequisites pending"
                  : "Available"
        }}
      </span>
    </div>

    <p class="mb-7 text-[15px] font-light leading-relaxed text-muted">
      {{ node.description }}
    </p>

    <!-- why should I care -->
    <section
      class="relative mb-8 border-l-4 bg-sunken/40 py-3 pl-5 pr-4"
      style="border-color: rgb(var(--track) / 0.6)"
    >
      <span
        class="absolute right-3 top-1 font-serif text-4xl leading-none text-track opacity-20"
        style="font-family: 'Cinzel', Georgia, serif"
        aria-hidden="true"
        >”</span
      >
      <h3 class="label-mono mb-2">Why should I care?</h3>
      <p class="relative text-[15px] font-light leading-relaxed text-ink/90">{{ node.why }}</p>
    </section>

    <!-- time -->
    <section class="mb-8">
      <h3 class="rule-heading mb-3">Realistic timeline</h3>
      <dl class="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        <div class="bg-surface p-3">
          <dt class="label-mono mb-1">Basics</dt>
          <dd class="font-mono text-sm text-ink">{{ node.time.basics }}</dd>
        </div>
        <div class="bg-surface p-3">
          <dt class="label-mono mb-1">Useful in projects</dt>
          <dd class="font-mono text-sm text-ink">{{ node.time.useful }}</dd>
        </div>
        <div v-if="node.time.mastery" class="bg-surface p-3">
          <dt class="label-mono mb-1">Deep mastery</dt>
          <dd class="font-mono text-sm text-ink">{{ node.time.mastery }}</dd>
        </div>
      </dl>
      <p class="mt-2 text-2xs leading-relaxed text-faint">
        These assume consistent practice and actually building things. If yours takes
        longer, that's a fact about your week, not about you.
      </p>
    </section>

    <!-- prerequisites -->
    <section v-if="prereqs.length" class="mb-8">
      <h3 class="rule-heading mb-3">Come here after</h3>
      <ul class="space-y-1.5">
        <li v-for="p in prereqs" :key="p.id">
          <button
            type="button"
            class="group flex w-full items-center gap-2 border border-line bg-raised px-3 py-2 text-left transition-colors hover:border-line-strong"
            @click="emit('openNode', p.id)"
          >
            <span
              class="h-1.5 w-1.5 shrink-0"
              :class="
                statusOf(p) === 'completed' || statusOf(p) === 'mastered'
                  ? 'bg-seal'
                  : 'bg-faint/50'
              "
            />
            <span class="min-w-0 flex-1 truncate text-[13px] text-ink">{{ p.title }}</span>
            <AppIcon
              name="arrow-right"
              :size="13"
              class="text-faint transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </li>
      </ul>
    </section>

    <!-- checklist -->
    <section class="mb-8">
      <h3 class="rule-heading mb-3">What you actually need to know</h3>
      <ul class="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
        <li
          v-for="skill in node.skills"
          :key="skill"
          class="flex items-start gap-2 text-[13px] font-light leading-relaxed text-muted"
        >
          <span
            class="mt-[7px] h-1 w-1 shrink-0"
            style="background-color: rgb(var(--track) / 0.7)"
          />
          {{ skill }}
        </li>
      </ul>
    </section>

    <!-- gotchas -->
    <section v-if="node.gotchas?.length" class="mb-8">
      <h3 class="rule-heading mb-3">Things nobody tells you</h3>
      <ul class="space-y-2">
        <li
          v-for="g in node.gotchas"
          :key="g"
          class="border border-line bg-raised px-3.5 py-2.5 text-[13px] font-light leading-relaxed text-muted"
        >
          {{ g }}
        </li>
      </ul>
    </section>

    <!-- projects -->
    <section v-if="relatedProjects.length" class="mb-8">
      <h3 class="rule-heading mb-3">Learn this by building</h3>
      <ul class="space-y-1.5">
        <li v-for="project in relatedProjects" :key="project.id">
          <button
            type="button"
            class="group flex w-full items-center gap-2.5 border border-line bg-raised px-3 py-2.5 text-left transition-colors hover:border-line-strong"
            @click="emit('openProject', project.id)"
          >
            <AppIcon
              :name="isProjectDone(project.id) ? 'check' : 'box'"
              :size="14"
              :class="isProjectDone(project.id) ? 'text-seal' : 'text-faint'"
            />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-[13px] text-ink">{{ project.title }}</span>
              <span class="block truncate text-2xs text-faint">{{ project.time }}</span>
            </span>
            <AppIcon
              name="arrow-right"
              :size="13"
              class="text-faint transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </li>
      </ul>
    </section>

    <!-- resources -->
    <section v-if="node.resources.length" class="mb-8">
      <h3 class="rule-heading mb-3">Resources</h3>
      <div class="space-y-2">
        <ResourceCard
          v-for="resource in node.resources"
          :key="resource.url"
          :resource="resource"
        />
      </div>
    </section>

    <!-- unlocks -->
    <section v-if="unlocks.length" class="mb-2">
      <h3 class="rule-heading mb-3">This unlocks</h3>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="u in unlocks"
          :key="u.id"
          type="button"
          class="chip transition-colors hover:border-line-strong hover:text-ink"
          @click="emit('openNode', u.id)"
        >
          {{ u.title }}
        </button>
      </div>
    </section>
  </div>

</template>
