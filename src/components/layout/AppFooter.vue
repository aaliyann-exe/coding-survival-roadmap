<script setup lang="ts">
import { roadmaps, totalTopics } from "@/data/roadmaps";
import projects from "@/data/projects";
import { allResources } from "@/data/resources";

const siteLinks = [
  { to: "/roadmaps", label: "Roadmaps" },
  { to: "/projects", label: "Projects" },
  { to: "/resources", label: "Resources" },
  { to: "/progress", label: "Progress" },
];
</script>

<template>
  <footer class="mt-auto on-board">
    <div class="mx-auto max-w-[1560px] px-5 pb-10 pt-2 sm:px-10">
      <div
        class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_auto]"
      >
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
          <p
            class="mt-4 font-mono text-[10px] uppercase tracking-widest opacity-55"
          >
            {{ totalTopics }} topics · {{ projects.length }} projects ·
            {{ allResources.length }} resources
          </p>
        </div>

        <!-- site -->
        <nav aria-label="Footer">
          <p
            class="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] opacity-55"
          >
            The site
          </p>
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
          <p
            class="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] opacity-55"
          >
            The paths
          </p>
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
        class="flex flex-wrap items-center pt-5 mt-8 border-t gap-x-6 gap-y-3 border-line-strong/25"
      >
        <p class="font-mono text-[10px] uppercase tracking-widest opacity-55">
          Progress is stored on this device first · Press
          <kbd class="px-1 py-px bg-transparent border border-line-strong/40"
            >Ctrl / ⌘ + K</kbd
          >
          to search
        </p>

        <div
          class="flex items-center justify-center ml-auto min-h-[40px] gap-1.5 font-mono uppercase tracking-widest text-[10px] transition-opacity"
        >
          <span>🤓👉</span>

          <a
            href="https://youtu.be/QDia3e12czc"
            target="_blank"
            rel="noopener noreferrer"
            class="ml-auto flex min-h-[40px] items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest opacity-55 transition-opacity hover:opacity-100"
            >Top secret</a
          >
          <span>👈🤓</span>
        </div>
      </div>
    </div>
  </footer>
</template>
