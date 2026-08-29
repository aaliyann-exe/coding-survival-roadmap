<script setup lang="ts">
/**
 * Ribbon bookmarks pushed into the top of the page block.
 *
 * Not a nav bar with tab styling. Each ribbon sits at its own depth and angle
 * so the set reads as something a person inserted over time, and the active
 * one runs down into the page it marks. Even spacing and equal heights are
 * exactly what made the previous "index tabs" still read as a navbar, so the
 * irregularity here is the point.
 */
import { useRoute } from "vue-router";

defineProps<{ links: { to: string; label: string }[] }>();

const route = useRoute();

/** Per-ribbon insertion depth. Fixed values rather than random, so the book
 * looks the same on every visit. The ribbons sit square — the depth alone
 * carries the "inserted by hand" feel without any tilt. */
const SET = [
  { depth: 0 },
  { depth: 10 },
  { depth: 4 },
  { depth: 14 },
  { depth: 7 },
];

function isActive(to: string) {
  return route.path === to || route.path.startsWith(to + "/");
}
</script>

<template>
  <nav aria-label="Chapters" class="relative z-20 -mb-2">
    <ul
      class="no-scrollbar flex items-start gap-2 overflow-x-auto px-3 pt-2 sm:gap-4 sm:px-14"
    >
      <li
        v-for="(link, i) in links"
        :key="link.to"
        class="shrink-0"
        :style="{ paddingTop: `${SET[i % SET.length].depth}px` }"
      >
        <RouterLink
          :to="link.to"
          class="ribbon"
          :data-active="isActive(link.to) ? 'true' : 'false'"
          :aria-current="isActive(link.to) ? 'page' : undefined"
          :style="{ height: isActive(link.to) ? '3.35rem' : '2.9rem' }"
        >
          <span>{{ link.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
