<script setup lang="ts">
import type { Resource, ResourceType } from "@/data/types";
import AppIcon from "@/components/ui/AppIcon.vue";

defineProps<{ resource: Resource; showBreadcrumb?: string }>();

const typeIcon: Record<ResourceType, string> = {
  documentation: "book",
  course: "compass",
  video: "video",
  practice: "target",
  book: "book",
  article: "book",
  tool: "wrench",
  community: "users",
};

const typeLabel: Record<ResourceType, string> = {
  documentation: "Docs",
  course: "Course",
  video: "Video",
  practice: "Practice",
  book: "Book",
  article: "Article",
  tool: "Tool",
  community: "Community",
};
</script>

<template>
  <a
    :href="resource.url"
    target="_blank"
    rel="noopener noreferrer"
    class="group block border border-line bg-raised p-3.5 transition-colors hover:border-line-strong"
  >
    <div class="mb-1.5 flex items-center gap-2">
      <AppIcon :name="typeIcon[resource.type]" :size="13" class="text-faint" />
      <span class="label-mono">{{ typeLabel[resource.type] }}</span>
      <span
        v-if="resource.free === false"
        class="border border-line px-1.5 py-px font-mono text-[9px] uppercase tracking-wider text-faint"
        >Paid</span
      >
      <span
        v-if="resource.difficulty"
        class="ml-auto font-mono text-[9px] uppercase tracking-wider text-faint"
        >{{ resource.difficulty }}</span
      >
    </div>

    <div class="flex items-start justify-between gap-2">
      <h3 class="text-[14px] font-medium leading-snug text-ink">
        {{ resource.title }}
      </h3>
      <AppIcon
        name="external"
        :size="13"
        class="mt-0.5 shrink-0 text-faint opacity-50 transition-opacity group-hover:opacity-100"
      />
    </div>

    <p class="mt-1 text-[13px] font-light leading-relaxed text-muted">
      {{ resource.description }}
    </p>

    <p v-if="showBreadcrumb" class="mt-2 font-mono text-[10px] text-faint">
      {{ showBreadcrumb }}
    </p>
  </a>
</template>
