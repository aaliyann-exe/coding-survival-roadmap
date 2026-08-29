<script setup lang="ts">
import TomeShell from "@/components/book/TomeShell.vue";
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
  <TomeShell>
    <!-- Content swaps behind the turning leaf. The crossfade is short and
         opacity-only: the leaf is doing the visible work, so anything longer
         here just makes navigation feel sluggish. -->
    <RouterView v-slot="{ Component }">
      <Transition
        mode="out-in"
        enter-active-class="transition-opacity duration-150 ease-out"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>

    <template #after>
      <AppFooter />
      <CommandPalette />
      <AchievementToast />
      <LoginModal />
    </template>
  </TomeShell>
</template>
