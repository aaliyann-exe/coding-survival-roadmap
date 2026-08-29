<script setup lang="ts">
/**
 * The casting seal — the loading state for a chapter change.
 *
 * Drawn entirely from geometry: concentric rules, a counter-rotating rune
 * ring, an inscribed hexagram, elemental marks at the cardinal points and a
 * central sigil. It is deliberately not a spinner: nothing here is a single
 * arc chasing its own tail.
 *
 * It ignites *on the page* rather than over the browser, so the tome never
 * stops reading as a physical object.
 */
import { computed } from "vue";
import ArcaneSigil from "./ArcaneSigil.vue";
import type { SigilName } from "./sigils";

const props = withDefaults(
  defineProps<{ size?: number; still?: boolean }>(),
  { size: 240, still: false },
);

/** 24 tick marks around the rune ring. */
const ticks = Array.from({ length: 24 }, (_, i) => i * 15);

/** The four cardinal elements, placed on the outer ring. */
const cardinals: { name: SigilName; x: number; y: number }[] = [
  { name: "air", x: 100, y: 22 },
  { name: "fire", x: 178, y: 100 },
  { name: "earth", x: 100, y: 178 },
  { name: "water", x: 22, y: 100 },
];

const spin = computed(() => (props.still ? "" : "animate-rune-spin"));
const spinRev = computed(() => (props.still ? "" : "animate-rune-spin-rev"));
</script>

<template>
  <div
    class="pointer-events-none relative"
    :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true"
  >
    <svg viewBox="0 0 200 200" class="h-full w-full overflow-visible">
      <defs>
        <radialGradient id="seal-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgb(var(--ember))" stop-opacity="0.34" />
          <stop offset="55%" stop-color="rgb(var(--ember))" stop-opacity="0.09" />
          <stop offset="100%" stop-color="rgb(var(--ember))" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- the page beneath catching the light of the spell -->
      <circle cx="100" cy="100" r="96" fill="url(#seal-glow)" />

      <g
        fill="none"
        stroke="rgb(var(--portal-rim))"
        stroke-linecap="round"
        stroke-width="1"
      >
        <!-- outer rules -->
        <circle cx="100" cy="100" r="88" stroke-opacity="0.85" />
        <circle cx="100" cy="100" r="83" stroke-opacity="0.4" />

        <!-- rune ring: ticks, turning slowly -->
        <g :class="spin" style="transform-origin: 100px 100px">
          <line
            v-for="(t, i) in ticks"
            :key="t"
            x1="100"
            :y1="i % 3 === 0 ? 12 : 15"
            x2="100"
            y2="21"
            :stroke-opacity="i % 3 === 0 ? 0.95 : 0.45"
            :style="{ transform: `rotate(${t}deg)`, transformOrigin: '100px 100px' }"
          />
        </g>

        <!-- inscribed geometry, turning the other way -->
        <g :class="spinRev" style="transform-origin: 100px 100px">
          <circle cx="100" cy="100" r="62" stroke-opacity="0.6" />
          <path
            d="M100 42 150 130H50Z"
            stroke="rgb(var(--arcane))"
            stroke-opacity="0.75"
          />
          <path
            d="M100 158 50 70h100Z"
            stroke="rgb(var(--astral))"
            stroke-opacity="0.6"
          />
        </g>

        <!-- inner sanctum -->
        <circle cx="100" cy="100" r="34" stroke-opacity="0.75" />
        <circle cx="100" cy="100" r="29" stroke-opacity="0.35" />
      </g>

      <!-- elemental marks at the cardinal points -->
      <g stroke="rgb(var(--ember))" fill="none">
        <foreignObject
          v-for="c in cardinals"
          :key="c.name"
          :x="c.x - 9"
          :y="c.y - 9"
          width="18"
          height="18"
        >
          <div class="flex h-full w-full items-center justify-center text-[rgb(var(--ember))]">
            <ArcaneSigil :name="c.name" :size="15" />
          </div>
        </foreignObject>
      </g>
    </svg>

    <!-- central sigil -->
    <div
      class="absolute inset-0 flex items-center justify-center text-[rgb(var(--ember))]"
    >
      <ArcaneSigil name="arcane" :size="Math.round(size * 0.17)" />
    </div>
  </div>
</template>
