<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { allNodes, roadmapForNode } from "@/data/roadmaps";
import projectList from "@/data/projects";
import { useProgress } from "@/composables/useProgress";
import { useAchievements } from "@/composables/useAchievements";
import ProgressRing from "@/components/ui/ProgressRing.vue";
import ProgressBar from "@/components/ui/ProgressBar.vue";
import AchievementCard from "@/components/achievements/AchievementCard.vue";
import AppIcon from "@/components/ui/AppIcon.vue";

const router = useRouter();
const {
  state,
  completedNodeIds,
  startedNodeIds,
  completedProjectIds,
  overallPercent,
  perRoadmap,
  streak,
  longestStreak,
  totalEstimatedHours,
  skillLevel,
  nextUp,
  resetEverything,
} = useProgress();

const { unlocked, locked } = useAchievements();

const confirmReset = ref(false);

const inProgressNodes = computed(() =>
  allNodes.filter((n) => startedNodeIds.value.has(n.id)),
);

const recentCompleted = computed(() =>
  allNodes.filter((n) => completedNodeIds.value.has(n.id)).slice(-8).reverse(),
);

const builtProjects = computed(() =>
  projectList.filter((p) => completedProjectIds.value.has(p.id)),
);

const currentRoadmap = computed(() => {
  const ranked = [...perRoadmap.value].sort(
    (a, b) => b.completed + b.inProgress - (a.completed + a.inProgress),
  );
  const top = ranked[0];
  return top && top.completed + top.inProgress > 0 ? top : null;
});

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WINDOW_DAYS = 140;

interface Cell {
  key: string;
  iso: string | null;
  active: boolean;
}

/** Last 20 weeks of activity, GitHub-graph style but honest about scale.
 * Columns are padded at the front so every column is a real Mon–Sun week
 * and the day labels down the side actually mean something. */
const activityGrid = computed(() => {
  const days = new Set(state.activeDays);
  const cells: Cell[] = [];
  const now = new Date();

  const start = new Date(now);
  start.setDate(now.getDate() - (WINDOW_DAYS - 1));
  const lead = (start.getDay() + 6) % 7; // 0 = Monday
  for (let i = 0; i < lead; i++) {
    cells.push({ key: `pad-${i}`, iso: null, active: false });
  }

  for (let i = WINDOW_DAYS - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    cells.push({ key: iso, iso, active: days.has(iso) });
  }
  return cells;
});

const activeDaysInWindow = computed(
  () => activityGrid.value.filter((c) => c.active).length,
);

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

function openNode(id: string) {
  const owner = roadmapForNode(id);
  router.push({ path: `/roadmaps/${owner?.id}`, query: { node: id } });
}

