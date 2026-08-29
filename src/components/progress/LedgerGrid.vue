<script setup lang="ts">
/**
 * The practice record: the contribution graph redrawn as a scribe's ledger.
 *
 * The data is unchanged — the same `activeDays` ISO strings, the same 140-day
 * window, the same Monday-aligned columns. What changed is that the cells are
 * ruled register boxes inside a framed sheet with a visible grid, rather than
 * detached rounded tiles floating on the page background.
 */
import { computed } from "vue";

const props = defineProps<{
  /** ISO YYYY-MM-DD dates on which anything was marked. */
  activeDays: string[];
  windowDays?: number;
}>();

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Cell {
  key: string;
  iso: string | null;
  active: boolean;
}

const days = computed(() => props.windowDays ?? 140);

/** Columns are padded at the front so every column is a real Mon–Sun week
 * and the day labels down the side actually mean something. */
const cells = computed<Cell[]>(() => {
  const marked = new Set(props.activeDays);
  const out: Cell[] = [];
  const now = new Date();
  const total = days.value;

  const start = new Date(now);
  start.setDate(now.getDate() - (total - 1));
  const lead = (start.getDay() + 6) % 7; // 0 = Monday
  for (let i = 0; i < lead; i++) {
    out.push({ key: `pad-${i}`, iso: null, active: false });
  }

  for (let i = total - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    out.push({ key: iso, iso, active: marked.has(iso) });
  }
  return out;
});

const activeCount = computed(() => cells.value.filter((c) => c.active).length);

const dateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "short",
});

function cellTitle(cell: Cell) {
  if (!cell.iso) return undefined;
  const label = dateFormat.format(new Date(`${cell.iso}T00:00:00Z`));
  return `${label} — ${cell.active ? "active" : "nothing marked"}`;
}

defineExpose({ activeCount });
</script>

<template>
  <section class="border-2 border-line bg-surface">
    <header class="flex items-baseline gap-3 border-b-2 border-line px-4 py-2.5">
      <h2
        class="text-[13px] uppercase tracking-[0.2em] text-ink"
        style="font-family: 'Cinzel', Georgia, serif"
      >
        Record of Practice
      </h2>
      <span class="h-px flex-1 bg-line/40" />
      <span class="font-mono text-[10px] tabular-nums text-faint">
        {{ activeCount }} active day{{ activeCount === 1 ? "" : "s" }} / last 20 weeks
      </span>
    </header>

    <div class="custom-scrollbar overflow-x-auto p-4">
      <div class="flex w-max items-start gap-2">
        <!-- Weekday gutter. Alternate rows only — seven labels is noise here. -->
        <div class="grid grid-rows-7 gap-[3px] pr-1">
          <span
            v-for="(day, index) in DAY_LABELS"
            :key="day"
            class="flex h-3 items-center font-mono text-[9px] leading-none text-faint"
          >
            {{ index % 2 === 0 ? day : "" }}
          </span>
        </div>

        <!-- Ruled register. The gap shows the sheet through as grid lines. -->
        <div
          class="grid w-max grid-flow-col grid-rows-7 gap-[3px] border border-line/50 bg-line/25 p-[3px]"
          role="img"
          :aria-label="`${activeCount} active days over the last 20 weeks`"
        >
          <span
            v-for="cell in cells"
            :key="cell.key"
            class="h-3 w-3 border"
            :class="
              !cell.iso
                ? 'border-transparent bg-transparent'
                : cell.active
                  ? 'border-seal/60 bg-seal'
                  : 'border-line/25 bg-canvas'
            "
            :title="cellTitle(cell)"
          />
        </div>
      </div>
    </div>

    <footer
      class="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line/50 px-4 py-2.5"
    >
      <p class="text-[13px] leading-relaxed text-muted">
        A square lights up on any day you mark something. Missing a day is fine — the
        graph is a nudge, not a judge.
      </p>
      <span
        class="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-faint"
      >
        Quiet
        <span class="h-3 w-3 border border-line/25 bg-canvas" />
        <span class="h-3 w-3 border border-seal/60 bg-seal" />
        Active
      </span>
    </footer>
  </section>
</template>
