<script setup lang="ts">
/**
 * The arcane alphabet.
 *
 * Nine original sigils built from geometric primitives - triangles, circles,
 * chords, bars - rather than scattered Unicode. They are *visual metadata*:
 * assigned to nodes by hashing the node id so the mapping is stable, and they
 * never replace or alter any content.
 */
import { computed } from "vue";
import { sigilFor, type SigilName } from "./sigils";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{ name?: SigilName; seed?: string; size?: number | string }>(),
  { size: 16 },
);

const resolved = computed<SigilName>(() =>
  props.name ? props.name : props.seed ? sigilFor(props.seed) : "arcane",
);
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    fill="none"
    stroke="currentColor"
    stroke-width="1.15"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    class="shrink-0"
    v-bind="$attrs"
  >
    <!-- fire — ascending triangle, barred -->
    <template v-if="resolved === 'fire'">
      <path d="M12 3.5 20 18.5H4Z" />
      <path d="M8.5 12.5h7" />
      <circle cx="12" cy="15.5" r="1.3" />
    </template>

    <!-- water — descending triangle, barred -->
    <template v-else-if="resolved === 'water'">
      <path d="M12 20.5 4 5.5h16Z" />
      <path d="M8.5 11.5h7" />
      <circle cx="12" cy="8.5" r="1.3" />
    </template>

    <!-- earth — squared triangle within a ring -->
    <template v-else-if="resolved === 'earth'">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 5.5 18.5 17h-13Z" />
      <path d="M7.5 13.5h9" />
    </template>

    <!-- air — stacked chevrons rising -->
    <template v-else-if="resolved === 'air'">
      <path d="M5 15.5 12 9l7 6.5" />
      <path d="M5 19.5 12 13l7 6.5" />
      <circle cx="12" cy="5" r="1.4" />
    </template>

    <!-- arcane — hexagram of two interlocking triangles -->
    <template v-else-if="resolved === 'arcane'">
      <path d="M12 3.5 20 17.5H4Z" />
      <path d="M12 20.5 4 6.5h16Z" />
      <circle cx="12" cy="12" r="2.1" />
    </template>

    <!-- celestial — star within concentric orbits -->
    <template v-else-if="resolved === 'celestial'">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.2" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
      <path d="M12 8.6l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1Z" />
    </template>

    <!-- void — broken ring around an empty centre -->
    <template v-else-if="resolved === 'void'">
      <path d="M12 3.2a8.8 8.8 0 0 1 0 17.6" />
      <path d="M12 20.8A8.8 8.8 0 0 1 5.6 6" />
      <path d="M12 7.4v9.2" />
      <path d="M8.4 12h7.2" />
    </template>

    <!-- nature — branching stem -->
    <template v-else-if="resolved === 'nature'">
      <path d="M12 21V6.5" />
      <path d="M12 12.5 6.8 8M12 12.5 17.2 8M12 17 8 13.6M12 17l4-3.4" />
      <circle cx="12" cy="4.4" r="1.7" />
    </template>

    <!-- knowledge — opened codex with a rule -->
    <template v-else>
      <path d="M12 6.4v13" />
      <path d="M12 6.4C10 4.9 7.4 4.4 4 4.6v12.6c3.4-.2 6 .3 8 1.8" />
      <path d="M12 6.4c2-1.5 4.6-2 8-1.8v12.6c-3.4-.2-6 .3-8 1.8" />
    </template>
  </svg>
</template>
