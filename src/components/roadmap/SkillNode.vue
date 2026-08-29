<script setup lang="ts">
/**
 * A node inside the arcane portal.
 *
 * A translucent plate floating in the void — the star field stays visible
 * around and behind it. Legibility is the constraint that shapes everything:
 * the plate is dark enough to carry text over stars, because "beautiful
 * screenshot nobody can read" is the failure mode here.
 *
 * State is carried by material, by an arcane sigil, and by a text label, so
 * it never depends on colour alone.
 */
import { computed } from "vue";
import type { NodeStatus, RoadmapNode } from "@/data/types";
import ArcaneSigil from "@/components/arcane/ArcaneSigil.vue";
import AppIcon from "@/components/ui/AppIcon.vue";

const props = defineProps<{
  node: RoadmapNode;
  status: NodeStatus;
  active?: boolean;
  /** Milestone nodes gate several branches and are struck larger. */
  major?: boolean;
  /** The roadmap's recommended next step — the reader's current quest. */
  next?: boolean;
}>();

defineEmits<{ select: [node: RoadmapNode] }>();

// Labels are the product's own status terminology, unchanged.
const statusMeta: Record<NodeStatus, { label: string }> = {
  locked: { label: "Locked" },
  available: { label: "Available" },
  "in-progress": { label: "In progress" },
  completed: { label: "Completed" },
  mastered: { label: "Mastered" },
};

const meta = computed(() => statusMeta[props.status]);

const plate = computed(() => {
  switch (props.status) {
    case "completed":
    case "mastered":
      return "astral-plate astral-sealed";
    case "in-progress":
      return "astral-plate astral-active";
    case "locked":
      return "astral-plate astral-locked";
    default:
      return "astral-plate";
  }
});

/** Ink for the sigil well, matched to the plate's energy. */
const tone = computed(() => {
  switch (props.status) {
    case "completed":
    case "mastered":
      return "text-[rgb(var(--seal))]";
    case "in-progress":
      return "text-[rgb(var(--ember))]";
    case "locked":
      return "text-[rgb(var(--astral))]/45";
    default:
      return "text-[rgb(var(--astral))]";
  }
});

const titleTone = computed(() =>
  props.status === "locked"
    ? "text-[rgb(var(--star))]/55"
    : "text-[rgb(var(--star))]",
);
</script>

<template>
  <button
    type="button"
    class="group relative flex w-full items-stretch gap-0 text-left"
    :class="[
      plate,
      active ? 'outline outline-2 outline-offset-2 outline-[rgb(var(--ember))]' : '',
    ]"
    :aria-label="`${node.title} — ${meta.label}`"
    :aria-current="active ? 'true' : undefined"
    @click="$emit('select', node)"
  >
    <!-- sigil well -->
    <span
      class="relative flex w-11 shrink-0 items-center justify-center border-r"
      :class="tone"
      style="border-color: rgb(var(--astral) / 0.25)"
      aria-hidden="true"
    >
      <ArcaneSigil
        :seed="node.id"
        :size="major ? 21 : 18"
        :class="status === 'in-progress' ? 'motion-safe:animate-drift' : ''"
      />
      <!-- sealed nodes carry a small completion mark over the sigil -->
      <span
        v-if="status === 'completed' || status === 'mastered'"
        class="absolute -bottom-px -right-px flex h-3.5 w-3.5 items-center justify-center bg-[rgb(var(--void-deep))] text-[rgb(var(--seal))]"
      >
        <AppIcon :name="status === 'mastered' ? 'trophy' : 'check'" :size="9" />
      </span>
    </span>

    <!-- The recommended next step. The tree could already show what was
         reachable, but not where to actually go next, which is the single
         most useful thing a progression screen can say. -->
    <span
      v-if="next && status !== 'completed' && status !== 'mastered'"
      class="absolute -top-2 left-9 z-10 border px-1.5 py-px font-mono text-[8px] uppercase tracking-[0.2em] text-[rgb(var(--ember))]"
      style="
        border-color: rgb(var(--ember) / 0.7);
        background-color: rgb(var(--void-deep));
      "
      >Next</span
    >

    <!-- inscription -->
    <span class="flex min-w-0 flex-1 flex-col gap-1 px-3 py-2.5">
      <span class="flex items-center gap-2">
        <span
          class="truncate font-mono text-[9px] uppercase tracking-[0.2em]"
          :class="
            status === 'in-progress'
              ? 'text-[rgb(var(--ember))]'
              : status === 'completed' || status === 'mastered'
                ? 'text-[rgb(var(--seal))]'
                : 'text-[rgb(var(--astral))]/70'
          "
          >{{ meta.label }}</span
        >
        <span
          v-if="node.optional"
          class="ml-auto shrink-0 border px-1 py-px font-mono text-[8px] uppercase tracking-wider text-[rgb(var(--astral))]/60"
          style="border-color: rgb(var(--astral) / 0.3)"
          >Optional</span
        >
      </span>

      <span
        class="leading-snug"
        :class="[titleTone, major ? 'text-[15px] font-semibold' : 'text-[13.5px] font-medium']"
        style="font-family: 'Cinzel', Georgia, serif"
      >
        {{ node.title }}
      </span>

      <span
        class="line-clamp-2 text-[12px] leading-relaxed"
        :class="
          status === 'locked'
            ? 'text-[rgb(var(--star))]/35'
            : 'text-[rgb(var(--star))]/60'
        "
      >
        {{ node.tagline }}
      </span>

      <span
        class="mt-0.5 flex items-center gap-1.5 font-mono text-[9px] text-[rgb(var(--astral))]/60"
      >
        <AppIcon name="clock" :size="9" />
        {{ node.time.basics }}
      </span>
    </span>
  </button>
</template>
