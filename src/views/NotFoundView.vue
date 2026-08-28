<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import AppIcon from "@/components/ui/AppIcon.vue";

const route = useRoute();

/** Poking the 404 enough times gets you the real error message. */
const pokes = ref(0);
const CONFESSION_AT = 5;

const revealed = computed(() => pokes.value >= CONFESSION_AT);

const nudge = computed(() => {
  if (revealed.value) return "";
  if (pokes.value === 0) return "";
  if (pokes.value < 3) return "that's not a button. keep going though";
  return "okay fine, one more";
});

const trace = computed(() => [
  `GET ${route.fullPath}`,
  "  at router.resolve (router/index.ts:41)",
  "  at you.typing (keyboard.ts:1)",
  "  at me.notWritingItYet (roadmap.ts:∞)",
]);
</script>

<template>
  <div
    class="mx-auto flex max-w-2xl flex-col items-start px-4 py-24 sm:px-6 sm:py-32"
  >
    <button
      type="button"
      class="label-mono mb-4 cursor-pointer transition-colors hover:text-ink"
      :aria-label="`404. Pressed ${pokes} times.`"
      @click="pokes++"
    >
      404
    </button>

    <h1
      class="mb-4 text-3xl font-light leading-tight tracking-tight text-ink md:text-4xl"
    >
      This route doesn't exist
    </h1>
    <p class="mb-8 text-base font-light leading-relaxed text-muted">
      Either you typed it wrong or I haven't written it yet. Both are fixable,
      only one of them is your problem.
    </p>

    <!-- The honest version of a 404: the thing you asked for, and where it
         gave up. Reads like a stack trace because that's the joke. -->
    <pre
      class="custom-scrollbar mb-8 w-full overflow-x-auto border border-line bg-sunken p-4 font-mono text-[12px] leading-relaxed text-faint"
    ><code>{{ trace.join("\n") }}</code></pre>

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
        <p class="label-mono mb-2">Uncaught (in promise)</p>
        <p class="text-[15px] font-light leading-relaxed text-ink/90">
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
</template>
