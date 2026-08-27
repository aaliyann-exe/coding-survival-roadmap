<script setup lang="ts">
/**
 * One small stroke-icon set, inline. Beats pulling in an icon package
 * for the twenty glyphs this site actually uses.
 */
const props = withDefaults(
  defineProps<{ name: string; size?: number | string }>(),
  { size: 16 },
);

const paths: Record<string, string> = {
  sun: "M12 4v1m0 14v1m8-8h-1M5 12H4m13.66-5.66l-.7.7M7.05 16.95l-.71.71m11.32 0l-.71-.71M7.05 7.05l-.71-.71M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  moon: "M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zm5.5-1.5L21 21",
  close: "M6 18L18 6M6 6l12 12",
  external:
    "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25",
  check: "M5 12.5l4.5 4.5L19 7.5",
  "arrow-right": "M5 12h14m-6-6l6 6-6 6",
  "arrow-left": "M19 12H5m6 6l-6-6 6-6",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-right": "M9 6l6 6-6 6",
  lock: "M7 11V8a5 5 0 0110 0v3M5 11h14v10H5V11z",
  play: "M8 5.5v13l11-6.5-11-6.5z",
  dot: "M12 12h.01",
  menu: "M4 7h16M4 12h16M4 17h16",
  filter: "M4 5h16l-6 7v6l-4 2v-8L4 5z",
  reset: "M4 12a8 8 0 108-8 8 8 0 00-6 2.7M4 4v4h4",
  spark: "M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z",
  layers: "M12 3l9 5-9 5-9-5 9-5zm9 9l-9 5-9-5m18 4l-9 5-9-5",
  box: "M4 8l8-4 8 4v8l-8 4-8-4V8zm0 0l8 4 8-4M12 12v8",
  leaf: "M5 19c0-8 6-13 14-13 0 9-5 14-13 14H5v-1zM5 19c2-3 5-5 9-6.5",
  package: "M4 8l8-4 8 4v8l-8 4-8-4V8zm4-2l8 4",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z",
  server: "M4 5h16v5H4V5zm0 9h16v5H4v-5zM7 7.5h.01M7 16.5h.01",
  database: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  shuffle: "M4 6h3l10 12h3M4 18h3L17 6h3m0 0l-3-3m3 3l-3 3m3 9l-3-3m3 3l-3 3",
  terminal: "M5 7l4 4-4 4m6 1h8",
  browser: "M3 6h18v13H3V6zm0 4h18M6 8h.01M9 8h.01",
  cpu: "M8 8h8v8H8V8zm-4 2h2m-2 4h2m14-4h2m-2 4h2M10 4v2m4-2v2m-4 12v2m4-2v2",
  scatter: "M4 20V4m0 16h16M8 16h.01M11 11h.01M15 14h.01M18 7h.01",
  rocket: "M12 3c3.5 2 5.5 5.5 5.5 9.5L12 18l-5.5-5.5C6.5 8.5 8.5 5 12 3zm0 6.5h.01M8 18l-2 3m10-3l2 3",
  grid: "M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z",
  half: "M12 3a9 9 0 100 18V3z",
  trophy: "M7 4h10v5a5 5 0 01-10 0V4zM7 6H4v1a3 3 0 003 3m10-4h3v1a3 3 0 01-3 3M9 20h6m-3-4v4",
  flame: "M12 3c1 3.5-2 4.5-2 7a3 3 0 006 0c0-1-.5-2-1-2.5C16.5 9 18 11 18 14a6 6 0 01-12 0c0-4 3-7 6-11z",
  clock: "M12 20a8 8 0 100-16 8 8 0 000 16zm0-12v4l3 2",
  book: "M5 4h9a3 3 0 013 3v13a3 3 0 00-3-3H5V4zm14 0h.01",
  video: "M4 6h11v12H4V6zm11 4l5-3v10l-5-3",
  wrench: "M14 7a4 4 0 01-5.3 5.3L4 17l3 3 4.7-4.7A4 4 0 0117 10l-3-3z",
  users: "M8 12a3 3 0 100-6 3 3 0 000 6zm-5 8c0-2.8 2.2-5 5-5s5 2.2 5 5m3-13a3 3 0 010 6m2 7c0-2-1-3.7-2.5-4.5",
  compass: "M12 21a9 9 0 100-18 9 9 0 000 18zm3-12l-2 5-5 2 2-5 5-2z",
  route: "M6 4v10a4 4 0 004 4h4m0 0l-3-3m3 3l-3 3M6 4h.01",
  target: "M12 21a9 9 0 100-18 9 9 0 000 18zm0-4a5 5 0 100-10 5 5 0 000 10zm0-4a1 1 0 100-2 1 1 0 000 2z",
};

const d = (): string => paths[props.name] ?? paths.dot;
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    class="shrink-0"
  >
    <path :d="d()" />
  </svg>
</template>
