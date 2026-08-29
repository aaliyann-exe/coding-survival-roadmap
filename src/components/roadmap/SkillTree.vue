<script setup lang="ts">
/**
 * The skill tree.
 *
 * The previous implementation rendered one CSS grid per stage, which made the
 * roadmap read top-to-bottom as N separate card grids — prerequisite edges
 * were drawn, but the composition fought them. This renders the entire
 * roadmap as ONE continuous grid: stage bands and nodes share a single
 * explicit row axis, so a branch that spans two stages is genuinely one
 * unbroken path and the eye can follow origin → branch → mastery.
 *
 * Layout comes from the data and is not invented here: every node already
 * carries `col` (lane) and `row` (a globally increasing index). We only
 * rebase each stage's rows onto a shared cursor so the stage bands can sit
 * between them.
 */
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import type { Roadmap, RoadmapNode } from "@/data/types";
import { useProgress } from "@/composables/useProgress";
import { useReducedMotion } from "@/composables/useMotion";
import SkillNode from "./SkillNode.vue";

const props = defineProps<{ roadmap: Roadmap; activeId?: string | null }>();
defineEmits<{ select: [node: RoadmapNode] }>();

const { statusOf, completedNodeIds } = useProgress();
const { prefersReducedMotion } = useReducedMotion();

const canvas = ref<HTMLElement | null>(null);
const cardEls = new Map<string, HTMLElement>();
const isWide = ref(false);

type EdgeKind = "locked" | "open" | "sealed";
interface Edge {
  id: string;
  d: string;
  kind: EdgeKind;
  live: boolean;
}
const edges = ref<Edge[]>([]);
const canvasSize = ref({ width: 0, height: 0 });

function setCardRef(id: string, el: Element | null | { $el?: Element }) {
  const node =
    el && "$el" in (el as Record<string, unknown>)
      ? ((el as { $el: Element }).$el as HTMLElement)
      : (el as HTMLElement | null);
  if (node) cardEls.set(id, node);
  else cardEls.delete(id);
}

/** How many other nodes list this one as a prerequisite. Nodes that gate a
 * lot of the tree are struck as milestones. */
const unlockCount = computed(() => {
  const counts = new Map<string, number>();
  for (const node of props.roadmap.nodes) {
    for (const p of node.prerequisites) {
      counts.set(p, (counts.get(p) ?? 0) + 1);
    }
  }
  return counts;
});

/**
 * One flat list in reading order — band, that stage's nodes, next band — so
 * DOM order matches the visual order. This matters twice: screen readers and
 * tab order follow the document, and below `md` there is no explicit grid
 * placement at all, so the narrow layout *is* DOM order. (Emitting all bands
 * and then all nodes rendered every chapter heading in a block followed by
 * every node, which was correct on desktop only by accident of grid rows.)
 */
const layout = computed(() => {
  type Item =
    | { kind: "band"; key: string; stage: Roadmap["stages"][number]; row: number; index: number }
    | { kind: "node"; key: string; node: RoadmapNode; row: number; col: number };
  const items: Item[] = [];

  const groups = props.roadmap.stages
    .map((stage) => ({
      stage,
      nodes: props.roadmap.nodes
        .filter((n) => n.stage === stage.id)
        .sort((a, b) => a.row - b.row || a.col - b.col),
    }))
    .filter((g) => g.nodes.length > 0);

  let cursor = 1;
  groups.forEach((group, index) => {
    items.push({
      kind: "band",
      key: `band-${group.stage.id}`,
      stage: group.stage,
      row: cursor,
      index,
    });

    // Compact the stage's row values onto consecutive grid rows. The data's
    // `row` indices are global and can skip (a stage may use 19, 21, 23), and
    // an empty grid row still costs a full row gap — which showed up as
    // hundreds of pixels of dead space down the tree.
    const distinct = [...new Set(group.nodes.map((n) => n.row))].sort((a, b) => a - b);
    const rowOf = new Map(distinct.map((value, i) => [value, cursor + 1 + i]));

    for (const node of group.nodes) {
      items.push({
        kind: "node",
        key: node.id,
        node,
        row: rowOf.get(node.row)!,
        col: node.col,
      });
    }
    // Nodes occupy cursor+1 … cursor+distinct.length, so the next stage's
    // band starts on the row after the last node row.
    cursor = cursor + distinct.length + 1;
  });

  return { items, rows: cursor };
});

