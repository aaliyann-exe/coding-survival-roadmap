<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import type { SearchHit } from "@/data/types";
import { useCommandPalette } from "@/composables/useSearch";
import { useScrollLock } from "@/composables/useScrollLock";
import AppIcon from "@/components/ui/AppIcon.vue";

const router = useRouter();
const { isOpen, query, results, close, toggle } = useCommandPalette();
const { lock, unlock } = useScrollLock();

const input = ref<HTMLInputElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const listbox = ref<HTMLElement | null>(null);
const highlighted = ref(0);
let lastFocused: HTMLElement | null = null;

const kindIcon: Record<SearchHit["kind"], string> = {
  topic: "route",
  project: "box",
  resource: "book",
  page: "compass",
};

const kindLabel: Record<SearchHit["kind"], string> = {
  topic: "Topics",
  project: "Projects",
  resource: "Resources",
  page: "Pages",
};

const suggestions = ["goroutine", "closures", "flexbox", "pandas", "auth", "deploy"];

/**
 * Results grouped under a heading per kind, with the keyboard index assigned
 * in the order the rows are actually painted. Grouping after indexing would
 * make Arrow Down jump around the list, which is worse than no grouping.
 * Sections appear in the order their best-scoring hit did, so the strongest
 * match is still the first row and the default selection.
 */
const sections = computed(() => {
  const out: { kind: SearchHit["kind"]; rows: { hit: SearchHit; index: number }[] }[] = [];
  const byKind = new Map<SearchHit["kind"], (typeof out)[number]>();

  for (const hit of results.value) {
    let section = byKind.get(hit.kind);
    if (!section) {
      section = { kind: hit.kind, rows: [] };
      byKind.set(hit.kind, section);
      out.push(section);
    }
    section.rows.push({ hit, index: 0 });
  }

  let index = 0;
  for (const section of out) {
    for (const row of section.rows) row.index = index++;
  }
  return out;
});

/** The rows in painted order — what the arrow keys walk. */
const rows = computed(() => sections.value.flatMap((s) => s.rows.map((r) => r.hit)));

/**
 * Splits a title around the search terms so the matched run can be inked in.
 * Terms are escaped before they reach the regex: people type "c++" and "()"
 * into search boxes, and an unescaped term throws before it ever matches.
 */
function segments(text: string) {
  const terms = query.value.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [{ text, match: false }];
  const pattern = terms
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  return text
    .split(new RegExp(`(${pattern})`, "ig"))
    .filter(Boolean)
    .map((part) => ({
      text: part,
      match: terms.some((t) => t.toLowerCase() === part.toLowerCase()),
    }));
}

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

/**
 * Bound at the window while the palette is up, not on the input. Escape used
 * to be handled by the input's own keydown, so tabbing to a result — or
 * clicking one and shift-tabbing back — left Escape doing nothing at all.
 */
