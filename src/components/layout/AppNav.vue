<script setup lang="ts">
/**
 * Navigation as index tabs cut into the edge of the codex.
 *
 * Replaces the previous logo-left / links-centre / icons-right sticky header,
 * which was the single most recognisable "generic web app" signature on the
 * page. The active tab drops its bottom border so it reads as physically
 * continuous with the page beneath it.
 *
 * On narrow screens the tabs become a horizontally scrollable strip of the
 * same plates — the same object, smaller — rather than collapsing into a
 * hamburger drawer, so the metaphor survives the breakpoint.
 */
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

const links = [
  { to: "/roadmaps", label: "Roadmaps" },
  { to: "/projects", label: "Projects" },
  { to: "/resources", label: "Resources" },
  { to: "/progress", label: "Progress" },
];
</script>

<template>
  <header class="sticky top-0 z-50">
    <!-- Colophon bar: the spine label stamped along the top of the book. -->
    <div class="on-board border-b border-line/40 bg-board">
      <div
        class="mx-auto flex h-9 max-w-[1400px] items-center gap-3 px-3 sm:px-6 lg:px-10"
      >
        <RouterLink
          to="/"
          class="flex shrink-0 items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em] opacity-90 transition-opacity hover:opacity-100"
        >
          <span
            class="flex h-5 w-5 items-center justify-center border border-line-strong/70 text-[9px] text-line-strong"
            aria-hidden="true"
            >/&gt;</span
          >
          <span class="hidden sm:inline">Survival Roadmap</span>
        </RouterLink>

        <span class="ml-auto flex items-center gap-1.5 sm:gap-2">
          <RouterLink
            to="/progress"
            class="hidden items-center gap-2 border border-line-strong/50 px-2 py-1 font-mono text-[10px] uppercase tracking-widest opacity-75 transition-all hover:border-line-strong hover:opacity-100 sm:flex"
          >
            <span class="h-1.5 w-1.5 bg-line-strong" aria-hidden="true" />
            {{ overallPercent }}% done
          </RouterLink>

          <button
            v-if="username"
            type="button"
            class="hidden items-center gap-1.5 border border-line-strong/50 px-2 py-1 font-mono text-[10px] uppercase tracking-widest opacity-75 transition-all hover:border-line-strong hover:opacity-100 sm:flex"
            :aria-label="`Signed in as ${username}. Click to switch users.`"
            @click="logout()"
          >
            <AppIcon name="user" :size="11" />
            {{ username }}
          </button>

          <button
            type="button"
            class="flex items-center gap-1.5 border border-line-strong/50 px-2 py-1 opacity-75 transition-all hover:border-line-strong hover:opacity-100"
            aria-label="Search (Ctrl + K)"
            @click="open()"
          >
            <AppIcon name="search" :size="13" />
            <kbd
              class="hidden bg-transparent font-mono text-[10px] opacity-75 lg:inline"
              >⌘K</kbd
            >
          </button>

          <button
            type="button"
            class="border border-line-strong/50 p-1 opacity-75 transition-all hover:border-line-strong hover:opacity-100"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleDarkMode()"
          >
            <AppIcon :name="isDark ? 'sun' : 'moon'" :size="14" />
          </button>
        </span>
      </div>
    </div>

    <!-- Index tabs. Scrollable on narrow screens; never a hamburger. -->
    <nav class="bg-board" aria-label="Main">
      <div class="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-10">
        <div class="no-scrollbar flex items-end gap-1 overflow-x-auto pt-1.5">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="index-tab"
            :data-active="route.path.startsWith(link.to) ? 'true' : 'false'"
            :aria-current="route.path.startsWith(link.to) ? 'page' : undefined"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </div>
    </nav>
  </header>
</template>