function stageProgress(stageId: string) {
  const nodes = props.roadmap.nodes.filter((n) => n.stage === stageId);
  const done = nodes.filter((n) => completedNodeIds.value.has(n.id)).length;
  return { done, total: nodes.length };
}

/**
 * Measure real card geometry and emit connector paths. Kept imperative and
 * rAF-throttled (rather than reactive per-node) because it reads layout: one
 * batched read pass per frame avoids thrashing as the tree grows.
 */
function measure() {
  const root = canvas.value;
  if (!root || !isWide.value) {
    edges.value = [];
    return;
  }
  const base = root.getBoundingClientRect();
  canvasSize.value = { width: base.width, height: base.height };

  const next: Edge[] = [];
  for (const node of props.roadmap.nodes) {
    const target = cardEls.get(node.id);
    if (!target) continue;
    const t = target.getBoundingClientRect();

    for (const prereqId of node.prerequisites) {
      const source = cardEls.get(prereqId);
      if (!source) continue;
      const s = source.getBoundingClientRect();

      const sameRowish = Math.abs(s.top - t.top) < 24;
      let d: string;

      if (sameRowish) {
        const leftToRight = s.left < t.left;
        const x1 = (leftToRight ? s.right : s.left) - base.left;
        const y1 = s.top + s.height / 2 - base.top;
        const x2 = (leftToRight ? t.left : t.right) - base.left;
        const y2 = t.top + t.height / 2 - base.top;
        const bow = Math.min(Math.abs(x2 - x1) * 0.4, 60);
        d = `M ${x1} ${y1} C ${x1 + (leftToRight ? bow : -bow)} ${y1}, ${x2 - (leftToRight ? bow : -bow)} ${y2}, ${x2} ${y2}`;
      } else {
        const x1 = s.left + s.width / 2 - base.left;
        const y1 = s.bottom - base.top;
        const x2 = t.left + t.width / 2 - base.left;
        const y2 = t.top - base.top;
        const span = Math.max(y2 - y1, 24);
        const c = Math.min(span * 0.55, 90);
        d = `M ${x1} ${y1} C ${x1} ${y1 + c}, ${x2} ${y2 - c}, ${x2} ${y2}`;
      }

      const prereqDone = completedNodeIds.value.has(prereqId);
      const status = statusOf(node);
      const targetDone = status === "completed" || status === "mastered";

      next.push({
        id: `${prereqId}->${node.id}`,
        d,
        // A path is only "sealed" when both ends are cleared; it is "open"
        // once you could actually walk it; otherwise it stays dormant.
        kind: prereqDone && targetDone ? "sealed" : prereqDone ? "open" : "locked",
        live: prereqDone && (status === "available" || status === "in-progress"),
      });
    }
  }
  edges.value = next;
}

let raf = 0;
function scheduleMeasure() {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(measure);
}

let observer: ResizeObserver | null = null;
let media: MediaQueryList | null = null;

function onMediaChange(event: MediaQueryListEvent | MediaQueryList) {
  isWide.value = event.matches;
  nextTick(scheduleMeasure);
}

onMounted(() => {
  media = window.matchMedia("(min-width: 768px)");
  onMediaChange(media);
  media.addEventListener("change", onMediaChange);

  observer = new ResizeObserver(scheduleMeasure);
  if (canvas.value) observer.observe(canvas.value);
  window.addEventListener("resize", scheduleMeasure);
  nextTick(scheduleMeasure);
});

onUnmounted(() => {
  media?.removeEventListener("change", onMediaChange);
  observer?.disconnect();
  window.removeEventListener("resize", scheduleMeasure);
  cancelAnimationFrame(raf);
});

watch(
  () => [props.roadmap.id, completedNodeIds.value.size],
  () => nextTick(scheduleMeasure),
);

