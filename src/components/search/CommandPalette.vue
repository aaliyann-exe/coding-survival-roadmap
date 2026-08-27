<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useCommandPalette } from "@/composables/useSearch";
import AppIcon from "@/components/ui/AppIcon.vue";

const router = useRouter();
const { isOpen, query, results, close, toggle } = useCommandPalette();

const input = ref<HTMLInputElement | null>(null);
const highlighted = ref(0);
const listbox = ref<HTMLElement | null>(null);

const kindIcon: Record<string, string> = {
  topic: "route",
  project: "box",
  resource: "book",
  page: "compass",
};

const suggestions = [
  "goroutine",
  "closures",
  "flexbox",
  "pandas",
  "auth",
  "deploy",
];

function onGlobalKey(event: KeyboardEvent) {
  const cmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
  if (cmdK) {
    event.preventDefault();
    toggle();
    return;
  }
  if (
    event.key === "/" &&
    !isOpen.value &&
    !(event.target instanceof HTMLInputElement) &&
    !(event.target instanceof HTMLTextAreaElement)
  ) {
    event.preventDefault();
    toggle();
  }
}

onMounted(() => window.addEventListener("keydown", onGlobalKey));
onUnmounted(() => window.removeEventListener("keydown", onGlobalKey));

watch(isOpen, async (open) => {
  document.body.style.overflow = open ? "hidden" : "";
  if (open) {
    highlighted.value = 0;
    await nextTick();
    input.value?.focus();
  }
});

watch(results, () => {
  highlighted.value = 0;
});

const grouped = computed(() => results.value);

function go(index: number) {
  const hit = grouped.value[index];
  if (!hit) return;
  if (hit.kind === "resource" && hit.url) {
    window.open(hit.url, "_blank", "noopener,noreferrer");
  } else {
    router.push(hit.to);
  }
  close();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    close();
    return;
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    highlighted.value = Math.min(highlighted.value + 1, grouped.value.length - 1);
    scrollIntoView();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    highlighted.value = Math.max(highlighted.value - 1, 0);
    scrollIntoView();
  } else if (event.key === "Enter") {
    event.preventDefault();
    go(highlighted.value);
  }
}

function scrollIntoView() {
  nextTick(() => {
    const el = listbox.value?.querySelector<HTMLElement>(
      `[data-index="${highlighted.value}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  });
}

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[110] bg-black/40 backdrop-blur-[2px] dark:bg-black/70"
        @click="close()"
      />
    </Transition>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2 scale-[0.99]"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2 scale-[0.99]"
    >
      <div
        v-if="isOpen"
        class="fixed left-1/2 top-[8vh] z-[120] w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 border border-line bg-surface shadow-lift"
        role="dialog"
        aria-modal="true"
        aria-label="Search topics, projects and resources"
      >
        <div class="flex items-center gap-3 border-b border-line px-4">
          <AppIcon name="search" :size="16" class="text-faint" />
          <input
            ref="input"
            v-model="query"
            type="text"
            class="w-full bg-transparent py-3.5 text-[15px] text-ink outline-none placeholder:text-faint"
            placeholder="Search topics, projects, resources…"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            :aria-activedescendant="`palette-option-${highlighted}`"
            autocomplete="off"
            spellcheck="false"
            @keydown="onKeydown"
          />
          <kbd
            class="hidden shrink-0 border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block"
            >ESC</kbd
          >
        </div>

        <div
          v-if="query && grouped.length === 0"
          class="px-5 py-10 text-center"
        >
          <p class="text-sm text-muted">
            Nothing found. Either you discovered a new technology or you typed it wrong.
          </p>
        </div>

        <div v-else-if="!query" class="px-4 py-5">
          <p class="label-mono mb-3">Try one of these</p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="s in suggestions"
              :key="s"
              type="button"
              class="chip transition-colors hover:border-line-strong hover:text-ink"
              @click="query = s"
            >
              {{ s }}
            </button>
          </div>
          <p class="mt-5 font-mono text-[10px] text-faint">
            ↑ ↓ to move · ENTER to open · CTRL/⌘ + K to toggle
          </p>
        </div>

        <ul
          v-else
          id="palette-results"
          ref="listbox"
          class="custom-scrollbar max-h-[52vh] overflow-y-auto py-1"
          role="listbox"
        >
          <li
            v-for="(hit, index) in grouped"
            :id="`palette-option-${index}`"
            :key="hit.id"
            :data-index="index"
            role="option"
            :aria-selected="index === highlighted"
          >
            <button
              type="button"
              class="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors"
              :class="index === highlighted ? 'bg-sunken' : 'hover:bg-sunken/60'"
              @click="go(index)"
              @mouseenter="highlighted = index"
            >
              <AppIcon
                :name="kindIcon[hit.kind] ?? 'dot'"
                :size="14"
                class="mt-1 text-faint"
              />
              <span class="min-w-0 flex-1">
                <span class="flex items-baseline gap-2">
                  <span class="truncate text-[14px] text-ink">{{ hit.title }}</span>
                  <span
                    class="shrink-0 font-mono text-[9px] uppercase tracking-wider text-faint"
                    >{{ hit.kind }}</span
                  >
                </span>
                <span class="mt-0.5 block truncate text-[12px] font-light text-muted">{{
                  hit.subtitle
                }}</span>
                <span class="mt-0.5 block truncate font-mono text-[10px] text-faint">{{
                  hit.breadcrumb
                }}</span>
              </span>
              <AppIcon
                v-if="hit.kind === 'resource'"
                name="external"
                :size="12"
                class="mt-1 text-faint"
              />
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </Teleport>
</template>
