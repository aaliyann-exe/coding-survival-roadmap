<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "@/composables/useTheme";
import { useProgress } from "@/composables/useProgress";
import { useCommandPalette } from "@/composables/useSearch";
import { useUser } from "@/composables/useUser";
import AppIcon from "@/components/ui/AppIcon.vue";

const route = useRoute();
const { isDark, toggleDarkMode } = useTheme();
const { overallPercent } = useProgress();
const { open } = useCommandPalette();
const { username, logout } = useUser();

const mobileOpen = ref(false);
watch(() => route.fullPath, () => (mobileOpen.value = false));

const links = [
  { to: "/roadmaps", label: "Roadmaps" },
  { to: "/projects", label: "Projects" },
  { to: "/resources", label: "Resources" },
  { to: "/progress", label: "Progress" },
];
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md"
  >
    <div
      class="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:h-16 sm:px-6"
    >
      <RouterLink
        to="/"
        class="flex shrink-0 items-center gap-2.5 font-mono text-[13px] uppercase tracking-widest text-ink"
      >
        <span
          class="flex h-6 w-6 items-center justify-center border border-line-strong text-[10px]"
          aria-hidden="true"
          >/&gt;</span
        >
        <span class="hidden sm:inline">Survival Roadmap</span>
      </RouterLink>

      <nav class="ml-2 hidden items-center gap-1 md:flex" aria-label="Main">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="border-b-2 border-transparent px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors"
          :class="
            route.path.startsWith(link.to)
              ? 'border-[rgb(var(--track))] text-ink'
              : 'text-faint hover:text-ink'
          "
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="ml-auto flex items-center gap-1.5 sm:gap-2">
        <RouterLink
          to="/progress"
          class="hidden items-center gap-2 border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-line-strong hover:text-ink sm:flex"
        >
          <span class="h-1.5 w-1.5" style="background-color: rgb(var(--track))" />
          {{ overallPercent }}% done
        </RouterLink>

        <button
          v-if="username"
          type="button"
          class="hidden items-center gap-1.5 border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-line-strong hover:text-ink sm:flex"
          :aria-label="`Signed in as ${username}. Click to switch users.`"
          @click="logout()"
        >
          <AppIcon name="user" :size="12" />
          {{ username }}
        </button>

        <button
          type="button"
          class="flex items-center gap-2 border border-line px-2.5 py-1.5 text-faint transition-colors hover:border-line-strong hover:text-ink"
          aria-label="Search (Ctrl + K)"
          @click="open()"
        >
          <AppIcon name="search" :size="14" />
          <kbd class="hidden font-mono text-[10px] lg:inline">⌘K</kbd>
        </button>

        <button
          type="button"
          class="border border-line p-1.5 text-faint transition-colors hover:border-line-strong hover:text-ink"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleDarkMode()"
        >
          <AppIcon :name="isDark ? 'sun' : 'moon'" :size="15" />
        </button>

        <button
          type="button"
          class="border border-line p-1.5 text-faint transition-colors hover:text-ink md:hidden"
          :aria-expanded="mobileOpen"
          aria-label="Toggle navigation"
          @click="mobileOpen = !mobileOpen"
        >
          <AppIcon :name="mobileOpen ? 'close' : 'menu'" :size="15" />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <nav
        v-if="mobileOpen"
        class="border-t border-line bg-surface md:hidden"
        aria-label="Mobile"
      >
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="block border-b border-line px-5 py-3.5 font-mono text-[12px] uppercase tracking-widest"
          :class="route.path.startsWith(link.to) ? 'text-ink' : 'text-muted'"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </Transition>
  </header>
</template>
