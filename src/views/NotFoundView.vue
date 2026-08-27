<script setup lang="ts">
import AppIcon from "@/components/ui/AppIcon.vue";
</script>

<template>
  <div class="mx-auto flex max-w-2xl flex-col items-start px-4 py-24 sm:px-6 sm:py-32">
    <p class="label-mono mb-4">404</p>
    <h1 class="mb-4 text-3xl font-light leading-tight tracking-tight text-ink md:text-4xl">
      This route doesn't exist
    </h1>
    <p class="mb-8 text-base font-light leading-relaxed text-muted">
      Either you typed it wrong or I haven't written it yet. Both are fixable, only one
      of them is your problem.
    </p>
    <div class="flex flex-wrap gap-3">
      <RouterLink to="/" class="btn btn-primary">
        <AppIcon name="arrow-left" :size="12" /> Back home
      </RouterLink>
      <RouterLink to="/roadmaps" class="btn">Go to the roadmaps</RouterLink>
    </div>
  </div>
</template>