function doReset() {
  resetEverything();
  confirmReset.value = false;
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
    <header class="mb-12">
      <p class="label-mono mb-3">Local to this browser, no account, no tracking</p>
      <h1 class="text-3xl font-light leading-tight tracking-tight text-ink md:text-4xl">
        Progress
      </h1>
    </header>

    <!-- top stats -->
    <section
      class="mb-14 grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-14"
    >
      <div class="flex items-center gap-8">
        <ProgressRing :percent="overallPercent" label="Overall" :size="150" />
        <div>
          <p class="label-mono mb-1.5">Current skill level</p>
          <p class="mb-6 text-lg font-normal text-ink">{{ skillLevel }}</p>
          <p class="label-mono mb-1.5">Current roadmap</p>
          <p class="text-lg font-normal text-ink">
            {{ currentRoadmap?.roadmap.title ?? "Not started yet" }}
          </p>
        </div>
      </div>

      <dl class="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
        <div class="bg-surface p-4">
          <dt class="label-mono mb-1.5">Topics done</dt>
          <dd class="font-mono text-2xl tabular-nums text-ink">
            {{ completedNodeIds.size }}
            <span class="text-xs text-faint">/ {{ allNodes.length }}</span>
          </dd>
        </div>
        <div class="bg-surface p-4">
          <dt class="label-mono mb-1.5">Projects built</dt>
          <dd class="font-mono text-2xl tabular-nums text-ink">
            {{ completedProjectIds.size }}
            <span class="text-xs text-faint">/ {{ projectList.length }}</span>
          </dd>
        </div>
        <div class="bg-surface p-4">
          <dt class="label-mono mb-1.5">In progress</dt>
          <dd class="font-mono text-2xl tabular-nums text-ink">
            {{ startedNodeIds.size }}
          </dd>
        </div>
        <div class="bg-surface p-4">
          <dt class="label-mono mb-1.5">Current streak</dt>
          <dd class="font-mono text-2xl tabular-nums text-ink">
            {{ streak }} <span class="text-xs text-faint">days</span>
          </dd>
        </div>
        <div class="bg-surface p-4">
          <dt class="label-mono mb-1.5">Longest streak</dt>
          <dd class="font-mono text-2xl tabular-nums text-ink">
            {{ longestStreak }} <span class="text-xs text-faint">days</span>
          </dd>
        </div>
        <div class="bg-surface p-4">
          <dt class="label-mono mb-1.5">Est. study hours</dt>
          <dd class="font-mono text-2xl tabular-nums text-ink">
            ~{{ totalEstimatedHours }}
          </dd>
        </div>
      </dl>
    </section>

    <p class="-mt-10 mb-14 text-2xs leading-relaxed text-faint">
      Study hours are an estimate derived from the time ranges on each completed
      topic, not a stopwatch. Treat it as a vibe, not a timesheet.
    </p>

    <!-- activity -->
    <section class="mb-14">
      <div class="mb-5 flex items-center gap-3">
        <h2 class="font-mono text-[11px] uppercase tracking-widest text-muted">
          Last 20 weeks
        </h2>
        <span class="h-px flex-1 bg-line" />
        <span class="font-mono text-[10px] tabular-nums text-faint">
          {{ activeDaysInWindow }} active day{{ activeDaysInWindow === 1 ? "" : "s" }}
        </span>
      </div>

      <div class="custom-scrollbar overflow-x-auto pb-2">
        <div class="flex w-max items-start gap-2">
          <!-- Weekday gutter. Only alternate rows are labelled, same as the
               graph this is imitating — seven labels is noise at this size. -->
          <div class="grid grid-rows-7 gap-1 pt-px">
            <span
              v-for="(day, index) in DAY_LABELS"
              :key="day"
              class="flex h-2.5 items-center font-mono text-[9px] leading-none text-faint"
            >
              {{ index % 2 === 0 ? day : "" }}
            </span>
          </div>

          <div
            class="grid w-max grid-flow-col grid-rows-7 gap-1"
            role="img"
            :aria-label="`${activeDaysInWindow} active days over the last 20 weeks`"
          >
            <span
              v-for="cell in activityGrid"
              :key="cell.key"
              class="h-2.5 w-2.5"
              :class="!cell.iso ? '' : cell.active ? '' : 'bg-sunken'"
              :style="cell.active ? { backgroundColor: 'rgb(var(--track))' } : undefined"
              :title="cellTitle(cell)"
            />
          </div>
        </div>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p class="text-2xs text-faint">
          A square lights up on any day you mark something. Missing a day is fine — the
          graph is a nudge, not a judge.
        </p>
        <span class="ml-auto flex shrink-0 items-center gap-1.5 text-2xs text-faint">
          Quiet
          <span class="h-2.5 w-2.5 bg-sunken" />
          <span class="h-2.5 w-2.5" style="background-color: rgb(var(--track))" />
          Active
        </span>
      </div>
    </section>

    <!-- per roadmap -->
    <section class="mb-14">
      <h2 class="rule-heading mb-5">By roadmap</h2>
      <div class="grid gap-4 md:grid-cols-3">
        <RouterLink
          v-for="entry in perRoadmap"
          :key="entry.roadmap.id"
          :to="`/roadmaps/${entry.roadmap.id}`"
          class="border border-line bg-surface p-5 transition-colors hover:border-line-strong"
          :class="entry.roadmap.trackClass"
        >
          <p class="mb-4 text-[15px] text-ink">{{ entry.roadmap.title }}</p>
          <ProgressBar
            :percent="entry.percent"
            :label="`${entry.completed}/${entry.total} topics`"
          />
          <p class="mt-3 font-mono text-[10px] uppercase tracking-widest text-faint">
            {{ entry.projectsCompleted }}/{{ entry.projectsTotal }} projects built
          </p>
        </RouterLink>
      </div>
    </section>

    <!-- continue -->
    <section v-if="nextUp || inProgressNodes.length" class="mb-14">
      <h2 class="rule-heading mb-5">Pick back up</h2>
      <div class="grid gap-3 sm:grid-cols-2">
        <button
          v-for="node in inProgressNodes"
          :key="node.id"
          type="button"
          class="group flex items-center gap-3 border border-amber-500/40 bg-amber-500/[0.04] p-4 text-left transition-colors hover:border-amber-500/70"
          @click="openNode(node.id)"
        >
          <span class="h-1.5 w-1.5 shrink-0 bg-amber-500" />
          <span class="min-w-0 flex-1">
            <span class="block truncate text-[14px] text-ink">{{ node.title }}</span>
            <span class="block truncate text-2xs text-faint">In progress</span>
          </span>
          <AppIcon
            name="arrow-right"
            :size="13"
            class="text-faint transition-transform group-hover:translate-x-0.5"
          />
        </button>

        <button
          v-if="nextUp && nextUp.reason === 'available'"
          type="button"
          class="group flex items-center gap-3 border border-line bg-surface p-4 text-left transition-colors hover:border-line-strong"
          @click="openNode(nextUp.node.id)"
        >
          <span class="h-1.5 w-1.5 shrink-0" style="background-color: rgb(var(--track))" />
          <span class="min-w-0 flex-1">
            <span class="block truncate text-[14px] text-ink">{{
              nextUp.node.title
            }}</span>
            <span class="block truncate text-2xs text-faint">Recommended next</span>
          </span>
          <AppIcon
            name="arrow-right"
            :size="13"
            class="text-faint transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </section>

    <!-- recent -->
    <section v-if="recentCompleted.length || builtProjects.length" class="mb-14">
      <h2 class="rule-heading mb-5">Recently cleared</h2>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="node in recentCompleted"
          :key="node.id"
          type="button"
          class="chip border-emerald-500/30 text-emerald-700 transition-colors hover:border-emerald-500/60 dark:text-emerald-400"
          @click="openNode(node.id)"
        >
          <AppIcon name="check" :size="10" /> {{ node.title }}
        </button>
        <span v-for="project in builtProjects" :key="project.id" class="chip">
          <AppIcon name="box" :size="10" /> {{ project.title }}
        </span>
      </div>
    </section>

    <!-- achievements -->
    <section class="mb-14">
      <div class="mb-5 flex items-center gap-3">
        <h2 class="font-mono text-[11px] uppercase tracking-widest text-muted">
          Achievements
        </h2>
        <span class="h-px flex-1 bg-line" />
        <span class="font-mono text-[10px] text-faint"
          >{{ unlocked.length }} / {{ unlocked.length + locked.length }}</span
        >
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AchievementCard
          v-for="achievement in unlocked"
          :key="achievement.id"
          :achievement="achievement"
          :unlocked="true"
        />
        <AchievementCard
          v-for="achievement in locked"
          :key="achievement.id"
          :achievement="achievement"
          :unlocked="false"
        />
      </div>
    </section>

    <!-- danger zone -->
    <section class="border border-line bg-raised/50 p-5">
      <h2 class="label-mono mb-2">Start over</h2>
      <p class="mb-4 max-w-xl text-[13px] font-light leading-relaxed text-muted">
        Wipes every topic, project and streak stored in this browser. There is no undo
        and no backup, because there's no server. Be sure.
      </p>
      <div v-if="!confirmReset">
        <button type="button" class="btn" @click="confirmReset = true">
          <AppIcon name="reset" :size="12" /> Reset all progress
        </button>
      </div>
      <div v-else class="flex flex-wrap gap-2">
        <button
          type="button"
          class="btn border-red-500/40 text-red-600 hover:border-red-500/70 dark:text-red-400"
          @click="doReset"
        >
          Yes, wipe it
        </button>
        <button type="button" class="btn" @click="confirmReset = false">
          Actually no
        </button>
      </div>
    </section>
  </div>
</template>
