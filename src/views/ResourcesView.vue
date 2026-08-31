<script setup lang="ts">
import { computed, ref } from "vue";
import type { ResourceType } from "@/data/types";
import {
  allResources,
  resourceTypeLabels,
  resourceTypeOrder,
} from "@/data/resources";
import { roadmaps } from "@/data/roadmaps";
import ResourceCard from "@/components/resources/ResourceCard.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import BookSpread from "@/components/book/BookSpread.vue";

const search = ref("");
const activeType = ref<ResourceType | "all">("all");
const activeTrack = ref<string>("all");
const freeOnly = ref(false);

const filtered = computed(() =>
  allResources.filter((r) => {
    if (activeType.value !== "all" && r.type !== activeType.value) return false;
    if (activeTrack.value !== "all" && r.roadmapId !== activeTrack.value) return false;
    if (freeOnly.value && r.free === false) return false;
    const q = search.value.trim().toLowerCase();
    if (!q) return true;
    return (
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.nodeTitle ?? "").toLowerCase().includes(q)
    );
  }),
);

const grouped = computed(() =>
  resourceTypeOrder
    .map((type) => ({
      type,
      items: filtered.value.filter((r) => r.type === type),
    }))
    .filter((g) => g.items.length > 0),
);

function reset() {
  search.value = "";
  activeType.value = "all";
  activeTrack.value = "all";
  freeOnly.value = false;
}
</script>

<template>
  <BookSpread
    :eyebrow="`${allResources.length} links, no SEO slop`"
    title="Resources"
    folio="Folio IV — The Archive"
  >
    <template #left>
      <p class="text-[15px] leading-relaxed text-muted">
        Official documentation first, because it's written by the people who built the
        thing and it doesn't go stale in six months. Courses and videos are here where
        they're genuinely good, not to pad the list.
      </p>
      <p class="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
        {{ filtered.length }} of {{ allResources.length }} shown
      </p>
    </template>

    <!-- filters -->
    <div class="mb-10 space-y-4 border border-line bg-raised/50 p-4 sm:p-5">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span class="label-mono w-14 shrink-0">Type</span>
        <button
          type="button"
          class="filter-tab"
          :aria-pressed="activeType === 'all'"
          @click="activeType = 'all'"
        >
          All
        </button>
        <button
          v-for="type in resourceTypeOrder"
          :key="type"
          type="button"
          class="filter-tab"
          :aria-pressed="activeType === type"
          @click="activeType = type"
        >
          {{ resourceTypeLabels[type] }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span class="label-mono w-14 shrink-0">Track</span>
        <button
          type="button"
          class="filter-tab"
          :aria-pressed="activeTrack === 'all'"
          @click="activeTrack = 'all'"
        >
          All
        </button>
        <button
          v-for="r in roadmaps"
          :key="r.id"
          type="button"
          class="filter-tab"
          :class="r.trackClass"
          :aria-pressed="activeTrack === r.id"
          @click="activeTrack = r.id"
        >
          {{ r.short }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span class="label-mono w-14 shrink-0">Cost</span>
        <!-- Its own row rather than tacked onto the end of "Track": it filters
             a different thing, and sitting in that row implied otherwise. -->
        <button
          type="button"
          class="filter-tab"
          :aria-pressed="freeOnly"
          @click="freeOnly = !freeOnly"
        >
          Free only
        </button>

        <label
          class="ml-auto flex min-h-[2.25rem] min-w-[180px] flex-1 items-center gap-2 border border-line bg-surface px-3 focus-within:border-line-strong sm:max-w-xs"
        >
          <AppIcon name="search" :size="13" class="text-faint" />
          <input
            v-model="search"
            type="search"
            placeholder="Search resources…"
            class="w-full bg-transparent py-2 text-[13px] text-ink outline-none placeholder:text-faint"
            aria-label="Search resources"
          />
        </label>
      </div>
    </div>

    <div v-if="filtered.length === 0" class="border border-line bg-raised p-12 text-center">
      <p class="mb-4 text-sm text-muted">
        Nothing found. Either you discovered a new technology or you typed it wrong.
      </p>
      <button type="button" class="btn" @click="reset">
        <AppIcon name="reset" :size="12" /> Clear filters
      </button>
    </div>

    <div v-else class="space-y-14">
      <section v-for="group in grouped" :key="group.type">
        <div class="section-head">
          <h2>{{ resourceTypeLabels[group.type] }}</h2>
          <span class="section-rule" aria-hidden="true" />
          <span class="section-count">{{ group.items.length }}</span>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <ResourceCard
            v-for="resource in group.items"
            :key="resource.url"
            :resource="resource"
            :show-breadcrumb="
              resource.nodeTitle
                ? `${resource.roadmapTitle} → ${resource.nodeTitle}`
                : undefined
            "
          />
        </div>
      </section>
    </div>
    <p class="folio mt-10 text-right">Folio IV</p>
  </BookSpread>
</template>
