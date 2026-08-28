<script setup lang="ts">
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

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      lastFocused = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeydown, true);
      await nextTick();
      panel.value?.focus();
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeydown, true);
      lastFocused?.focus?.();
      lastFocused = null;
    }
  },
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
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[90] bg-black/55 dark:bg-black/75"
        @click="emit('close')"
      />
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-8 opacity-0 sm:translate-y-0 sm:translate-x-8"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="translate-y-8 opacity-0 sm:translate-y-0 sm:translate-x-8"
    >
      <div
        v-if="open"
        ref="panel"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        class="page-edge fixed inset-x-0 bottom-0 top-10 z-[95] flex flex-col border-2 border-line bg-surface shadow-lift outline-none sm:inset-y-0 sm:left-auto sm:right-0 sm:top-0 sm:w-[min(560px,100vw)] sm:border-y-0 sm:border-r-0"
      >
        <header class="ink-rule bg-raised px-5 pt-4 sm:px-7 sm:pt-5">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p v-if="eyebrow" class="label-mono mb-1.5 flex items-center gap-1.5">
                <span class="text-[10px] text-faint" aria-hidden="true">◆</span>
                {{ eyebrow }}
              </p>
              <h2 class="text-lg font-medium leading-tight text-ink sm:text-xl">
                {{ title }}
              </h2>
            </div>
            <button
              type="button"
              class="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-line text-faint transition-colors hover:border-line-strong hover:text-ink"
              aria-label="Close"
              @click="emit('close')"
            >
              <AppIcon name="close" :size="16" />
            </button>
          </div>
        </header>

        <div class="custom-scrollbar flex-1 overflow-y-auto overscroll-contain">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="border-t border-line bg-raised px-5 py-3 sm:px-7">
          <slot name="footer" />
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>
