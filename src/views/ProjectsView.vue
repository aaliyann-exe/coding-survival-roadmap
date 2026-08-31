<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Project, ProjectTier, RoadmapId } from "@/data/types";
import projectList from "@/data/projects";
import { roadmaps, nodeById } from "@/data/roadmaps";
import { useProgress } from "@/composables/useProgress";
import ProjectCard from "@/components/projects/ProjectCard.vue";
import ProjectDetail from "@/components/projects/ProjectDetail.vue";
import ManuscriptModal from "@/components/ui/ManuscriptModal.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import BookSpread from "@/components/book/BookSpread.vue";

const route = useRoute();
const router = useRouter();
const { completedProjectIds } = useProgress();

const tierOrder: ProjectTier[] = ["beginner", "intermediate", "advanced", "pain"];
const tierLabel: Record<ProjectTier, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  pain: "Why did I do this to myself?",
};

/** The filter row needs something that fits on one line — the full "pain"
 * label is four words long and wrapped the whole row onto three. */
const tierShortLabel: Record<ProjectTier, string> = {
  ...tierLabel,
  pain: "Pain",
};

const activeTrack = ref<RoadmapId | "all">("all");
const activeTier = ref<ProjectTier | "all">("all");
const activeStatus = ref<"all" | "todo" | "done">("all");
const search = ref("");

const filtered = computed(() =>
  projectList.filter((p) => {
    if (activeTrack.value !== "all" && p.roadmap !== activeTrack.value) return false;
    if (activeTier.value !== "all" && p.tier !== activeTier.value) return false;
    if (activeStatus.value === "todo" && completedProjectIds.value.has(p.id)) return false;
    if (activeStatus.value === "done" && !completedProjectIds.value.has(p.id)) return false;
    const q = search.value.trim().toLowerCase();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.blurb.toLowerCase().includes(q) ||
      p.stack.some((s) => s.toLowerCase().includes(q))
    );
  }),
);

const grouped = computed(() =>
  tierOrder
    .map((tier) => ({ tier, items: filtered.value.filter((p) => p.tier === tier) }))
    .filter((group) => group.items.length > 0),
);

const activeProject = computed(() => {
  const id = route.query.project as string | undefined;
  return id ? (projectList.find((p) => p.id === id) ?? null) : null;
});

function openProject(project: Project) {
  router.push({ path: route.path, query: { ...route.query, project: project.id } });
}

function closeProject() {
  const query = { ...route.query };
  delete query.project;
  router.replace({ path: route.path, query });
}

function openNode(id: string) {
  const node = nodeById(id);
  if (!node) return;
  const owner = roadmaps.find((r) => r.nodes.some((n) => n.id === id));
  router.push({ path: `/roadmaps/${owner?.id}`, query: { node: id } });
}

function surpriseMe() {
  const pool = filtered.value.length ? filtered.value : projectList;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  openProject(pick);
}

function resetFilters() {
  activeTrack.value = "all";
  activeTier.value = "all";
  activeStatus.value = "all";
  search.value = "";
}
</script>

<template>
  <BookSpread
    eyebrow="The library"
    title="DO THE PROJECTS LAZMI"
    folio="Folio III — Quest Records"
  >
    <template #left>
      <p class="mb-6 text-[15px] leading-relaxed text-muted">
        {{ projectList.length }} briefs, ordered by how much they'll hurt. Each one
        lists what to build, what it exercises, and stretch goals for when the basic
        version stops being interesting. Pick one you'd actually use.
      </p>
      <button type="button" class="btn w-full justify-center py-2.5" @click="surpriseMe">
        <AppIcon name="spark" :size="12" /> I'm bored, give me something to build
      </button>
      <p class="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
        {{ filtered.length }} of {{ projectList.length }} shown
      </p>
    </template>

    <!-- filters -->
    <div class="mb-10 space-y-4 border border-line bg-raised/50 p-4 sm:p-5">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span class="label-mono w-16 shrink-0">Track</span>
        <button
          type="button"
          class="filter-tab"
          :aria-pressed="activeTrack === 'all'"
          @click="activeTrack = 'all'"
        >
          All
        </button>
        <button
          v-for="r in roadmaps"
          :key="r.id"
          type="button"
          class="filter-tab"
          :class="r.trackClass"
          :aria-pressed="activeTrack === r.id"
          @click="activeTrack = r.id"
        >
          {{ r.short }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span class="label-mono w-16 shrink-0">Level</span>
        <button
          type="button"
          class="filter-tab"
          :aria-pressed="activeTier === 'all'"
          @click="activeTier = 'all'"
        >
          All
        </button>
        <button
          v-for="tier in tierOrder"
          :key="tier"
          type="button"
          class="filter-tab"
          :aria-pressed="activeTier === tier"
          @click="activeTier = tier"
        >
          {{ tierShortLabel[tier] }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span class="label-mono w-16 shrink-0">Status</span>
        <button
          v-for="s in (['all', 'todo', 'done'] as const)"
          :key="s"
          type="button"
          class="filter-tab"
          :aria-pressed="activeStatus === s"
          @click="activeStatus = s"
        >
          {{ s === "all" ? "All" : s === "todo" ? "Not built" : "Built" }}
        </button>

        <label class="ml-auto flex min-h-[2.25rem] min-w-[180px] flex-1 items-center gap-2 border border-line bg-surface px-3 focus-within:border-line-strong sm:max-w-xs">
          <AppIcon name="search" :size="13" class="text-faint" />
          <input
            v-model="search"
            type="search"
            placeholder="Filter by name or stack…"
            class="w-full bg-transparent py-2 text-[13px] text-ink outline-none placeholder:text-faint"
            aria-label="Filter projects"
          />
        </label>
      </div>
    </div>

    <!-- results -->
    <p class="mb-6 font-mono text-[10px] uppercase tracking-widest text-faint">
      {{ filtered.length }} project{{ filtered.length === 1 ? "" : "s" }}
    </p>

    <div v-if="filtered.length === 0" class="border border-line bg-raised p-12 text-center">
      <p class="mb-4 text-sm text-muted">
        Nothing found. Either you discovered a new technology or you typed it wrong.
      </p>
      <button type="button" class="btn" @click="resetFilters">
        <AppIcon name="reset" :size="12" /> Clear filters
      </button>
    </div>

    <div v-else class="space-y-14">
      <section v-for="group in grouped" :key="group.tier">
        <div class="section-head">
          <h2>{{ tierLabel[group.tier] }}</h2>
          <span class="section-rule" aria-hidden="true" />
          <span class="section-count">{{ group.items.length }}</span>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            v-for="project in group.items"
            :key="project.id"
            :project="project"
            @select="openProject"
          />
        </div>
      </section>
    </div>

    <ManuscriptModal
      :open="Boolean(activeProject)"
      :title="activeProject?.title ?? ''"
      eyebrow="Project brief"
      @close="closeProject"
    >
      <ProjectDetail
        v-if="activeProject"
        :project="activeProject"
        @open-node="openNode"
      />
    </ManuscriptModal>
    <p class="folio mt-10 text-right">Folio III</p>
  </BookSpread>
</template>