const edgeStroke: Record<EdgeKind, string> = {
  sealed: "rgb(var(--seal))",
  open: "rgb(var(--track))",
  locked: "rgb(var(--line))",
};
</script>

<template>
  <div ref="canvas" class="relative">
    <!-- Connector paths. Decorative only — every prerequisite is also listed
         as text inside the node's own brief, so nothing depends on the SVG. -->
    <svg
      v-if="isWide"
      class="pointer-events-none absolute inset-0 z-0 hidden md:block"
      :width="canvasSize.width"
      :height="canvasSize.height"
      aria-hidden="true"
    >
      <g fill="none" stroke-linecap="butt">
        <!-- Each edge is inked twice: a heavy stroke, then a thin canvas-
             coloured groove down the middle, so it reads as an engraved
             channel cut into the page rather than a UI connector line. -->
        <template v-for="edge in edges" :key="edge.id">
          <path
            :d="edge.d"
            :stroke="edgeStroke[edge.kind]"
            :stroke-width="edge.kind === 'locked' ? 3 : 5"
            :stroke-opacity="edge.kind === 'locked' ? 0.3 : 0.9"
            :stroke-dasharray="edge.kind === 'locked' ? '7 7' : undefined"
          />
          <path
            v-if="edge.kind !== 'locked'"
            :d="edge.d"
            stroke="rgb(var(--canvas))"
            stroke-width="1.75"
            :stroke-dasharray="edge.live && !prefersReducedMotion ? '3 7' : undefined"
            :class="edge.live && !prefersReducedMotion ? 'animate-dash' : ''"
          />
        </template>
      </g>
    </svg>

    <!-- ONE grid for the whole roadmap: stage bands and nodes share a single
         row axis, so branches cross stage boundaries without a seam. -->
    <div
      class="relative z-10 grid gap-4 md:gap-x-7 md:gap-y-9"
      :class="!isWide ? 'quest-chain' : ''"
      :style="
        isWide
          ? {
              gridTemplateColumns: `repeat(${roadmap.lanes}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${layout.rows}, auto)`,
            }
          : undefined
      "
    >
      <template v-for="item in layout.items" :key="item.key">
        <!-- chapter band: a landmark inside the tree, not a divider between grids -->
        <div
          v-if="item.kind === 'band'"
          class="relative"
          :style="isWide ? { gridColumn: '1 / -1', gridRow: String(item.row) } : undefined"
        >
          <div class="relative overflow-hidden pt-3">
            <span class="chapter-numeral" aria-hidden="true">{{
              String(item.index + 1).padStart(2, "0")
            }}</span>
            <div class="relative z-10 flex items-baseline gap-3">
              <h3
                class="shrink-0 text-[15px] uppercase tracking-[0.2em] text-ink"
                style="font-family: 'Cinzel', Georgia, serif"
              >
                {{ item.stage.title }}
              </h3>
              <span class="h-0.5 flex-1 bg-line/70" />
              <span
                class="shrink-0 font-mono text-[10px] tabular-nums"
                :class="
                  stageProgress(item.stage.id).done === stageProgress(item.stage.id).total
                    ? 'text-seal'
                    : 'text-faint'
                "
              >
                {{ stageProgress(item.stage.id).done }}/{{
                  stageProgress(item.stage.id).total
                }}
              </span>
            </div>
            <p class="relative z-10 mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted">
              {{ item.stage.blurb }}
            </p>
          </div>
        </div>

        <!-- node, placed on the shared axis -->
        <div
          v-else
          :ref="(el) => setCardRef(item.node.id, el as Element | null)"
          :style="
            isWide
              ? { gridColumn: String(item.col + 1), gridRow: String(item.row) }
              : undefined
          "
        >
          <SkillNode
            :node="item.node"
            :status="statusOf(item.node)"
            :active="activeId === item.node.id"
            :major="(unlockCount.get(item.node.id) ?? 0) >= 3"
            @select="$emit('select', $event)"
          />
        </div>
      </template>
    </div>
  </div>
</template>
