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
import LedgerGrid from "@/components/progress/LedgerGrid.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import BookSpread from "@/components/book/BookSpread.vue";

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

/** Everything cleared, in roadmap order. This was labelled "Recently
 * cleared" and took the last eight, but nothing records *when* a topic was
 * marked — that was just the tail of the data file, in data order. Rather
 * than store timestamps for one strip of chips, the label now says what the
 * list actually is. */
const CLEARED_SHOWN = 12;
const clearedTopics = computed(() =>
  allNodes.filter((n) => completedNodeIds.value.has(n.id)),
);

const builtProjects = computed(() =>
  projectList.filter((p) => completedProjectIds.value.has(p.id)),
);

/** Nothing marked, nothing built, no active days: a first visit. Several
 * sections below are meaningless in that state, and one of them (the reset
 * control) offers to wipe something that does not exist yet. */
const hasProgress = computed(
  () =>
    completedNodeIds.value.size > 0 ||
    startedNodeIds.value.size > 0 ||
    completedProjectIds.value.size > 0,
);

const currentRoadmap = computed(() => {
  const ranked = [...perRoadmap.value].sort(
    (a, b) => b.completed + b.inProgress - (a.completed + a.inProgress),
  );
  const top = ranked[0];
  return top && top.completed + top.inProgress > 0 ? top : null;
});

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
  <BookSpread
    eyebrow="Local to this browser, no account, no tracking"
    title="Progress"
    folio="Folio V — The Apprentice's Record"
  >
    <template #left>
      <div class="flex flex-col items-start gap-6">
        <ProgressRing :percent="overallPercent" label="Overall" :size="140" />
        <div>
          <p class="mb-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
            Current skill level
          </p>
          <p
            class="mb-5 text-lg leading-tight text-ink"
            style="font-family: 'Cinzel', Georgia, serif"
          >
            {{ skillLevel }}
          </p>
          <p class="mb-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
            Current roadmap
          </p>
          <p
            class="text-lg leading-tight text-ink"
            style="font-family: 'Cinzel', Georgia, serif"
          >
            {{ currentRoadmap?.roadmap.title ?? "Not started yet" }}
          </p>
        </div>
      </div>
    </template>

    <!-- The register of figures. Numbers are right-aligned against leader
         rules like a real ledger, instead of sitting in a grid of stat tiles.
         (The seal and skill level live on the facing page.) -->
    <section v-if="hasProgress" class="mb-12">
      <div class="border-2 border-line bg-surface p-5 sm:p-6">
        <p class="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
          Register of standing
        </p>
        <dl>
          <div class="ledger-row">
            <dt class="ledger-label">Topics done</dt>
            <span class="ledger-rule" aria-hidden="true" />
            <dd class="ledger-value text-base">
              {{ completedNodeIds.size }}<span class="text-xs text-faint"
                >/{{ allNodes.length }}</span
              >
            </dd>
          </div>
          <div class="ledger-row">
            <dt class="ledger-label">Projects built</dt>
            <span class="ledger-rule" aria-hidden="true" />
            <dd class="ledger-value text-base">
              {{ completedProjectIds.size }}<span class="text-xs text-faint"
                >/{{ projectList.length }}</span
              >
            </dd>
          </div>
          <div class="ledger-row">
            <dt class="ledger-label">In progress</dt>
            <span class="ledger-rule" aria-hidden="true" />
            <dd class="ledger-value text-base">{{ startedNodeIds.size }}</dd>
          </div>
          <div class="ledger-row">
            <dt class="ledger-label">Current streak</dt>
            <span class="ledger-rule" aria-hidden="true" />
            <dd class="ledger-value text-base">
              {{ streak }} <span class="text-xs text-faint">days</span>
            </dd>
          </div>
          <div class="ledger-row">
            <dt class="ledger-label">Longest streak</dt>
            <span class="ledger-rule" aria-hidden="true" />
            <dd class="ledger-value text-base">
              {{ longestStreak }} <span class="text-xs text-faint">days</span>
            </dd>
          </div>
          <div class="ledger-row border-b-0">
            <dt class="ledger-label">Est. study hours</dt>
            <span class="ledger-rule" aria-hidden="true" />
            <dd class="ledger-value text-base">~{{ totalEstimatedHours }}</dd>
          </div>
        </dl>
        <p class="mt-4 text-[13px] leading-relaxed text-faint">
          Study hours are an estimate derived from the time ranges on each completed
          topic, not a stopwatch. Treat it as a vibe, not a timesheet.
        </p>
      </div>
    </section>

    <!-- Nothing recorded yet. A register of zeros and an empty practice grid
         say "this feature is broken" rather than "you haven't started" — so
         the first visit gets a short explanation of how anything gets in
         here, and a way through to the roadmaps. -->
    <section v-else class="mb-12 border-2 border-line bg-surface p-6 sm:p-8">
      <p class="label-mono mb-3">Nothing recorded yet</p>
      <h2 class="mb-3 text-xl leading-snug text-ink">
        This page fills itself in as you go
      </h2>
      <p class="mb-6 max-w-xl text-[14px] leading-relaxed text-muted">
        Open any topic and mark it started, completed or mastered, or tick a
        project off once you've built it. That's the whole mechanism — the
        streak, the study-hour estimate and the achievements are all worked out
        from those marks. It's stored in this browser, so nothing here is
        waiting on a server.
      </p>
      <div class="flex flex-wrap gap-2.5">
        <RouterLink v-if="nextUp" :to="`/roadmaps/${roadmapForNode(nextUp.node.id)?.id}?node=${nextUp.node.id}`" class="btn btn-primary">
          <AppIcon name="arrow-right" :size="12" /> Start with {{ nextUp.node.title }}
        </RouterLink>
        <RouterLink to="/roadmaps" class="btn">See all three paths</RouterLink>
      </div>
    </section>

    <!-- practice record -->
    <section v-if="hasProgress" class="mb-12">
      <LedgerGrid :active-days="state.activeDays" />
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
          class="group flex items-center gap-3 border border-gild/50 bg-gild/[0.06] p-4 text-left transition-colors hover:border-gild"
          @click="openNode(node.id)"
        >
          <span class="h-1.5 w-1.5 shrink-0 bg-gild" />
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

    <!-- cleared -->
    <section v-if="clearedTopics.length || builtProjects.length" class="mb-14">
      <div class="section-head">
        <h2>Cleared so far</h2>
        <span class="section-rule" aria-hidden="true" />
        <span class="section-count"
          >{{ clearedTopics.length }} + {{ builtProjects.length }} built</span
        >
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="node in clearedTopics.slice(0, CLEARED_SHOWN)"
          :key="node.id"
          type="button"
          class="chip chip-sealed min-h-[1.75rem] transition-colors hover:border-seal"
          @click="openNode(node.id)"
        >
          <AppIcon name="check" :size="10" /> {{ node.title }}
        </button>
        <span
          v-if="clearedTopics.length > CLEARED_SHOWN"
          class="chip min-h-[1.75rem] border-dashed"
          >+{{ clearedTopics.length - CLEARED_SHOWN }} more</span
        >
        <span
          v-for="project in builtProjects"
          :key="project.id"
          class="chip min-h-[1.75rem]"
        >
          <AppIcon name="box" :size="10" /> {{ project.title }}
        </span>
      </div>
    </section>

    <!-- achievements -->
    <section class="mb-14">
      <div class="section-head">
        <h2>Achievements</h2>
        <span class="section-rule" aria-hidden="true" />
        <span class="section-count"
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

    <!-- Offering to wipe progress that does not exist yet is dead UI. -->
    <section v-if="hasProgress" class="border border-line bg-raised/50 p-5">
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
          class="btn border-wax/50 text-wax hover:border-wax hover:bg-wax hover:text-canvas"
          @click="doReset"
        >
          Yes, wipe it
        </button>
        <button type="button" class="btn" @click="confirmReset = false">
          Actually no
        </button>
      </div>
    </section>
    <p class="folio mt-10 text-right">Folio V</p>
  </BookSpread>
</template>
