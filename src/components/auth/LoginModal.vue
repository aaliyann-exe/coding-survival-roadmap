<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from "vue";
import { useUser } from "@/composables/useUser";
import { useScrollLock } from "@/composables/useScrollLock";
import AppIcon from "@/components/ui/AppIcon.vue";

const { showLoginModal, setUsername } = useUser();
const { lock, unlock } = useScrollLock();

const name = ref("");
const submitting = ref(false);
const offlineNote = ref(false);
const input = ref<HTMLInputElement | null>(null);
const panel = ref<HTMLElement | null>(null);

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

let closeTimer = 0;
/** See ManuscriptModal: with an immediate watcher, a modal that starts closed
 * must not run teardown and clear a scroll lock it never set. */
let hasOpened = false;

/** Escape and the Tab trap are bound at the window, not on the panel: the
 * panel only sees keys once something inside it already has focus, and on a
 * first visit the modal opens with focus still on <body>. */
function onKeydown(event: KeyboardEvent) {
  if (!showLoginModal.value) return;

  if (event.key === "Escape") {
    event.stopPropagation();
    dismiss();
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

// `immediate` matters: showLoginModal is initialised to `true` for a first-time
// visitor, so a plain watcher never fires for the very case that needs it and
// the field was never focused.
watch(
  showLoginModal,
  async (open) => {
    if (open) {
      hasOpened = true;
      name.value = "";
      offlineNote.value = false;
      submitting.value = false;
      lock();
      window.addEventListener("keydown", onKeydown, true);
      await nextTick();
      input.value?.focus();
    } else if (hasOpened) {
      unlock();
      window.removeEventListener("keydown", onKeydown, true);
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  window.clearTimeout(closeTimer);
  if (showLoginModal.value) unlock();
  window.removeEventListener("keydown", onKeydown, true);
});

async function submit() {
  if (!name.value.trim() || submitting.value) return;
  submitting.value = true;
  const result = await setUsername(name.value);
  submitting.value = false;
  if (!result.ok) return;

  if (result.synced) {
    showLoginModal.value = false;
    return;
  }
  // The sync server was unreachable. Previously setUsername closed the modal
  // itself, so this note was set on an already-dismissed dialog and nobody
  // ever saw it. Hold the sheet open long enough to read it, then close.
  offlineNote.value = true;
  closeTimer = window.setTimeout(() => {
    showLoginModal.value = false;
  }, 2200);
}

function dismiss() {
  // Not a real "cancel" — there's nothing to cancel, the site just keeps
  // using localStorage only. It'll ask again next visit.
  window.clearTimeout(closeTimer);
  showLoginModal.value = false;
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showLoginModal"
        class="fixed inset-0 z-[150] bg-board/80 dark:bg-black/80"
        @click="dismiss"
      />
    </Transition>

    <Transition
      enter-active-class="motion-safe:animate-set-down"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="showLoginModal"
        ref="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        class="inset-rule corner-frame fixed left-1/2 top-1/2 z-[160] w-[min(380px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 border-2 border-line bg-canvas p-6 shadow-lift"
      >
        <span
          class="mb-4 flex h-9 w-9 items-center justify-center border border-line-strong text-faint"
          aria-hidden="true"
        >
          <AppIcon name="user" :size="16" />
        </span>

        <h2
          id="login-modal-title"
          class="ink-rule mb-4 text-lg text-ink"
          style="font-family: 'Cinzel', Georgia, serif"
        >
          What's your username?
        </h2>
        <p class="mb-5 text-[13.5px] leading-relaxed text-muted">
          Not an account — just a name so your progress doesn't get mixed up with
          anyone else using this on the same machine. No password, nothing to
          forget.
        </p>

        <form class="space-y-3" @submit.prevent="submit">
          <input
            ref="input"
            v-model="name"
            type="text"
            maxlength="32"
            autocomplete="off"
            spellcheck="false"
            placeholder="e.g. aaliyan"
            aria-label="Username"
            class="w-full border-2 border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-faint focus-visible:border-line-strong"
          />
          <button
            type="submit"
            class="btn btn-primary w-full py-2.5"
            :disabled="!name.trim() || submitting"
          >
            {{ submitting ? "One sec…" : "Continue" }}
            <AppIcon v-if="!submitting" name="arrow-right" :size="13" />
          </button>
        </form>

        <p
          v-if="offlineNote"
          class="mt-3 text-[12px] leading-relaxed text-faint"
          role="status"
        >
          Couldn't reach the sync server — continuing offline. Progress will
          still save on this device and sync once it's back.
        </p>

        <button
          type="button"
          class="mt-4 w-full text-center font-mono text-[10px] uppercase tracking-widest text-faint transition-colors hover:text-ink"
          @click="dismiss"
        >
          Skip for now
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
