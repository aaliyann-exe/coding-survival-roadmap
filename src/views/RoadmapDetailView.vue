<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { RoadmapId, RoadmapNode } from "@/data/types";
import { roadmapById, nodeById } from "@/data/roadmaps";
import projectList from "@/data/projects";
import { useProgress } from "@/composables/useProgress";
import RoadmapGraph from "@/components/roadmap/RoadmapGraph.vue";
import NodeDetail from "@/components/roadmap/NodeDetail.vue";
import NodeProgressControls from "@/components/roadmap/NodeProgressControls.vue";
import ProjectDetail from "@/components/projects/ProjectDetail.vue";
import BaseDrawer from "@/components/ui/BaseDrawer.vue";
import ProgressBar from "@/components/ui/ProgressBar.vue";
import AppIcon from "@/components/ui/AppIcon.vue";

const route = useRoute();
const router = useRouter();
const { perRoadmap } = useProgress();

const roadmap = computed(() => roadmapById.get(route.params.id as RoadmapId));

const stats = computed(() =>
  perRoadmap.value.find((entry) => entry.roadmap.id === roadmap.value?.id),
);

/** Mirrors the status colours in RoadmapNodeCard so the map is readable
 * before you've clicked anything. */
const legend = [
  { label: "Available", dot: "bg-faint" },
  { label: "In progress", dot: "bg-amber-500" },
  { label: "Done", dot: "bg-emerald-500" },
  { label: "Needs prereqs", dot: "border border-dashed border-faint/70" },
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
    <!-- header -->
    <header class="border-b border-line bg-raised/40">
      <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <RouterLink
          to="/roadmaps"
          class="mb-6 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-faint transition-colors hover:text-ink"
        >
          <AppIcon name="arrow-left" :size="11" /> All roadmaps
        </RouterLink>

        <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
          <div>
            <div class="mb-4 flex items-center gap-3">
              <span class="h-1.5 w-8" style="background-color: rgb(var(--track))" />
              <h1
                class="text-3xl font-light leading-tight tracking-tight text-ink md:text-4xl"
              >
                {{ roadmap.title }}
              </h1>
            </div>
            <p class="mb-5 max-w-2xl text-[15px] font-light leading-relaxed text-ink/85">
              {{ roadmap.tagline }}
            </p>
            <p class="max-w-2xl text-[14px] font-light leading-relaxed text-muted">
              {{ roadmap.intro }}
            </p>
          </div>

          <div v-if="stats" class="flex flex-col justify-center gap-4">
            <ProgressBar
              :percent="stats.percent"
              :label="`${stats.completed} of ${stats.total} topics`"
            />
            <dl class="grid grid-cols-2 gap-px border border-line bg-line">
              <div class="bg-surface p-3">
                <dt class="label-mono mb-1">In progress</dt>
                <dd class="font-mono text-base tabular-nums text-ink">
                  {{ stats.inProgress }}
                </dd>
              </div>
              <div class="bg-surface p-3">
                <dt class="label-mono mb-1">Projects</dt>
                <dd class="font-mono text-base tabular-nums text-ink">
                  {{ stats.projectsCompleted }}/{{ stats.projectsTotal }}
                </dd>
              </div>
            </dl>
            <p class="font-mono text-[10px] uppercase tracking-widest text-faint">
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
          aria-label="What the node colours mean"
        >
          <li
            v-for="item in legend"
            :key="item.label"
            class="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-faint"
          >
            <span
              class="h-1.5 w-1.5 shrink-0"
              :class="item.dot"
            />
            {{ item.label }}
          </li>
        </ul>
      </div>

      <RoadmapGraph
        :roadmap="roadmap"
        :active-id="activeNodeId"
        @select="openNode"
      />
    </div>

    <!-- node drawer -->
    <BaseDrawer
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
    </BaseDrawer>

    <!-- project drawer -->
    <BaseDrawer
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
    </BaseDrawer>
  </div>
</template>
