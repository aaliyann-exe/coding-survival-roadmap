<script setup lang="ts">
/**
 * The roadmap as an arcane portal cut through the page.
 *
 * The parchment stops at the portal rim and the celestial realm begins
 * beneath it. That contrast is the whole point: the tome is warm, physical
 * and inked; the tree lives in a cold, deep, star-lit world seen *through*
 * the page. The previous version drew the same tree directly on the
 * parchment, which is why it read as a dependency diagram.
 *
 * Structure is unchanged from the data: every node's `col` (lane) and `row`
 * are authored in `src/data/*.ts` and consumed here. Stage rows are compacted
 * onto consecutive grid rows so empty rows don't cost a row gap, and stage
 * bands share the single row axis with the nodes so branches cross them
 * without a seam.
 */
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import type { Roadmap, RoadmapNode } from "@/data/types";
import { useProgress } from "@/composables/useProgress";
import { useReducedMotion } from "@/composables/useMotion";
import SkillNode from "./SkillNode.vue";
import CelestialField from "@/components/arcane/CelestialField.vue";
import ArcaneSigil from "@/components/arcane/ArcaneSigil.vue";

const props = defineProps<{ roadmap: Roadmap; activeId?: string | null }>();
defineEmits<{ select: [node: RoadmapNode] }>();

const { statusOf, completedNodeIds, nextUp } = useProgress();
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

/** Nodes that gate several branches are milestones. */
const unlockCount = computed(() => {
  const counts = new Map<string, number>();
  for (const node of props.roadmap.nodes) {
    for (const p of node.prerequisites) counts.set(p, (counts.get(p) ?? 0) + 1);
  }
  return counts;
});

const layout = computed(() => {
  type Item =
    | {
        kind: "band";
        key: string;
        stage: Roadmap["stages"][number];
        row: number;
        index: number;
      }
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
    cursor = cursor + distinct.length + 1;
  });

  return { items, rows: cursor };
});

/** Cleared / total per stage, built once per progress change.
 * The template asks for this three times per stage band, and the previous
 * version walked every node in the roadmap on each of those calls — around
 * 120 nodes x 3 x however many bands, on every render. */
const stageProgress = computed(() => {
  const out = new Map<string, { done: number; total: number }>();
  for (const stage of props.roadmap.stages) {
    out.set(stage.id, { done: 0, total: 0 });
  }
  for (const node of props.roadmap.nodes) {
    const entry = out.get(node.stage);
    if (!entry) continue;
    entry.total += 1;
    if (completedNodeIds.value.has(node.id)) entry.done += 1;
  }
  return out;
});

/** One batched layout read per frame — see onMounted for the throttling. */
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

/** Park the tree on whichever node the reader was just looking at.
 *
 * This deliberately fires when the brief *closes*, not when it opens: the
 * sheet locks body scroll while it is up, so a scroll issued at open time
 * silently does nothing. Closing is also the moment it matters — arriving at
 * `?node=<id>` from the command palette or a cross-roadmap prerequisite used
 * to dump the reader at the top of the tree with no idea where that node was.
 *
 * The card refs do not exist on the first tick of a cold load, so this retries
 * across a few frames rather than giving up immediately.
 */
function revealNode(id: string, attempt = 0) {
  const el = cardEls.get(id);
  if (!el) {
    if (attempt < 12) requestAnimationFrame(() => revealNode(id, attempt + 1));
    return;
  }
  const rect = el.getBoundingClientRect();
  if (rect.top >= 0 && rect.bottom <= window.innerHeight) return;
  el.scrollIntoView({
    block: "center",
    behavior: prefersReducedMotion.value ? "auto" : "smooth",
  });
}

let lastActive: string | null = null;
watch(
  () => props.activeId,
  (id) => {
    if (id) {
      lastActive = id;
      return;
    }
    if (lastActive) {
      const target = lastActive;
      lastActive = null;
      nextTick(() => revealNode(target));
    }
  },
  { immediate: true },
);

/** Pathway inks. Sealed routes burn druid-green, walkable ones astral, and
 * dormant ones are barely charted. */
const edgeStroke: Record<EdgeKind, string> = {
  sealed: "rgb(var(--seal))",
  open: "rgb(var(--astral))",
  locked: "rgb(var(--astral))",
};
</script>

