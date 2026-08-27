<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { useUser } from "@/composables/useUser";
import AppIcon from "@/components/ui/AppIcon.vue";

const { showLoginModal, setUsername } = useUser();

const name = ref("");
const submitting = ref(false);
const offlineNote = ref(false);
const input = ref<HTMLInputElement | null>(null);

watch(showLoginModal, async (open) => {
  if (open) {
    name.value = "";
    offlineNote.value = false;
    await nextTick();
    input.value?.focus();
  }
});

async function submit() {
  if (!name.value.trim() || submitting.value) return;
  submitting.value = true;
  const result = await setUsername(name.value);
  submitting.value = false;
  if (result.ok) offlineNote.value = !result.synced;
}

function dismiss() {
  // Not a real "cancel" — there's nothing to cancel, the site just keeps
  // using localStorage only. It'll ask again next visit.
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
        class="fixed inset-0 z-[150] bg-black/40 backdrop-blur-[2px] dark:bg-black/70"
        @click="dismiss"
      />
    </Transition>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-[0.97] translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 scale-[0.97] translate-y-2"
    >
      <div
        v-if="showLoginModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        class="fixed left-1/2 top-1/2 z-[160] w-[min(360px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 border border-line bg-surface p-6 shadow-lift"
        @keydown.escape="dismiss"
      >
        <span
          class="mb-4 flex h-9 w-9 items-center justify-center border border-line-strong text-faint"
          aria-hidden="true"
        >
          <AppIcon name="user" :size="16" />
        </span>

        <h2 id="login-modal-title" class="mb-1.5 text-lg font-medium text-ink">
          What's your username?
        </h2>
        <p class="mb-5 text-[13px] font-light leading-relaxed text-muted">
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
            class="w-full border border-line bg-raised px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-faint focus-visible:border-line-strong"
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

        <p v-if="offlineNote" class="mt-3 text-2xs leading-relaxed text-faint">
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
