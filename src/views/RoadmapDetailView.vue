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
import BookSpread from "@/components/book/BookSpread.vue";
import ArcaneSigil from "@/components/arcane/ArcaneSigil.vue";

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
  // `?node=` is kept alongside `?project=`. Only one sheet shows at a time
  // (see the node sheet's `open` below), but keeping the node in the URL
  // means closing the project brief returns to the topic it was opened
  // from rather than dumping the reader back at the tree.
  router.push({ path: route.path, query: { ...route.query, project: id } });
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
  <BookSpread
    v-if="roadmap"
    :class="roadmap.trackClass"
    eyebrow="Discipline"
    :title="roadmap.title"
    :folio="`Folio ${roadmap.short}`"
  >
    <!-- ============ LEFT PAGE: the school's apparatus ============ -->
    <template #left>
      <RouterLink
        to="/roadmaps"
        class="-ml-1 mb-6 inline-flex min-h-[40px] items-center gap-1.5 px-1 font-mono text-[10px] uppercase tracking-widest text-faint transition-colors hover:text-ink"
      >
        <AppIcon name="arrow-left" :size="11" /> All roadmaps
      </RouterLink>

      <!-- discipline insignia struck into the page -->
      <div class="mb-7 flex items-center gap-3">
        <span
          class="flex h-11 w-11 shrink-0 items-center justify-center border-2"
          style="
            border-color: rgb(var(--track));
            color: rgb(var(--track));
            box-shadow: inset 0 0 0 3px rgb(var(--canvas));
          "
          aria-hidden="true"
        >
          <ArcaneSigil :seed="roadmap.id" :size="20" />
        </span>
        <span class="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
          {{ roadmap.difficulty }}
        </span>
      </div>

      <p class="mb-5 text-[15px] leading-relaxed text-ink/85">
        {{ roadmap.tagline }}
      </p>
      <p class="mb-7 text-[14px] leading-relaxed text-muted">
        {{ roadmap.intro }}
      </p>

      <div v-if="stats">
        <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
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
          class="mt-4 font-mono text-[10px] uppercase leading-relaxed tracking-widest text-faint"
        >
          {{ roadmap.totalTime }}
        </p>
      </div>
    </template>

    <template #left-foot>
      <!-- legend, set as marginalia at the foot of the verso -->
      <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
        Marks
      </p>
      <ul class="space-y-1.5" aria-label="What the node states mean">
        <li
          v-for="item in legend"
          :key="item.label"
          class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-faint"
        >
          <span class="shrink-0 text-[11px] leading-none" :class="item.tone">{{
            item.rune
          }}</span>
          {{ item.label }}
        </li>
      </ul>
    </template>

    <!-- ============ RIGHT PAGE: the portal ============ -->
    <p
      class="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-faint"
    >
      <AppIcon name="route" :size="12" />
      Click any node for the full brief
    </p>

    <SkillTree :roadmap="roadmap" :active-id="activeNodeId" @select="openNode" />

    <p class="folio mt-5 text-right">The Arcane Aperture</p>

    <!-- node drawer -->
    <ManuscriptModal
      :open="Boolean(activeNode) && !activeProject"
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
  </BookSpread>
</template>
