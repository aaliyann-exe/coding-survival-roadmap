<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useReducedMotion } from "@/composables/useMotion";

const props = withDefaults(
  defineProps<{
    percent: number;
    size?: number;
    stroke?: number;
    label?: string;
    sublabel?: string;
  }>(),
  { size: 132, stroke: 6 },
);

const { prefersReducedMotion } = useReducedMotion();

const radius = computed(() => (props.size - props.stroke) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);

const shown = ref(prefersReducedMotion.value ? props.percent : 0);

function animateTo(target: number) {
  if (prefersReducedMotion.value) {
    shown.value = target;
    return;
  }
  const from = shown.value;
  const start = performance.now();
  const duration = 900;
  const step = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    shown.value = from + (target - from) * eased;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

onMounted(() => animateTo(props.percent));
watch(() => props.percent, animateTo);

const offset = computed(
  () => circumference.value - (shown.value / 100) * circumference.value,
);
</script>

<template>
  <div
    class="relative inline-flex items-center justify-center"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="img"
    :aria-label="`${Math.round(percent)}% complete`"
  >
    <svg :width="size" :height="size" class="-rotate-90">
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke-width="stroke"
        class="stroke-line"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke-width="stroke"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        :style="{ stroke: 'rgb(var(--track))' }"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="font-mono text-2xl font-medium tabular-nums text-ink">
        {{ Math.round(shown) }}<span class="text-base text-faint">%</span>
      </span>
      <span v-if="label" class="label-mono mt-1">{{ label }}</span>
      <span v-if="sublabel" class="mt-0.5 text-2xs text-faint">{{ sublabel }}</span>
    </div>
  </div>
</template>
