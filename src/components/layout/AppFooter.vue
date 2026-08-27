<script setup lang="ts">
import { totalTopics } from "@/data/roadmaps";
import projects from "@/data/projects";
import { allResources } from "@/data/resources";
</script>

<template>
  <footer class="mt-auto border-t border-line bg-canvas/60">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div
        class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"
      >
        <div>
          <span class="font-mono text-[15px] text-faint">Some useful links 🤓👉</span>
          <p class="mt-2 font-mono text-[10px] uppercase tracking-widest text-faint">
            {{ totalTopics }} topics · {{ projects.length }} projects ·
            {{ allResources.length }} resources
          </p>
        </div>

        <div class="flex flex-wrap gap-8 font-mono text-[15px] sm:gap-12">
          <RouterLink
            to="/resources"
            class="text-faint transition-colors duration-200 hover:text-ink"
            >RESOURCES</RouterLink
          >
          <RouterLink
            to="/progress"
            class="text-faint transition-colors duration-200 hover:text-ink"
            >PROGRESS</RouterLink
          >
          <a
            href="https://youtu.be/QDia3e12czc"
            target="_blank"
            rel="noopener noreferrer"
            class="text-faint transition-colors duration-200 hover:text-ink"
            >TOP SECRET</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>
