<script setup lang="ts">
/**
 * The tome — the application's spatial container.
 *
 * The viewport holds a *book on a desk*. It does not hold a page. This is the
 * distinction the previous pass missed: a max-width column with a border is
 * still a web page no matter what colour it is painted. Here the desk is
 * visible on all four sides, the covers show as a leather margin, the page
 * edges show paper thickness, and the block is split by a real gutter.
 *
 * Layer order (outermost first):
 *   desk → cover boards → page edges → page block → facing pages → turn layer
 */
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useBookTurn, chapterOf } from "@/composables/useBookTurn";
import { useTheme } from "@/composables/useTheme";
import { useProgress } from "@/composables/useProgress";
import { useCommandPalette } from "@/composables/useSearch";
import { useUser } from "@/composables/useUser";
import BookmarkRail from "./BookmarkRail.vue";
import ArcaneSeal from "@/components/arcane/ArcaneSeal.vue";
import AppIcon from "@/components/ui/AppIcon.vue";

const route = useRoute();
const { phase, casting, start } = useBookTurn();
const { isDark, toggleDarkMode } = useTheme();
const { overallPercent } = useProgress();
const { open } = useCommandPalette();
const { username, logout } = useUser();

const links = [
  { to: "/", label: "Frontispiece" },
  { to: "/roadmaps", label: "Roadmaps" },
  { to: "/projects", label: "Projects" },
  { to: "/resources", label: "Resources" },
  { to: "/progress", label: "Progress" },
];

// Turn a page only when the chapter changes. Opening a node brief writes
// `?node=` onto the same route, and flipping the whole book for a drawer
// would be nonsense. Watching the resolved chapter also means browser
// back/forward triggers the turn exactly like a bookmark click does.
watch(
  () => chapterOf(route),
  (next, previous) => {
    if (previous !== undefined && next !== previous) start();
  },
);
</script>

<template>
  <div class="desk min-h-screen">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:border-2 focus:border-line focus:bg-canvas focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-ink"
    >
      Skip to content
    </a>

    <!-- colophon stamped on the desk above the book -->
    <div
      class="on-board mx-auto flex max-w-[1560px] items-center gap-3 px-4 py-3 sm:px-8"
    >
      <RouterLink
        to="/"
        class="flex min-h-[40px] shrink-0 items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] opacity-90 transition-opacity hover:opacity-100"
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
          class="flex min-h-[36px] items-center gap-1.5 border border-line-strong/50 px-2.5 opacity-75 transition-all hover:border-line-strong hover:opacity-100"
          aria-label="Search (Ctrl + K)"
          @click="open()"
        >
          <AppIcon name="search" :size="13" />
          <kbd class="hidden bg-transparent font-mono text-[10px] opacity-75 lg:inline"
            >⌘K</kbd
          >
        </button>

        <button
          type="button"
          class="flex min-h-[36px] min-w-[36px] items-center justify-center border border-line-strong/50 opacity-75 transition-all hover:border-line-strong hover:opacity-100"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleDarkMode()"
        >
          <AppIcon :name="isDark ? 'sun' : 'moon'" :size="14" />
        </button>
      </span>
    </div>

    <!-- ribbons, inserted into the top of the block below -->
    <div class="mx-auto max-w-[1560px] px-1 sm:px-6">
      <BookmarkRail :links="links" />
    </div>

    <!-- ===================== THE BOOK ===================== -->
    <div class="mx-auto max-w-[1560px] px-2 pb-10 sm:px-8 sm:pb-16">
      <!-- cover boards: leather visible as a margin round the whole block -->
      <div class="tome-cover p-[7px] sm:p-3.5">
        <!-- page block. `perspective` here is what lets the leaf hinge in 3D -->
        <!-- min-height is load-bearing: the router transition unmounts the
             outgoing view before the incoming one mounts, and without a floor
             the book collapses to a strip mid-turn (taking the turn layer's
             height with it, so the seal had nothing to render into). -->
        <div
          class="page-edges relative min-h-[68vh] bg-canvas"
          style="perspective: 2600px; perspective-origin: 50% 40%"
        >
          <!-- The binding, on phones only: the book is held open to a single
               page there, so the inner edge needs to read as a bound edge
               rather than as the side of a scrolling column. -->
          <span class="phone-binding" aria-hidden="true" />

          <main id="main" class="grain relative block min-h-[68vh]">
            <slot />
          </main>

          <!-- ---------------- turn layer ---------------- -->
          <!-- Sits above the block during a chapter change. aria-hidden and
               pointer-events-none: it is scenery, never content. -->
          <div
            v-if="phase === 'turning'"
            class="pointer-events-none absolute inset-0 z-40 overflow-hidden"
            aria-hidden="true"
          >
            <!-- the parchment the spell burns away, under the leaf -->
            <div
              class="grain absolute inset-0 bg-canvas motion-safe:animate-veil-lift motion-reduce:hidden"
            />
            <!-- the leaf swinging about the gutter -->
            <div
              class="turn-leaf motion-safe:animate-leaf-turn motion-reduce:hidden"
              style="transform-style: preserve-3d"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- The casting seal, pinned to the viewport.
         It cannot live inside the page block: that element sets `perspective`
         (so the leaf can hinge in 3D), and a `perspective` ancestor becomes
         the containing block for `position: fixed` descendants. Inside it the
         seal resolved against a ~4500px-tall block, so it sat far down the
         page and scrolled away with the content. Out here it is genuinely
         fixed and stays dead centre of the screen for the whole cast. -->
    <div
      v-if="phase === 'turning' && casting"
      class="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center animate-seal-cast"
      aria-hidden="true"
    >
      <ArcaneSeal :size="260" class="hidden sm:block" />
      <ArcaneSeal :size="180" class="sm:hidden" />
    </div>

    <slot name="after" />
  </div>
</template>