function onDialogKey(event: KeyboardEvent) {
  if (!isOpen.value) return;

  if (event.key === "Escape") {
    event.stopPropagation();
    close();
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    move(1);
    return;
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    move(-1);
    return;
  }
  if (event.key === "Enter" && document.activeElement === input.value) {
    event.preventDefault();
    go(highlighted.value);
    return;
  }

  // Tab stays inside the sheet. Once a query is typed the only focusable
  // thing in here is the field itself — results are driven by the arrow keys
  // and `aria-activedescendant`, the pattern a combobox is expected to use —
  // so this cycles to itself and Tab is effectively inert. On the empty
  // state the suggestion chips join the cycle, which is the only way to
  // reach them without a mouse.
  if (event.key !== "Tab" || !panel.value) return;
  const items = [
    ...panel.value.querySelectorAll<HTMLElement>("input, button:not([disabled])"),
  ].filter((el) => el.offsetParent !== null);
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

onMounted(() => window.addEventListener("keydown", onGlobalKey));

function move(delta: number) {
  if (rows.value.length === 0) return;
  const next = highlighted.value + delta;
  highlighted.value = Math.min(Math.max(next, 0), rows.value.length - 1);
  nextTick(() => {
    listbox.value
      ?.querySelector<HTMLElement>(`[data-index="${highlighted.value}"]`)
      ?.scrollIntoView({ block: "nearest" });
  });
}

function applySuggestion(term: string) {
  query.value = term;
  input.value?.focus();
}

function go(index: number) {
  const hit = rows.value[index];
  if (!hit) return;
  if (hit.kind === "resource" && hit.url) {
    window.open(hit.url, "_blank", "noopener,noreferrer");
  } else {
    router.push(hit.to);
  }
  close();
}

watch(isOpen, async (open) => {
  if (open) {
    lastFocused = document.activeElement as HTMLElement | null;
    highlighted.value = 0;
    lock();
    window.addEventListener("keydown", onDialogKey, true);
    await nextTick();
    input.value?.focus();
  } else {
    unlock();
    window.removeEventListener("keydown", onDialogKey, true);
    // Back to whatever opened it — the toolbar button, or wherever the
    // reader was when they hit Ctrl+K.
    lastFocused?.focus?.();
    lastFocused = null;
  }
});

watch(results, () => {
  highlighted.value = 0;
});

onUnmounted(() => {
  window.removeEventListener("keydown", onGlobalKey);
  window.removeEventListener("keydown", onDialogKey, true);
  if (isOpen.value) unlock();
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
        class="fixed inset-0 z-[110] bg-board/75 dark:bg-black/80"
        @click="close()"
      />
    </Transition>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <!-- `dvh`, not `vh`: on a phone the address bar and the software
           keyboard both eat viewport height, and a `vh`-sized sheet ends up
           taller than what you can actually see. -->
      <div
        v-if="isOpen"
        ref="panel"
        class="inset-rule corner-frame fixed left-1/2 top-[5vh] z-[120] flex max-h-[86dvh] w-[min(640px,calc(100vw-1.5rem))] -translate-x-1/2 flex-col border-2 border-line bg-surface shadow-lift sm:top-[8vh]"
        role="dialog"
        aria-modal="true"
        aria-label="Search topics, projects and resources"
      >
        <div class="flex shrink-0 items-center gap-3 border-b border-line px-4">
          <AppIcon name="search" :size="16" class="text-faint" />
          <input
            ref="input"
            v-model="query"
            type="text"
            class="w-full bg-transparent py-3.5 text-[15px] text-ink outline-none placeholder:text-faint"
            placeholder="Search topics, projects, resources…"
            role="combobox"
            :aria-expanded="rows.length > 0"
            aria-controls="palette-results"
            :aria-activedescendant="
              rows.length ? `palette-option-${highlighted}` : undefined
            "
            autocomplete="off"
            spellcheck="false"
          />
          <kbd
            class="hidden shrink-0 border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block"
            >ESC</kbd
          >
        </div>

        <!-- Nothing typed yet: say what this searches and offer a way in,
             rather than showing an empty box. -->
        <div v-if="!query" class="px-4 py-5">
          <p class="label-mono mb-3">Try one of these</p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="s in suggestions"
              :key="s"
              type="button"
              class="chip min-h-[1.75rem] transition-colors hover:border-line-strong hover:text-ink"
              @click="applySuggestion(s)"
            >
              {{ s }}
            </button>
          </div>
          <p class="mt-5 font-mono text-[10px] leading-relaxed text-faint">
            ↑ ↓ to move · ENTER to open · ESC to close
          </p>
        </div>

        <div v-else-if="rows.length === 0" class="px-5 py-10 text-center">
          <p class="text-sm text-muted">
            No match for “{{ query }}”.
          </p>
          <p class="mt-2 text-[13px] text-faint">
            Try a shorter word — this searches topic names, project briefs and
            resource titles.
          </p>
        </div>

        <div
          v-else
          id="palette-results"
          ref="listbox"
          role="listbox"
          aria-label="Search results"
          class="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain py-1"
        >
          <div
            v-for="section in sections"
            :key="section.kind"
            role="group"
            :aria-label="kindLabel[section.kind]"
          >
            <p
              class="label-mono sticky top-0 z-10 border-b border-line/40 bg-surface px-4 py-1.5"
            >
              {{ kindLabel[section.kind] }}
            </p>
            <div
              v-for="row in section.rows"
              :id="`palette-option-${row.index}`"
              :key="row.hit.id"
              :data-index="row.index"
              role="option"
              :aria-selected="row.index === highlighted"
              class="flex cursor-pointer items-start gap-3 px-4 py-2.5 transition-colors"
              :class="row.index === highlighted ? 'bg-sunken' : 'hover:bg-sunken/60'"
              @click="go(row.index)"
              @mousemove="highlighted = row.index"
            >
              <AppIcon :name="kindIcon[row.hit.kind]" :size="14" class="mt-1 text-faint" />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-[14px] text-ink">
                  <template v-for="(part, i) in segments(row.hit.title)" :key="i">
                    <mark
                      v-if="part.match"
                      class="bg-transparent font-semibold text-track"
                      >{{ part.text }}</mark
                    ><template v-else>{{ part.text }}</template>
                  </template>
                </span>
                <span class="mt-0.5 block truncate text-[12px] font-light text-muted">{{
                  row.hit.subtitle
                }}</span>
                <span class="mt-0.5 block truncate font-mono text-[10px] text-faint">{{
                  row.hit.breadcrumb
                }}</span>
              </span>
              <AppIcon
                v-if="row.hit.kind === 'resource'"
                name="external"
                :size="12"
                class="mt-1 text-faint"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
