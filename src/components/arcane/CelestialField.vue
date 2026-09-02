<script setup lang="ts">
/**
 * The sky behind the skill tree — the same aperture at two hours of the day.
 *
 * The dark theme looks out on night: nebula regions, three depth bands of
 * stars, a few constellations and a faint orbital geometry. The light theme
 * looks out on daylight instead, running from dawn at the top of the frame
 * down to the sun going out at the bottom. Depth in both comes from the
 * layering, not from a blur filter.
 *
 * The two skies are swapped with `v-if` rather than with CSS so the unused one
 * costs nothing: the night alone is nearly three hundred separately animated
 * star paths, and there is no reason to keep them running behind daylight.
 *
 * Stars are generated once from a *seeded* PRNG and rendered as SVG. Two
 * reasons: a fixed seed means the sky is identical on every render (an
 * unseeded random would reshuffle the heavens on every reactive update), and
 * a few hundred SVG paths cost far less than the same number of animated
 * DOM elements.
 */
import { computed } from "vue";
import { useTheme } from "@/composables/useTheme";

const props = withDefaults(
  defineProps<{ seed?: number; width?: number; height?: number }>(),
  { seed: 20260829, width: 1000, height: 1000 },
);

const { isDark } = useTheme();

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
  /** Negative, and shorter than the period, so each star opens partway
   *  through its own cycle. Without it every star sharing a period starts at
   *  full brightness together and the field beats in visible waves. */
  delay: string;
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
      // Wide spread of periods so the field never pulses in unison, which
      // would read as a loading indicator instead of a sky.
      const dur = 3 + rng() * 9;
      out.push({
        // A four-pointed diamond: N → E → S → W. Written as a path rather
        // than a rotated <rect> so no transform has to be resolved per star.
        path: `M${x} ${(y - r).toFixed(2)}L${(x + r).toFixed(2)} ${y}L${x} ${(y + r).toFixed(2)}L${(x - r).toFixed(2)} ${y}Z`,
        o: +(oMin + rng() * (oMax - oMin)).toFixed(2),
        dur: `${dur.toFixed(1)}s`,
        delay: `${(-rng() * dur).toFixed(1)}s`,
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

/** The daytime cloud bank. Placed by hand rather than seeded so the banks
 * thin out toward the horizon the way real ones do. */
const clouds = [
  { cx: 190, cy: 155, rx: 210, ry: 42 },
  { cx: 700, cy: 250, rx: 250, ry: 46 },
  { cx: 340, cy: 420, rx: 200, ry: 34 },
  { cx: 830, cy: 520, rx: 180, ry: 30 },
  { cx: 240, cy: 660, rx: 230, ry: 26 },
  { cx: 660, cy: 735, rx: 260, ry: 22 },
];

/** Evening cloud, flattened and lit from underneath near the horizon. */
const streaks = [
  { cx: 420, cy: 812, rx: 330, ry: 8 },
  { cx: 760, cy: 858, rx: 250, ry: 7 },
  { cx: 300, cy: 900, rx: 290, ry: 6 },
  { cx: 640, cy: 942, rx: 210, ry: 5 },
];

/** Three birds, far off: the daytime answer to the charted constellations —
 * drawn, not scattered, and just enough to give the sky a scale. */
const birds = ["M392 352 l14 -9 l14 9", "M436 336 l11 -7 l11 7", "M466 364 l9 -6 l9 6"];
</script>

<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    preserveAspectRatio="xMidYMid slice"
    class="absolute inset-0 h-full w-full"
    aria-hidden="true"
  >
    <!-- ==================== NIGHT ==================== -->
    <template v-if="isDark">
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
      <g fill="none" stroke="rgb(var(--astral))" stroke-opacity="0.1" stroke-width="1">
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

      <!-- 5. star bands, far to near — diamonds, not discs. Every star
           twinkles on its own period and its own phase; a band animated as a
           single group blinks in lockstep, which reads as a fault rather
           than as a sky. -->
      <g fill="rgb(var(--star))">
        <path
          v-for="(s, i) in layers.far"
          :key="`f${i}`"
          :d="s.path"
          :opacity="s.o"
          class="motion-safe:animate-twinkle"
          :style="{ '--o': s.o, '--d': s.dur, animationDelay: s.delay }"
        />
      </g>
      <g fill="rgb(var(--star))">
        <path
          v-for="(s, i) in layers.mid"
          :key="`m${i}`"
          :d="s.path"
          :opacity="s.o"
          class="motion-safe:animate-twinkle"
          :style="{ '--o': s.o, '--d': s.dur, animationDelay: s.delay }"
        />
      </g>
      <g fill="rgb(var(--star))">
        <path
          v-for="(s, i) in layers.near"
          :key="`n${i}`"
          :d="s.path"
          :opacity="s.o"
          class="motion-safe:animate-twinkle"
          :style="{ '--o': s.o, '--d': s.dur, animationDelay: s.delay }"
        />
      </g>

      <!-- 6. the dark closing in at the aperture edge -->
      <rect :width="width" :height="height" fill="url(#vignette)" />
    </template>

    <!-- ==================== DAY ====================
         The same six-layer build one sky earlier: ground, weather, the light
         source, the drawn detail, then the aperture edge. The gradient runs
         the full height of the portal, so dawn sits at the first stage band
         and the sun goes down past the last one. -->
    <template v-else>
      <defs>
        <linearGradient id="daylight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgb(var(--sky-dawn))" />
          <stop offset="32%" stop-color="rgb(var(--sky-high))" />
          <stop offset="62%" stop-color="rgb(var(--sky-pale))" />
          <stop offset="84%" stop-color="rgb(var(--sky-dusk))" />
          <stop offset="100%" stop-color="rgb(var(--sky-ember))" />
        </linearGradient>
        <radialGradient id="sun-glow" cx="66%" cy="86%" r="44%">
          <stop offset="0%" stop-color="rgb(var(--sun))" stop-opacity="0.95" />
          <stop offset="38%" stop-color="rgb(var(--sun))" stop-opacity="0.28" />
          <stop offset="100%" stop-color="rgb(var(--sun))" stop-opacity="0" />
        </radialGradient>
        <!-- Cloud edges are softened by gradient rather than by a blur
             filter: a filter over a portal this tall is expensive to
             rasterise, and it has to repaint on every scroll. -->
        <radialGradient id="cloud">
          <stop offset="0%" stop-color="#fff" stop-opacity="0.85" />
          <stop offset="55%" stop-color="#fff" stop-opacity="0.34" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="streak">
          <stop offset="0%" stop-color="rgb(var(--sun))" stop-opacity="0.85" />
          <stop offset="60%" stop-color="rgb(var(--sun))" stop-opacity="0.3" />
          <stop offset="100%" stop-color="rgb(var(--sun))" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="day-vignette" cx="50%" cy="50%" r="62%">
          <stop offset="55%" stop-color="rgb(var(--sky-ember))" stop-opacity="0" />
          <stop offset="100%" stop-color="rgb(var(--sky-ember))" stop-opacity="0.4" />
        </radialGradient>
      </defs>

      <!-- 1. dawn overhead, evening at the sill -->
      <rect :width="width" :height="height" fill="url(#daylight)" />

      <!-- 2. the sun's haze, spilling back up into the lower half -->
      <rect :width="width" :height="height" fill="url(#sun-glow)" />

      <!-- 3. the cloud bank, drifting as one so the sky is never quite still -->
      <g class="motion-safe:animate-drift">
        <ellipse
          v-for="(c, i) in clouds"
          :key="`c${i}`"
          :cx="c.cx"
          :cy="c.cy"
          :rx="c.rx"
          :ry="c.ry"
          fill="url(#cloud)"
        />
      </g>

      <!-- 4. the sun itself, low and going down -->
      <circle
        :cx="width * 0.66"
        :cy="height * 0.86"
        :r="width * 0.05"
        fill="rgb(var(--sun))"
        opacity="0.9"
      />

      <!-- 5. the lit streaks along the horizon, and three birds far off -->
      <g>
        <ellipse
          v-for="(s, i) in streaks"
          :key="`s${i}`"
          :cx="s.cx"
          :cy="s.cy"
          :rx="s.rx"
          :ry="s.ry"
          fill="url(#streak)"
        />
      </g>
      <g
        fill="none"
        stroke="rgb(var(--sky-ink))"
        stroke-opacity="0.3"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path v-for="(d, i) in birds" :key="`b${i}`" :d="d" />
      </g>

      <!-- 6. the light warming at the aperture edge -->
      <rect :width="width" :height="height" fill="url(#day-vignette)" />
    </template>
  </svg>
</template>
