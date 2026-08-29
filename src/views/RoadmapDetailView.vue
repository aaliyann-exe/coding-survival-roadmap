<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { RoadmapId, RoadmapNode } from "@/data/types";
import { roadmapById, nodeById } from "@/data/roadmaps";
import projectList from "@/data/projects";
import { useProgress } from "@/composables/useProgress";
import SkillTree from "@/components/roadmap/SkillTree.vue";
import NodeDetail from "@/components/roadmap/NodeDetail.vue";
import NodeProgressControls from "@/components/roadmap/NodeProgressControls.vue";
import ProjectDetail from "@/components/projects/ProjectDetail.vue";
import ManuscriptModal from "@/components/ui/ManuscriptModal.vue";
import ProgressBar from "@/components/ui/ProgressBar.vue";
import AppIcon from "@/components/ui/AppIcon.vue";

const route = useRoute();
const router = useRouter();
const { perRoadmap } = useProgress();

const roadmap = computed(() => roadmapById.get(route.params.id as RoadmapId));

const stats = computed(() =>
  perRoadmap.value.find((entry) => entry.roadmap.id === roadmap.value?.id),
);

/** Mirrors the node states in SkillNode so the tree is readable before you've
 * clicked anything. Each entry carries a rune as well as a colour, because
 * state must never depend on hue alone. */
const legend = [
  { label: "Available", rune: "◆", tone: "text-track" },
  { label: "In progress", rune: "◈", tone: "text-gild" },
  { label: "Done", rune: "❖", tone: "text-seal" },
  { label: "Needs prereqs", rune: "✦", tone: "text-faint/70" },
] as const;

const activeNodeId = computed(() => (route.query.node as string) || null);
const activeNode = computed(() =>
  activeNodeId.value ? (nodeById(activeNodeId.value) ?? null) : null,
);

const activeProjectId = computed(() => (route.query.project as string) || null);
const activeProject = computed(() =>
  activeProjectId.value
    ? (projectList.find((p) => p.id === activeProjectId.value) ?? null)
    : null,
);

function openNode(node: RoadmapNode | string) {
  const id = typeof node === "string" ? node : node.id;
  const target = nodeById(id);
  if (!target) return;
  // A prerequisite can live on another roadmap — follow it there.
  const owner = [...roadmapById.values()].find((r) =>
    r.nodes.some((n) => n.id === id),
  );
  router.push({
    path: `/roadmaps/${owner?.id ?? roadmap.value?.id}`,
    query: { node: id },
  });
}

function openProject(id: string) {
  // Only one drawer at a time — swap the node brief for the project brief.
  router.push({ path: route.path, query: { project: id } });
}

function closeNode() {
  const query = { ...route.query };
  delete query.node;
  router.replace({ path: route.path, query });
}

function closeProject() {
  const query = { ...route.query };
  delete query.project;
  router.replace({ path: route.path, query });
}

// If someone lands on a bad roadmap id, send them to the hub.
watch(
  roadmap,
  (value) => {
    if (!value) router.replace("/roadmaps");
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="roadmap" :class="roadmap.trackClass">
    <!-- Discipline title page: an illuminated opening spread for the school,
         with the register of standing down the outer margin. -->
    <header class="relative border-b-2 border-line bg-raised/50">
      <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <RouterLink
          to="/roadmaps"
          class="mb-8 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-faint transition-colors hover:text-ink"
        >
          <AppIcon name="arrow-left" :size="11" /> All roadmaps
        </RouterLink>

        <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16">
          <div class="relative">
            <!-- discipline insignia: a struck plate carrying the school mark -->
            <div class="mb-6 flex items-center gap-4">
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center border-2 text-lg"
                style="
                  border-color: rgb(var(--track));
                  color: rgb(var(--track));
                  box-shadow: inset 0 0 0 3px rgb(var(--canvas));
                "
                aria-hidden="true"
                >❖</span
              >
              <div class="min-w-0">
                <p
                  class="mb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-faint"
                >
                  Discipline
                </p>
                <h1
                  class="text-3xl leading-none text-ink md:text-[2.6rem]"
                  style="font-family: 'Cinzel', Georgia, serif"
                >
                  {{ roadmap.title }}
                </h1>
              </div>
            </div>

            <div class="ink-rule mb-6 max-w-2xl" aria-hidden="true" />

            <p class="mb-5 max-w-2xl text-[16px] leading-relaxed text-ink/85">
              {{ roadmap.tagline }}
            </p>
            <p class="max-w-2xl text-[15px] leading-relaxed text-muted">
              {{ roadmap.intro }}
            </p>
          </div>

          <!-- register of standing, ruled like a ledger margin -->
          <div v-if="stats" class="lg:border-l-2 lg:border-line/40 lg:pl-6">
            <p class="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
              Standing
            </p>
            <div class="ledger-row">
              <span class="ledger-label">Cleared</span>
              <span class="ledger-rule" aria-hidden="true" />
              <span class="ledger-value text-[13px]"
                >{{ stats.completed }}/{{ stats.total }}</span
              >
            </div>
            <div class="ledger-row">
              <span class="ledger-label">In progress</span>
              <span class="ledger-rule" aria-hidden="true" />
              <span class="ledger-value text-[13px]">{{ stats.inProgress }}</span>
            </div>
            <div class="ledger-row">
              <span class="ledger-label">Trials built</span>
              <span class="ledger-rule" aria-hidden="true" />
              <span class="ledger-value text-[13px]"
                >{{ stats.projectsCompleted }}/{{ stats.projectsTotal }}</span
              >
            </div>
            <div class="mt-4">
              <ProgressBar :percent="stats.percent" :show-value="true" />
            </div>
            <p
              class="mt-4 font-mono text-[10px] uppercase tracking-widest leading-relaxed text-faint"
            >
              {{ roadmap.totalTime }}
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- graph -->
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div
        class="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-line pb-4"
      >
        <p
          class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-faint"
        >
          <AppIcon name="route" :size="12" />
          Click any node for the full brief
        </p>

        <ul
          class="flex flex-wrap items-center gap-x-4 gap-y-2 sm:ml-auto"
          aria-label="What the node states mean"
        >
          <li
            v-for="item in legend"
            :key="item.label"
            class="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-faint"
          >
            <span class="shrink-0 text-[11px] leading-none" :class="item.tone">{{
              item.rune
            }}</span>
            {{ item.label }}
          </li>
        </ul>
      </div>

      <SkillTree
        :roadmap="roadmap"
        :active-id="activeNodeId"
        @select="openNode"
      />
    </div>

    <!-- node drawer -->
    <ManuscriptModal
      :open="Boolean(activeNode)"
      :title="activeNode?.title ?? ''"
      :eyebrow="roadmap.title"
      @close="closeNode"
    >
      <NodeDetail
        v-if="activeNode"
        :node="activeNode"
        @open-node="openNode"
        @open-project="openProject"
      />
      <template #footer>
        <NodeProgressControls v-if="activeNode" :node="activeNode" />
      </template>
    </ManuscriptModal>

    <!-- project drawer -->
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
  </div>
</template>
