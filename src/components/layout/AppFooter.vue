<script setup lang="ts">
import { roadmaps, totalTopics } from "@/data/roadmaps";
import projects from "@/data/projects";
import { allResources } from "@/data/resources";
import AppIcon from "@/components/ui/AppIcon.vue";

const siteLinks = [
  { to: "/roadmaps", label: "Roadmaps" },
  { to: "/projects", label: "Projects" },
  { to: "/resources", label: "Resources" },
  { to: "/progress", label: "Progress" },
];

function toTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <footer class="mt-auto border-t border-line bg-canvas/60">
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
        <!-- what this is -->
        <div class="max-w-sm">
          <p
            class="flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-widest text-ink"
          >
            <span
              class="flex h-6 w-6 items-center justify-center border border-line-strong text-[10px]"
              aria-hidden="true"
              >/&gt;</span
            >
            Survival Roadmap
          </p>
          <p class="mt-3 text-[13px] font-light leading-relaxed text-muted">
            Six-ish months of learning, written down while it was still fresh.
            Read the docs, build the projects, don't let AI do it for you.
          </p>
          <p class="mt-4 font-mono text-[10px] uppercase tracking-widest text-faint">
            {{ totalTopics }} topics · {{ projects.length }} projects ·
            {{ allResources.length }} resources
          </p>
        </div>

        <!-- site -->
        <nav aria-label="Footer">
          <p class="label-mono mb-3">The site</p>
          <ul class="space-y-2">
            <li v-for="link in siteLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                class="text-[13px] font-light text-muted transition-colors hover:text-ink"
                >{{ link.label }}</RouterLink
              >
            </li>
          </ul>
        </nav>

        <!-- paths -->
        <nav aria-label="Roadmaps">
          <p class="label-mono mb-3">The paths</p>
          <ul class="space-y-2">
            <li v-for="r in roadmaps" :key="r.id" :class="r.trackClass">
              <RouterLink
                :to="`/roadmaps/${r.id}`"
                class="group flex items-center gap-2 text-[13px] font-light text-muted transition-colors hover:text-ink"
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
        class="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6"
      >
        <p class="font-mono text-[10px] uppercase tracking-widest text-faint">
          Progress is stored on this device first · Press
          <kbd class="border border-line px-1 py-px">Ctrl / ⌘ + K</kbd> to search
        </p>

        <a
          href="https://youtu.be/QDia3e12czc"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-[10px] uppercase tracking-widest text-faint transition-colors hover:text-ink"
          >Top secret 🤓👉</a
        >

        <button
          type="button"
          class="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-faint transition-colors hover:text-ink"
          @click="toTop"
        >
          Back to top <AppIcon name="arrow-right" :size="11" class="-rotate-90" />
        </button>
      </div>
    </div>
  </footer>
</template>
