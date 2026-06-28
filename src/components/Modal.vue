<script setup>
import { onMounted, onUnmounted } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  resources: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close"]);

const handleKeyDown = (e) => {
  if (e.key === "Escape" && props.isOpen) {
    emit("close");
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <!-- Dark dim overlay background -->
        <div
          class="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm"
          @click="emit('close')"
        ></div>

        <!-- Centered Modal Panel -->
        <div
          class="relative w-full max-w-md bg-[#fbfbfa] dark:bg-[#121213] border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 text-left transition-all duration-300 transform"
          role="dialog"
          aria-modal="true"
        >
          <!-- Close button -->
          <button
            @click="emit('close')"
            class="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-100 transition-colors focus:outline-none p-1"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Content -->
          <div>
            <p
              class="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2"
            >
              Milestone Details
            </p>
            <h3
              class="text-xl font-normal text-zinc-950 dark:text-zinc-50 mb-4 leading-tight"
            >
              {{ title }}
            </h3>
            <p
              class="text-zinc-500 dark:text-zinc-400 text-sm font-light leading-relaxed mb-6"
            >
              {{ description }}
            </p>

            <!-- Resources list -->
            <div v-if="resources && resources.length > 0">
              <h4
                class="font-mono text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-3"
              >
                Curated Resources
              </h4>
              <ul class="space-y-2.5">
                <li
                  v-for="resource in resources"
                  :key="resource.name"
                  class="text-xs"
                >
                  <a
                    :href="resource.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-light"
                  >
                    <span>{{ resource.name }}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
