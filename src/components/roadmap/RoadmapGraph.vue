<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import type { Roadmap, RoadmapNode } from "@/data/types";
import { useProgress } from "@/composables/useProgress";
import { useReducedMotion } from "@/composables/useMotion";
import RoadmapNodeCard from "./RoadmapNodeCard.vue";

const props = defineProps<{ roadmap: Roadmap; activeId?: string | null }>();
defineEmits<{ select: [node: RoadmapNode] }>();

const { statusOf, completedNodeIds } = useProgress();
const { prefersReducedMotion } = useReducedMotion();

const canvas = ref<HTMLElement | null>(null);
const cardEls = new Map<string, HTMLElement>();
const isWide = ref(false);

interface Edge {
  id: string;
  d: string;
  done: boolean;
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

const stagesWithNodes = computed(() =>
  props.roadmap.stages
    .map((stage) => ({
      stage,
      nodes: props.roadmap.nodes
        .filter((n) => n.stage === stage.id)
        .sort((a, b) => a.row - b.row || a.col - b.col),
    }))
    .filter((s) => s.nodes.length > 0),
);

/** Row numbers are global across the roadmap; make them local per stage. */
function localRow(stageId: string, node: RoadmapNode) {
  const group = stagesWithNodes.value.find((s) => s.stage.id === stageId);
  if (!group) return 1;
  const min = Math.min(...group.nodes.map((n) => n.row));
  return node.row - min + 1;
}

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
      let x1: number, y1: number, x2: number, y2: number, d: string;

      if (sameRowish) {
        const leftToRight = s.left < t.left;
        x1 = (leftToRight ? s.right : s.left) - base.left;
        y1 = s.top + s.height / 2 - base.top;
        x2 = (leftToRight ? t.left : t.right) - base.left;
        y2 = t.top + t.height / 2 - base.top;
        const bow = Math.min(Math.abs(x2 - x1) * 0.4, 60);
        d = `M ${x1} ${y1} C ${x1 + (leftToRight ? bow : -bow)} ${y1}, ${x2 - (leftToRight ? bow : -bow)} ${y2}, ${x2} ${y2}`;
      } else {
        x1 = s.left + s.width / 2 - base.left;
        y1 = s.bottom - base.top;
        x2 = t.left + t.width / 2 - base.left;
        y2 = t.top - base.top;
        const span = Math.max(y2 - y1, 24);
        const c = Math.min(span * 0.55, 90);
        d = `M ${x1} ${y1} C ${x1} ${y1 + c}, ${x2} ${y2 - c}, ${x2} ${y2}`;
      }

      const done = completedNodeIds.value.has(prereqId);
      const status = statusOf(node);
      next.push({
        id: `${prereqId}->${node.id}`,
        d,
        done,
        live: done && (status === "available" || status === "in-progress"),
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
</script>

<template>
  <div ref="canvas" class="relative">
    <!-- Connection lines. Purely decorative: the prerequisites are also
         listed as text inside every node's drawer. -->
    <svg
      v-if="isWide"
      class="pointer-events-none absolute inset-0 z-0 hidden md:block"
      :width="canvasSize.width"
      :height="canvasSize.height"
      aria-hidden="true"
    >
      <g fill="none" stroke-linecap="round">
        <path
          v-for="edge in edges"
          :key="edge.id"
          :d="edge.d"
          :stroke="
            edge.done ? 'rgb(var(--track))' : 'rgb(var(--line-strong))'
          "
          :stroke-width="edge.done ? 1.5 : 1"
          :stroke-opacity="edge.done ? 0.75 : 0.55"
          :stroke-dasharray="edge.live && !prefersReducedMotion ? '4 6' : undefined"
          :class="edge.live && !prefersReducedMotion ? 'animate-dash' : ''"
        />
      </g>
    </svg>

    <div class="relative z-10 space-y-12 md:space-y-16">
      <section
        v-for="(group, groupIndex) in stagesWithNodes"
        :key="group.stage.id"
        :aria-label="group.stage.title"
      >
        <header class="mb-5 md:mb-7">
          <div class="flex items-center gap-3">
            <span
              class="bg-canvas pr-3 font-mono text-[11px] uppercase tracking-widest text-muted"
            >
              <span class="text-faint"
                >{{ String(groupIndex + 1).padStart(2, "0") }} /</span
              >
              {{ group.stage.title }}
            </span>
            <span class="h-px flex-1 bg-line" />
          </div>
          <p class="mt-2 max-w-2xl text-[13px] font-light leading-relaxed text-muted">
            {{ group.stage.blurb }}
          </p>
        </header>

        <div
          class="grid grid-cols-1 gap-4 md:gap-x-6 md:gap-y-8"
          :style="
            isWide
              ? { gridTemplateColumns: `repeat(${roadmap.lanes}, minmax(0, 1fr))` }
              : undefined
          "
        >
          <div
            v-for="node in group.nodes"
            :key="node.id"
            :ref="(el) => setCardRef(node.id, el as Element | null)"
            :style="
              isWide
                ? {
                    gridColumn: String(node.col + 1),
                    gridRow: String(localRow(group.stage.id, node)),
                  }
                : undefined
            "
          >
            <RoadmapNodeCard
              :node="node"
              :status="statusOf(node)"
              :active="activeId === node.id"
              @select="$emit('select', $event)"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
