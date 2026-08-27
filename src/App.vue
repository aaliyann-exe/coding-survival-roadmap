<script setup lang="ts">
import AppNav from "@/components/layout/AppNav.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import CommandPalette from "@/components/search/CommandPalette.vue";
import AchievementToast from "@/components/achievements/AchievementToast.vue";
import { useTheme } from "@/composables/useTheme";
import { useAchievements } from "@/composables/useAchievements";

useTheme();
// Mounting this here means achievements are watched everywhere, not just on
// the progress page.
useAchievements();
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2 focus:font-mono focus:text-xs"
    >
      Skip to content
    </a>

    <AppNav />

    <main id="main" class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          leave-active-class="transition duration-100 ease-in"
          leave-to-class="opacity-0"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
    <CommandPalette />
    <AchievementToast />
  </div>
</template>