<template>
  <!-- ============ THE APERTURE ============
       The rim is engraved into the parchment; below it the page falls away
       into the void. -->
  <div class="relative">
    <!-- corner marks scribed into the page around the aperture -->
    <span
      class="pointer-events-none absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-line-strong"
      aria-hidden="true"
    />
    <span
      class="pointer-events-none absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-line-strong"
      aria-hidden="true"
    />
    <span
      class="pointer-events-none absolute -bottom-2 -left-2 h-4 w-4 border-b-2 border-l-2 border-line-strong"
      aria-hidden="true"
    />
    <span
      class="pointer-events-none absolute -bottom-2 -right-2 h-4 w-4 border-b-2 border-r-2 border-line-strong"
      aria-hidden="true"
    />

    <div class="portal relative overflow-hidden">
      <!-- world two -->
      <CelestialField class="pointer-events-none" />

      <!-- the tree floats above the sky -->
      <div ref="canvas" class="relative px-4 py-8 sm:px-8 sm:py-12">
        <!-- pathways -->
        <svg
          v-if="isWide"
          class="pointer-events-none absolute inset-0 z-0 hidden md:block"
          :width="canvasSize.width"
          :height="canvasSize.height"
          aria-hidden="true"
        >
          <g fill="none" stroke-linecap="round">
            <template v-for="edge in edges" :key="edge.id">
              <!-- a broad halo, then the bright filament: the line reads as
                   light rather than as a stroke -->
              <path
                v-if="edge.kind !== 'locked'"
                :d="edge.d"
                :stroke="edgeStroke[edge.kind]"
                stroke-width="6"
                stroke-opacity="0.16"
              />
              <path
                :d="edge.d"
                :stroke="edgeStroke[edge.kind]"
                :stroke-width="edge.kind === 'locked' ? 1 : 1.6"
                :stroke-opacity="edge.kind === 'locked' ? 0.22 : 0.9"
                :stroke-dasharray="
                  edge.kind === 'locked'
                    ? '2 8'
                    : edge.live && !prefersReducedMotion
                      ? '5 9'
                      : undefined
                "
                :class="edge.live && !prefersReducedMotion ? 'animate-dash' : ''"
              />
            </template>
          </g>
        </svg>

        <div
          class="relative z-10 grid gap-3.5 md:gap-x-6 md:gap-y-7"
          :class="!isWide ? 'astral-chain' : ''"
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
            <!-- constellation marker: the stage as a region of the sky -->
            <div
              v-if="item.kind === 'band'"
              class="is-band relative"
              :style="
                isWide ? { gridColumn: '1 / -1', gridRow: String(item.row) } : undefined
              "
            >
              <div class="flex items-center gap-3 pt-2">
                <span
                  class="flex h-7 w-7 shrink-0 items-center justify-center border text-[rgb(var(--ember))]"
                  style="
                    border-color: rgb(var(--ember) / 0.45);
                    background-color: rgb(var(--void-deep) / 0.75);
                  "
                  aria-hidden="true"
                >
                  <ArcaneSigil :seed="item.stage.id" :size="14" />
                </span>
                <h2
                  class="shrink-0 text-[12px] uppercase tracking-[0.28em] text-[rgb(var(--star))]/90"
                  style="font-family: 'Cinzel', Georgia, serif"
                >
                  {{ item.stage.title }}
                </h2>
                <span
                  class="h-px flex-1"
                  style="
                    background-image: linear-gradient(
                      to right,
                      rgb(var(--astral) / 0.5),
                      transparent
                    );
                  "
                />
                <span
                  v-if="stageProgress.get(item.stage.id)"
                  class="shrink-0 font-mono text-[10px] tabular-nums"
                  :class="
                    stageProgress.get(item.stage.id)!.done ===
                    stageProgress.get(item.stage.id)!.total
                      ? 'text-[rgb(var(--seal))]'
                      : 'text-[rgb(var(--astral))]/70'
                  "
                >
                  {{ stageProgress.get(item.stage.id)!.done }}/{{
                    stageProgress.get(item.stage.id)!.total
                  }}
                </span>
              </div>
              <p
                class="mt-1.5 max-w-2xl pl-1 text-[12px] leading-relaxed text-[rgb(var(--star))]/50 md:pl-10"
              >
                {{ item.stage.blurb }}
              </p>
            </div>

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
                :next="nextUp?.node.id === item.node.id"
                @select="$emit('select', $event)"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
