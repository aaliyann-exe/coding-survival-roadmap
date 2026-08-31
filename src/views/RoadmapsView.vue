<script setup lang="ts">
import { computed, ref } from "vue";
import projectList from "@/data/projects";
import { useProgress } from "@/composables/useProgress";
import ProgressBar from "@/components/ui/ProgressBar.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import BookSpread from "@/components/book/BookSpread.vue";

const { perRoadmap } = useProgress();

type Filter = "all" | "not-started" | "in-progress" | "completed";

const filter = ref<Filter>("all");
const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "not-started", label: "Not started" },
  { id: "in-progress", label: "In progress" },
  { id: "completed", label: "Completed" },
];

const entries = computed(() =>
  perRoadmap.value.filter((entry) => {
    if (filter.value === "all") return true;
    if (filter.value === "not-started") return entry.completed === 0 && entry.inProgress === 0;
    if (filter.value === "completed") return entry.completed === entry.total;
    return entry.completed > 0 || entry.inProgress > 0;
  }),
);

function projectCount(id: string) {
  return projectList.filter((p) => p.roadmap === id).length;
}
</script>

<template>
  <BookSpread
    eyebrow="Three paths"
    title="Pick one. Finish it. Then pick another."
    folio="Folio II — The Disciplines"
  >
    <template #left>
      <p class="text-[15px] leading-relaxed text-muted">
        Each path is a dependency graph, not a list — you can see what a topic needs
        before it, what it unlocks after it, and how long it realistically takes. Jump
        around if you want, the order is a suggestion with reasons attached.
      </p>
    </template>

    <div class="mb-8 flex flex-wrap items-center gap-2">
      <span class="label-mono mr-1">Filter</span>
      <button
        v-for="f in filters"
        :key="f.id"
        type="button"
        class="filter-tab"
        :aria-pressed="filter === f.id"
        @click="filter = f.id"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="entries.length === 0" class="border border-line bg-raised p-10 text-center">
      <p class="text-sm text-muted">
        Nothing matches that filter yet. Go break something first.
      </p>
    </div>

    <div class="space-y-6">
      <article
        v-for="entry in entries"
        :key="entry.roadmap.id"
        class="border border-line bg-surface"
        :class="entry.roadmap.trackClass"
      >
        <div class="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-10 lg:p-8">
          <div>
            <div class="mb-4 flex items-center gap-3">
              <span class="h-1.5 w-6" style="background-color: rgb(var(--track))" />
              <h2 class="text-2xl font-normal text-ink">{{ entry.roadmap.title }}</h2>
            </div>

            <p class="mb-4 text-[15px] font-light leading-relaxed text-ink/85">
              {{ entry.roadmap.tagline }}
            </p>

            <p class="mb-4 text-[14px] font-light leading-relaxed text-muted">
              {{ entry.roadmap.overview }}
            </p>

            <p class="mb-6 text-[14px] font-light leading-relaxed text-muted">
              {{ entry.roadmap.intro }}
            </p>

            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="stage in entry.roadmap.stages"
                :key="stage.id"
                class="chip"
                >{{ stage.title }}</span
              >
            </div>
          </div>

          <div class="flex flex-col gap-5">
            <dl class="grid grid-cols-2 gap-px border border-line bg-line">
              <div class="bg-surface p-3">
                <dt class="label-mono mb-1">Topics</dt>
                <dd class="font-mono text-base tabular-nums text-ink">
                  {{ entry.total }}
                </dd>
              </div>
              <div class="bg-surface p-3">
                <dt class="label-mono mb-1">Projects</dt>
                <dd class="font-mono text-base tabular-nums text-ink">
                  {{ projectCount(entry.roadmap.id) }}
                </dd>
              </div>
              <div class="bg-surface p-3 col-span-2">
                <dt class="label-mono mb-1">Time</dt>
                <dd class="font-mono text-[13px] text-ink">
                  {{ entry.roadmap.totalTime }}
                </dd>
              </div>
              <div class="bg-surface p-3 col-span-2">
                <dt class="label-mono mb-1">Difficulty</dt>
                <dd class="text-[13px] font-light text-muted">
                  {{ entry.roadmap.difficulty }}
                </dd>
              </div>
            </dl>

            <ProgressBar
              :percent="entry.percent"
              :label="`${entry.completed} of ${entry.total} done`"
            />

            <RouterLink
              :to="`/roadmaps/${entry.roadmap.id}`"
              class="btn btn-primary justify-center py-2.5"
            >
              {{ entry.completed > 0 ? "Continue path" : "Open path" }}
              <AppIcon name="arrow-right" :size="12" />
            </RouterLink>
          </div>
        </div>
      </article>
    </div>
    <p class="folio mt-10 text-right">Folio II</p>
  </BookSpread>
</template>
