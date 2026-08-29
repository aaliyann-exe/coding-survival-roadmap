<script setup lang="ts">
import AppNav from "@/components/layout/AppNav.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import CommandPalette from "@/components/search/CommandPalette.vue";
import AchievementToast from "@/components/achievements/AchievementToast.vue";
import LoginModal from "@/components/auth/LoginModal.vue";
import { useTheme } from "@/composables/useTheme";
import { useAchievements } from "@/composables/useAchievements";

useTheme();
// Mounting this here means achievements are watched everywhere, not just on
// the progress page.
useAchievements();
</script>

<template>
  <!-- The codex sits on a cover board rather than filling the viewport, so
       the application reads as a physical artifact with edges instead of a
       page that happens to end where the window does. -->
  <div class="flex min-h-screen flex-col bg-board">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:border-2 focus:border-line focus:bg-canvas focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-ink"
    >
      Skip to content
    </a>

    <AppNav />

    <div class="mx-auto w-full max-w-[1400px] flex-1 px-0 sm:px-6 lg:px-10">
      <!-- leaf: the page surface. grain gives it paper tooth without an image. -->
      <div class="leaf leaf-stack grain relative flex min-h-full flex-col shadow-codex">
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
      </div>
    </div>

    <CommandPalette />
    <AchievementToast />
    <LoginModal />
  </div>
</template>
