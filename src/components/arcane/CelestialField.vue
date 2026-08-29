<script setup lang="ts">
/**
 * The night sky behind the skill tree.
 *
 * Built as several stacked layers rather than one gradient: nebula regions,
 * three depth bands of stars, a few constellations and a faint orbital
 * geometry. Depth comes from the layering, not from a blur filter.
 *
 * Stars are generated once from a *seeded* PRNG and rendered as SVG. Two
 * reasons: a fixed seed means the sky is identical on every render (an
 * unseeded random would reshuffle the heavens on every reactive update), and
 * a few hundred SVG circles cost far less than the same number of animated
 * DOM elements.
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{ seed?: number; width?: number; height?: number }>(),
  { seed: 20260829, width: 1000, height: 1000 },
);

/** mulberry32 — small, fast, deterministic. */
function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star {
  /** Diamond path, built once at generation time. */
  path: string;
  o: number;
  /** Twinkle period. */
  dur: string;
}

const layers = computed(() => {
  const rng = makeRng(props.seed);
  const W = props.width;
  const H = props.height;

  const band = (count: number, rMin: number, rMax: number, oMin: number, oMax: number) => {
    const out: Star[] = [];
    for (let i = 0; i < count; i++) {
      const x = +(rng() * W).toFixed(1);
      const y = +(rng() * H).toFixed(1);
      const r = +(rMin + rng() * (rMax - rMin)).toFixed(2);
      out.push({
        // A four-pointed diamond: N → E → S → W. Written as a path rather
        // than a rotated <rect> so no transform has to be resolved per star.
        path: `M${x} ${(y - r).toFixed(2)}L${(x + r).toFixed(2)} ${y}L${x} ${(y + r).toFixed(2)}L${(x - r).toFixed(2)} ${y}Z`,
        o: +(oMin + rng() * (oMax - oMin)).toFixed(2),
        // Wide spread of periods so the field never pulses in unison, which
        // would read as a loading indicator instead of a sky.
        dur: `${(3 + rng() * 9).toFixed(1)}s`,
      });
    }
    return out;
  };

  return {
    far: band(190, 0.7, 1.3, 0.35, 0.7),
    mid: band(75, 1.4, 2.2, 0.6, 0.9),
    near: band(26, 2.2, 3.1, 0.85, 1),
  };
});

/** A few small constellations. Fixed coordinates — these are drawn, not
 * random, so they read as charted rather than as scattered noise. */
const constellations = [
  "M120,150 L190,110 L265,165 L240,255 L160,240 Z",
  "M760,120 L830,175 L905,140 L880,235",
  "M180,760 L255,700 L330,745 L300,840 L215,845",
  "M690,690 L775,660 L845,720 L800,805",
];
</script>

<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    preserveAspectRatio="xMidYMid slice"
    class="absolute inset-0 h-full w-full"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="neb-a" cx="26%" cy="28%" r="42%">
        <stop offset="0%" stop-color="rgb(var(--arcane))" stop-opacity="0.3" />
        <stop offset="100%" stop-color="rgb(var(--arcane))" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="neb-b" cx="76%" cy="70%" r="46%">
        <stop offset="0%" stop-color="rgb(var(--astral))" stop-opacity="0.26" />
        <stop offset="100%" stop-color="rgb(var(--astral))" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="neb-c" cx="58%" cy="14%" r="34%">
        <stop offset="0%" stop-color="rgb(var(--ember))" stop-opacity="0.12" />
        <stop offset="100%" stop-color="rgb(var(--ember))" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="vignette" cx="50%" cy="50%" r="62%">
        <stop offset="55%" stop-color="rgb(var(--void-deep))" stop-opacity="0" />
        <stop offset="100%" stop-color="rgb(var(--void-deep))" stop-opacity="0.8" />
      </radialGradient>
    </defs>

    <!-- 1. the void -->
    <rect :width="width" :height="height" fill="rgb(var(--void))" />

    <!-- 2. nebula regions -->
    <rect :width="width" :height="height" fill="url(#neb-a)" />
    <rect :width="width" :height="height" fill="url(#neb-b)" />
    <rect :width="width" :height="height" fill="url(#neb-c)" />

    <!-- 3. faint orbital geometry -->
    <g
      fill="none"
      stroke="rgb(var(--astral))"
      stroke-opacity="0.1"
      stroke-width="1"
    >
      <circle :cx="width / 2" :cy="height / 2" :r="width * 0.42" />
      <circle :cx="width / 2" :cy="height / 2" :r="width * 0.3" />
      <ellipse
        :cx="width / 2"
        :cy="height / 2"
        :rx="width * 0.46"
        :ry="height * 0.22"
      />
    </g>

    <!-- 4. constellations, charted -->
    <g
      fill="none"
      stroke="rgb(var(--astral))"
      stroke-opacity="0.22"
      stroke-width="1"
      stroke-linejoin="round"
    >
      <path v-for="(d, i) in constellations" :key="i" :d="d" />
    </g>

    <!-- 5. star bands, far to near — diamonds, not discs -->
    <g fill="rgb(var(--star))">
      <path v-for="(s, i) in layers.far" :key="`f${i}`" :d="s.path" :opacity="s.o" />
    </g>
    <g fill="rgb(var(--star))" class="motion-safe:animate-twinkle" style="--o: 0.7">
      <path v-for="(s, i) in layers.mid" :key="`m${i}`" :d="s.path" :opacity="s.o" />
    </g>
    <g fill="rgb(var(--star))">
      <path
        v-for="(s, i) in layers.near"
        :key="`n${i}`"
        :d="s.path"
        :opacity="s.o"
        class="motion-safe:animate-twinkle"
        :style="{ '--o': s.o, '--d': s.dur }"
      />
    </g>

    <!-- 6. the dark closing in at the aperture edge -->
    <rect :width="width" :height="height" fill="url(#vignette)" />
  </svg>
</template>
