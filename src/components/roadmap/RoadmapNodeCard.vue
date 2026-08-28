<script setup lang="ts">
import { computed } from "vue";
import type { NodeStatus, RoadmapNode } from "@/data/types";
import AppIcon from "@/components/ui/AppIcon.vue";

const props = defineProps<{
  node: RoadmapNode;
  status: NodeStatus;
  active?: boolean;
}>();

defineEmits<{ select: [node: RoadmapNode] }>();

const statusMeta: Record<
  NodeStatus,
  { label: string; icon: string; dot: string }
> = {
  locked: { label: "Locked", icon: "lock", dot: "bg-transparent border border-faint/60" },
  available: { label: "Available", icon: "play", dot: "bg-faint" },
  "in-progress": { label: "In progress", icon: "clock", dot: "bg-amber-500" },
  completed: { label: "Completed", icon: "check", dot: "bg-emerald-500" },
  mastered: { label: "Mastered", icon: "trophy", dot: "bg-emerald-400" },
};

const meta = computed(() => statusMeta[props.status]);

const shell = computed(() => {
  switch (props.status) {
    case "completed":
    case "mastered":
      // Stamped with the wax seal: a true double border.
      return "border-4 border-double border-emerald-600/70 bg-emerald-500/[0.06] hover:border-emerald-600";
    case "in-progress":
      return "border-2 border-amber-600/60 bg-amber-500/[0.06] hover:border-amber-600";
    case "locked":
      // Dimming the whole card makes the map look broken at 0%. Keep it
      // readable and let the status chip carry the information.
      return "border border-dashed border-line/70 bg-transparent opacity-70 hover:border-line-strong hover:border-solid hover:opacity-100";
    default:
      return "border-2 border-line bg-surface hover:border-[rgb(var(--track))]";
  }
});
</script>

<template>
  <button
    type="button"
    class="group relative flex w-full flex-col items-start gap-2 border p-4 text-left transition-all duration-200 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5 sm:p-5"
    :class="[shell, active ? 'ring-1 ring-[rgb(var(--track))]' : '']"
    :aria-label="`${node.title} — ${meta.label}`"
    @click="$emit('select', node)"
  >
    <span
      v-if="status === 'in-progress'"
      class="absolute -right-1 -top-1 h-2 w-2 animate-flicker bg-amber-500"
      aria-hidden="true"
    />

    <span class="flex w-full items-center justify-between gap-2">
      <span class="flex min-w-0 items-center gap-2">
        <AppIcon v-if="status === 'locked'" name="lock" :size="10" class="text-faint" />
        <span v-else class="h-1.5 w-1.5 shrink-0" :class="meta.dot" />
        <span class="label-mono truncate">{{ meta.label }}</span>
      </span>
      <span
        v-if="node.optional"
        class="shrink-0 border border-line px-1.5 py-px font-mono text-[9px] uppercase tracking-wider text-faint"
        >Optional</span
      >
    </span>

    <span
      class="text-[15px] font-medium leading-snug text-ink transition-colors sm:text-base"
      :class="status === 'available' ? 'group-hover:text-[rgb(var(--track))]' : ''"
    >
      {{ node.title }}
    </span>

    <span class="line-clamp-2 text-[13px] font-light leading-relaxed text-muted">
      {{ node.tagline }}
    </span>

    <span class="mt-1 flex w-full items-center justify-between gap-2 pt-1">
      <span class="flex items-center gap-1.5 font-mono text-[10px] text-faint">
        <AppIcon name="clock" :size="11" />
        {{ node.time.basics }}
      </span>
      <span
        class="flex items-center gap-1 font-mono text-[10px] text-faint opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        Open <AppIcon name="arrow-right" :size="11" />
      </span>
    </span>
  </button>
</template>
