<script setup lang="ts">
import { ref } from "vue";
import { roadmaps, totalTopics } from "@/data/roadmaps";
import projects from "@/data/projects";
import { allResources } from "@/data/resources";

const siteLinks = [
  { to: "/roadmaps", label: "Roadmaps" },
  { to: "/projects", label: "Projects" },
  { to: "/resources", label: "Resources" },
  { to: "/progress", label: "Progress" },
];

/** The "top secret" link is a rickroll. Once it has been taken the label owns
 * up to it, and the pointing emoji go with it: they were there to bait the
 * click, and there is no second click to bait. Deliberately not persisted —
 * a reload sets the bait again for whoever opens the page next. */
const rickrolled = ref(false);
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
          Progress is stored on this device first
        </p>

        <a
          href="https://github.com/aaliyann-exe"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          class="flex min-h-[40px] items-center opacity-55 transition-opacity hover:opacity-100"
        >
          <svg viewBox="0 0 19 19" class="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844"
            />
          </svg>
        </a>

        <div
          class="flex items-center justify-center ml-auto min-h-[40px] gap-1.5 font-mono uppercase tracking-widest text-[10px] transition-opacity"
        >
          <span v-if="!rickrolled">🤓👉</span>

          <a
            href="https://youtu.be/QDia3e12czc"
            target="_blank"
            rel="noopener noreferrer"
            class="ml-auto flex min-h-[40px] items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest opacity-55 transition-opacity hover:opacity-100"
            @click="rickrolled = true"
            >{{
              rickrolled
                ? "Rickroll in big 26, did I just get negative aura..."
                : "Top secret"
            }}</a
          >
          <span v-if="!rickrolled">👈🤓</span>
        </div>
      </div>
    </div>
  </footer>
</template>
