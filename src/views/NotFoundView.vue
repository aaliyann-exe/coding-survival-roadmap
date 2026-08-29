<script setup lang="ts">
import { computed, ref } from "vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import BookSpread from "@/components/book/BookSpread.vue";
import ArcaneSigil from "@/components/arcane/ArcaneSigil.vue";

/** Poking the 404 enough times gets you the confession. */
const pokes = ref(0);
const CONFESSION_AT = 5;

const revealed = computed(() => pokes.value >= CONFESSION_AT);

const nudge = computed(() => {
  if (revealed.value) return "";
  if (pokes.value === 0) return "";
  if (pokes.value < 3) return "that's not a button. keep going though";
  return "okay fine, one more";
});

/**
 * The missing page as a tavern notice board rather than a stack trace. The
 * old version leaned on router internals and file paths, which is a joke for
 * about four people; this one anybody gets.
 */
const notice = [
  { label: "Last seen", value: "Never. Not once. Not by anyone." },
  { label: "Reward", value: "Nothing. I have no money, only opinions." },
  { label: "Height", value: "About 1080 pixels, allegedly" },
  {
    label: "Distinguishing marks",
    value: "None. That's sort of the whole problem.",
  },
  {
    label: "Suspects",
    value: "You (typed it weird) · Me (never wrote it) · The URL bar (enabler)",
  },
];
</script>

<template>
  <BookSpread
    eyebrow="A page torn from the codex"
    title="This route doesn't exist"
    folio="Folio — Missing"
    full
  >
    <div class="mx-auto flex w-full max-w-2xl flex-col items-start py-6">
      <button
        type="button"
        class="mb-5 cursor-pointer font-mono text-[11px] uppercase tracking-widest text-faint transition-colors hover:text-ink"
        :aria-label="`404. Pressed ${pokes} times.`"
        @click="pokes++"
      >
        404
      </button>

      <p class="mb-8 text-base leading-relaxed text-muted">
        Either you typed it wrong or I haven't written it yet. Both are fixable,
        only one of them is your problem.
      </p>

      <!-- A missing-page notice, the sort pinned to a board in a tavern. -->
      <div class="mb-8 w-full border-2 border-line bg-surface">
        <div class="flex items-center gap-3 border-b-2 border-line px-4 py-3 sm:px-5">
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-line text-track"
            aria-hidden="true"
          >
            <ArcaneSigil name="void" :size="15" />
          </span>
          <h2
            class="text-[15px] uppercase tracking-[0.22em] text-ink"
            style="font-family: 'Cinzel', Georgia, serif"
          >
            Missing
          </h2>
          <span class="ml-auto font-mono text-[10px] uppercase tracking-widest text-faint">
            One (1) page
          </span>
        </div>

        <dl class="px-4 py-3 sm:px-5">
          <div v-for="row in notice" :key="row.label" class="ledger-row last:border-b-0">
            <dt class="ledger-label w-36 sm:w-44">{{ row.label }}</dt>
            <dd class="min-w-0 flex-1 text-[13.5px] leading-relaxed text-muted">
              {{ row.value }}
            </dd>
          </div>
        </dl>

        <p
          class="border-t border-dotted border-line/50 px-4 py-3 text-[12.5px] italic leading-relaxed text-faint sm:px-5"
        >
          If found, do not approach it. It has been unmaintained for some time.
        </p>
      </div>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-1 opacity-0"
      >
        <p
          v-if="nudge"
          class="mb-8 -mt-4 font-mono text-[11px] lowercase tracking-wide text-faint"
        >
          {{ nudge }}
        </p>
      </Transition>

      <Transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="translate-y-2 opacity-0"
      >
        <div
          v-if="revealed"
          class="mb-8 -mt-4 border-l-2 pl-4"
          style="border-color: rgb(var(--track) / 0.5)"
        >
          <p class="label-mono mb-2">Fine. The truth</p>
          <p class="text-[15px] leading-relaxed text-ink/90">
            Kidhar phuss gaya yr 💀 — go back and click something that exists.
          </p>
        </div>
      </Transition>

      <div class="flex flex-wrap gap-3">
        <RouterLink to="/" class="btn btn-primary">
          <AppIcon name="arrow-left" :size="12" /> Back home
        </RouterLink>
        <RouterLink to="/roadmaps" class="btn">Go to the roadmaps</RouterLink>
      </div>
    </div>
  </BookSpread>
</template>
