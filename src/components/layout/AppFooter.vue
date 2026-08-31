<script setup lang="ts">
import { roadmaps, totalTopics } from "@/data/roadmaps";
import projects from "@/data/projects";
import { allResources } from "@/data/resources";
import { useReducedMotion } from "@/composables/useMotion";
import AppIcon from "@/components/ui/AppIcon.vue";

const { prefersReducedMotion } = useReducedMotion();

const siteLinks = [
  { to: "/roadmaps", label: "Roadmaps" },
  { to: "/projects", label: "Projects" },
  { to: "/resources", label: "Resources" },
  { to: "/progress", label: "Progress" },
];

function toTop() {
  // An explicit `behavior` here overrides the `scroll-behavior: auto` that
  // style.css sets under prefers-reduced-motion, so this has to ask as well —
  // it was the one animation in the app that ignored the setting.
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion.value ? "auto" : "smooth",
  });
}
</script>

<template>
  <footer class="on-board mt-auto">
    <div class="mx-auto max-w-[1560px] px-5 pb-10 pt-2 sm:px-10">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
        <!-- what this is -->
        <div class="max-w-sm">
          <p
            class="flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-widest"
          >
            <span
              class="flex h-6 w-6 items-center justify-center border border-line-strong text-[10px]"
              aria-hidden="true"
              >/&gt;</span
            >
            Survival Roadmap
          </p>
          <p class="mt-3 text-[13px] font-light leading-relaxed opacity-70">
            Six-ish months of learning, written down while it was still fresh.
            Read the docs, build the projects, don't let AI do it for you.
          </p>
          <p class="mt-4 font-mono text-[10px] uppercase tracking-widest opacity-55">
            {{ totalTopics }} topics · {{ projects.length }} projects ·
            {{ allResources.length }} resources
          </p>
        </div>

        <!-- site -->
        <nav aria-label="Footer">
          <p class="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] opacity-55">The site</p>
          <ul>
            <li v-for="link in siteLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                class="inline-flex min-h-[40px] items-center text-[13px] font-light opacity-70 transition-opacity hover:opacity-100"
                >{{ link.label }}</RouterLink
              >
            </li>
          </ul>
        </nav>

        <!-- paths -->
        <nav aria-label="Roadmaps">
          <p class="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] opacity-55">The paths</p>
          <ul>
            <li v-for="r in roadmaps" :key="r.id" :class="r.trackClass">
              <RouterLink
                :to="`/roadmaps/${r.id}`"
                class="group inline-flex min-h-[40px] items-center gap-2 text-[13px] font-light opacity-70 transition-opacity hover:opacity-100"
              >
                <span
                  class="h-1.5 w-1.5 shrink-0"
                  style="background-color: rgb(var(--track))"
                />
                {{ r.short }}
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>

      <div
        class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line-strong/25 pt-5"
      >
        <p class="font-mono text-[10px] uppercase tracking-widest opacity-55">
          Progress is stored on this device first · Press
          <kbd class="border border-line-strong/40 bg-transparent px-1 py-px">Ctrl / ⌘ + K</kbd> to search
        </p>

        <a
          href="https://youtu.be/QDia3e12czc"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-[40px] items-center font-mono text-[10px] uppercase tracking-widest opacity-55 transition-opacity hover:opacity-100"
          >Top secret 🤓👉</a
        >

        <button
          type="button"
          class="ml-auto flex min-h-[40px] items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest opacity-55 transition-opacity hover:opacity-100"
          @click="toTop"
        >
          Back to top <AppIcon name="arrow-right" :size="11" class="-rotate-90" />
        </button>
      </div>
    </div>
  </footer>
</template>
