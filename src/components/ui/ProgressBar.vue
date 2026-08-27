<script setup lang="ts">
withDefaults(
  defineProps<{ percent: number; label?: string; showValue?: boolean }>(),
  { showValue: true },
);
</script>

<template>
  <div>
    <div
      v-if="label || showValue"
      class="mb-1.5 flex items-baseline justify-between gap-3"
    >
      <span v-if="label" class="label-mono">{{ label }}</span>
      <span
        v-if="showValue"
        class="font-mono text-2xs tabular-nums text-muted"
        >{{ Math.round(percent) }}%</span
      >
    </div>
    <div
      class="h-1 w-full overflow-hidden bg-sunken"
      role="progressbar"
      :aria-valuenow="Math.round(percent)"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="label"
    >
      <div
        class="h-full transition-[width] duration-700 ease-out"
        :style="{
          width: `${Math.max(percent, percent > 0 ? 2 : 0)}%`,
          backgroundColor: 'rgb(var(--track))',
        }"
      />
    </div>
  </div>
</template>
