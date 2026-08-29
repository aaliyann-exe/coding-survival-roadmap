<script setup lang="ts">
/**
 * A loose manuscript sheet placed on top of the open codex.
 *
 * Replaces the previous right-hand drawer. The behavioural contract is
 * deliberately identical — same props, same slots, same focus trap, same
 * escape/scroll-lock handling — because both call sites (node briefs and
 * project briefs) drive it from the URL query and must keep working
 * untouched. Only the presentation and the motion changed.
 */
import { nextTick, onUnmounted, ref, watch } from "vue";
import AppIcon from "./AppIcon.vue";

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    eyebrow?: string;
    labelledBy?: string;
  }>(),
  { eyebrow: "" },
);

const emit = defineEmits<{ close: [] }>();

const panel = ref<HTMLElement | null>(null);
let lastFocused: HTMLElement | null = null;
/** Guards the close-side effects. Several of these components are mounted at
 * once (the node sheet and the project sheet), so a closed one must not run
 * teardown on its first immediate tick and undo the open one's scroll lock. */
let hasOpened = false;

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function onKeydown(event: KeyboardEvent) {
  if (!props.open) return;

  if (event.key === "Escape") {
    event.stopPropagation();
    emit("close");
    return;
  }

  if (event.key !== "Tab" || !panel.value) return;

  const items = [...panel.value.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => el.offsetParent !== null,
  );
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (event.shiftKey && (active === first || active === panel.value)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

// `immediate` is required, not cosmetic: landing directly on `?node=<id>`
// (a deep link, a search result, a cross-roadmap prerequisite) mounts this
// component with `open` already true, so a lazy watcher never fires and the
// sheet opens with no focus, no scroll lock and no Escape handler.
watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      hasOpened = true;
      lastFocused = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeydown, true);
      await nextTick();
      panel.value?.focus();
    } else if (hasOpened) {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeydown, true);
      lastFocused?.focus?.();
      lastFocused = null;
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", onKeydown, true);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <!-- The desk the sheet is dropped onto. No blur: this is a shadow cast
           across the page, not frosted glass. -->
      <div
        v-if="open"
        class="fixed inset-0 z-[90] bg-board/75 dark:bg-black/80"
        @click="emit('close')"
      />
    </Transition>

    <Transition
      enter-active-class="motion-safe:animate-set-down"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="open"
        class="pointer-events-none fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto overscroll-contain p-3 sm:p-6 md:p-10"
      >
        <div
          ref="panel"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          class="manuscript pointer-events-auto my-auto flex w-full max-w-2xl flex-col outline-none"
        >
          <!-- Sheet header: registration marks, chapter mark, heavy ink rule -->
          <header class="relative shrink-0 px-5 pb-4 pt-6 sm:px-9 sm:pt-8">
            <span
              class="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l-2 border-t-2 border-line-strong sm:left-5 sm:top-5"
              aria-hidden="true"
            />
            <span
              class="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r-2 border-t-2 border-line-strong sm:right-5 sm:top-5"
              aria-hidden="true"
            />

            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p
                  v-if="eyebrow"
                  class="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-faint"
                >
                  <span aria-hidden="true">❖</span>
                  {{ eyebrow }}
                </p>
                <h2
                  class="text-xl leading-tight text-ink sm:text-2xl"
                  style="font-family: 'Cinzel', Georgia, serif"
                >
                  {{ title }}
                </h2>
              </div>
              <button
                type="button"
                class="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-line bg-raised text-muted transition-colors hover:bg-line hover:text-canvas"
                aria-label="Close"
                @click="emit('close')"
              >
                <AppIcon name="close" :size="16" />
              </button>
            </div>

            <div class="ink-rule mt-4" aria-hidden="true" />
          </header>

          <div class="custom-scrollbar min-h-0 flex-1">
            <slot />
          </div>

          <footer
            v-if="$slots.footer"
            class="shrink-0 border-t-2 border-line bg-raised px-5 py-3 sm:px-9"
          >
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
