<script setup lang="ts">
import { computed } from "vue";
import type { Project, ProjectTier, Roadmap, RoadmapNode } from "@/data/types";
import { nodeById, roadmapForNode } from "@/data/roadmaps";
import AppIcon from "@/components/ui/AppIcon.vue";

const props = defineProps<{ project: Project }>();
defineEmits<{ openNode: [id: string] }>();

const tierLabel: Record<ProjectTier, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  pain: "Why did I do this to myself?",
};

/** `project.skills` holds node ids, some of which may no longer exist if a
 * topic was renamed or removed. A plain loop states that plainly; the
 * previous version needed a `ReturnType<typeof ...>` type predicate three
 * lines long to say the same thing. */
const relatedNodes = computed(() => {
  const out: { node: RoadmapNode; roadmap: Roadmap | undefined }[] = [];
  for (const id of props.project.skills) {
    const node = nodeById(id);
    if (node) out.push({ node, roadmap: roadmapForNode(id) });
  }
  return out;
});
</script>

<template>
  <div class="px-5 py-6 sm:px-7 sm:py-8">
    <div class="mb-6 flex flex-wrap items-center gap-2">
      <span class="chip">{{ tierLabel[project.tier] }}</span>
      <span class="chip">{{ project.time }}</span>
      <span v-if="project.legacyLevel" class="chip">{{ project.legacyLevel }}</span>
    </div>

    <p class="mb-8 text-[15px] font-light leading-relaxed text-muted">
      {{ project.description }}
    </p>

    <section class="mb-8">
      <h3 class="rule-heading mb-3">Stack</h3>
      <div class="flex flex-wrap gap-1.5">
        <span v-for="tech in project.stack" :key="tech" class="chip">{{ tech }}</span>
      </div>
    </section>

    <section class="mb-8">
      <h3 class="rule-heading mb-3">Build at least this much</h3>
      <ul class="space-y-2">
        <li
          v-for="feature in project.features"
          :key="feature"
          class="flex items-start gap-2.5 text-[13px] font-light leading-relaxed text-muted"
        >
          <span
            class="mt-[7px] h-1 w-1 shrink-0"
            style="background-color: rgb(var(--track) / 0.8)"
          />
          {{ feature }}
        </li>
      </ul>
    </section>

    <section class="mb-8">
      <h3 class="rule-heading mb-3">Stretch goals</h3>
      <ul class="space-y-2">
        <li
          v-for="item in project.stretch"
          :key="item"
          class="flex items-start gap-2.5 text-[13px] font-light leading-relaxed text-muted"
        >
          <AppIcon name="arrow-right" :size="12" class="mt-[3px] text-faint" />
          {{ item }}
        </li>
      </ul>
    </section>

    <section v-if="relatedNodes.length" class="mb-2">
      <h3 class="rule-heading mb-3">Skills this exercises</h3>
      <ul class="space-y-1.5">
        <li v-for="item in relatedNodes" :key="item.node.id">
          <button
            type="button"
            class="group flex w-full items-center gap-2 border border-line bg-raised px-3 py-2 text-left transition-colors hover:border-line-strong"
            @click="$emit('openNode', item.node.id)"
          >
            <span class="min-w-0 flex-1">
              <span class="block truncate text-[13px] text-ink">{{
                item.node.title
              }}</span>
              <span class="block truncate text-2xs text-faint">{{
                item.roadmap?.title
              }}</span>
            </span>
            <AppIcon
              name="arrow-right"
              :size="13"
              class="text-faint transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>
