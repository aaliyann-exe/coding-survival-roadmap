<script setup lang="ts">
/**
 * One node of the skill tree, rendered as an engraved plaque bolted to the
 * page rather than a card. State is carried by material (dashed dormant
 * stone / inked plate / gilded inscription / sealed record) and always
 * doubled by a glyph and a text label, so it never depends on colour alone.
 */
import { computed } from "vue";
import type { NodeStatus, RoadmapNode } from "@/data/types";
import AppIcon from "@/components/ui/AppIcon.vue";

const props = defineProps<{
  node: RoadmapNode;
  status: NodeStatus;
  active?: boolean;
  /** Milestone nodes — ones that unlock a lot — are struck larger. */
  major?: boolean;
}>();

defineEmits<{ select: [node: RoadmapNode] }>();

// Labels are the product's own status terminology and are left exactly as
// they were — the fantasy is carried by the material and the rune, not by
// renaming the states.
const statusMeta: Record<
  NodeStatus,
  { label: string; glyph: string; rune: string }
> = {
  locked: { label: "Locked", glyph: "lock", rune: "✦" },
  available: { label: "Available", glyph: "play", rune: "◆" },
  "in-progress": { label: "In progress", glyph: "clock", rune: "◈" },
  completed: { label: "Completed", glyph: "check", rune: "❖" },
  mastered: { label: "Mastered", glyph: "trophy", rune: "❖" },
};

const meta = computed(() => statusMeta[props.status]);

const sealed = computed(
  () => props.status === "completed" || props.status === "mastered",
);

const plate = computed(() => {
  switch (props.status) {
    case "completed":
    case "mastered":
      return "plaque plaque-sealed";
    case "in-progress":
      return "plaque plaque-active";
    case "locked":
      return "plaque plaque-locked";
    default:
      return "plaque";
  }
});

/** Ink weight for the rune well, matched to the plate's material. */
const runeTone = computed(() => {
  switch (props.status) {
    case "completed":
    case "mastered":
      return "text-seal";
    case "in-progress":
      return "text-gild";
    case "locked":
      return "text-faint/70";
    default:
      return "text-track";
  }
});
</script>

<template>
  <button
    type="button"
    class="group flex w-full items-stretch text-left"
    :class="[plate, active ? 'outline outline-2 outline-offset-2 outline-[rgb(var(--track))]' : '']"
    :aria-label="`${node.title} — ${meta.label}`"
    :aria-current="active ? 'true' : undefined"
    @click="$emit('select', node)"
  >
    <!-- rune well: the glyph that carries state without colour -->
    <span class="rune-well" :class="runeTone" aria-hidden="true">
      <span v-if="status === 'locked'" class="text-[13px] leading-none opacity-70">
        <AppIcon name="lock" :size="13" />
      </span>
      <span
        v-else-if="sealed"
        class="wax-seal text-[10px] leading-none"
        :class="status === 'mastered' ? 'border-double' : 'border-solid'"
      >
        <AppIcon :name="status === 'mastered' ? 'trophy' : 'check'" :size="11" />
      </span>
      <span
        v-else
        class="text-[15px] leading-none"
        :class="status === 'in-progress' ? 'animate-flicker' : ''"
        >{{ meta.rune }}</span
      >
    </span>

    <!-- engraved body -->
    <span class="flex min-w-0 flex-1 flex-col gap-1 px-3.5 py-3">
      <span class="flex items-center gap-2">
        <span class="label-mono truncate">{{ meta.label }}</span>
        <span
          v-if="node.optional"
          class="ml-auto shrink-0 border border-line px-1.5 py-px font-mono text-[9px] uppercase tracking-wider text-faint"
          >Optional</span
        >
      </span>

      <span
        class="leading-snug text-ink transition-colors"
        :class="[
          major ? 'text-[17px] font-semibold' : 'text-[15px] font-medium',
          status === 'available' ? 'group-hover:text-[rgb(var(--track))]' : '',
        ]"
        style="font-family: 'Cinzel', Georgia, serif"
      >
        {{ node.title }}
      </span>

      <span class="line-clamp-2 text-[13.5px] leading-relaxed text-muted">
        {{ node.tagline }}
      </span>

      <span class="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-faint">
        <AppIcon name="clock" :size="10" />
        {{ node.time.basics }}
        <span
          class="ml-auto flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          Read <AppIcon name="arrow-right" :size="10" />
        </span>
      </span>
    </span>
  </button>
</template>
