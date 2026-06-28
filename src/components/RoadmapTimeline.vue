<script setup>
import { ref, onMounted } from "vue";

defineProps({
  items: {
    type: Array,
    required: true,
  },
});

defineEmits(["node-click"]);

const completedSteps = ref({});

onMounted(() => {
  const saved = localStorage.getItem("roadmap-completed-steps");
  if (saved) {
    try {
      completedSteps.value = JSON.parse(saved);
    } catch (e) {
      completedSteps.value = {};
    }
  }
});

const toggleCompleted = (title) => {
  completedSteps.value[title] = !completedSteps.value[title];
  localStorage.setItem(
    "roadmap-completed-steps",
    JSON.stringify(completedSteps.value),
  );
};
</script>

<template>
  <div
    class="relative pl-8 border-l border-zinc-200/60 dark:border-zinc-800/60 space-y-12 ml-4"
  >
    <div
      v-for="(item, index) in items"
      :key="item.step || index"
      class="relative group"
    >
      <!-- Clickable Node (Circle on the vertical path) -->
      <button
        @click="$emit('node-click', item)"
        class="absolute -left-[41px] top-1 w-[18px] h-[18px] rounded-full bg-[#fbfbfa] dark:bg-[#0c0c0d] border-2 border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-800 dark:group-hover:border-zinc-100 transition-colors duration-300 flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        aria-label="View details"
      >
        <!-- Bullet which will light green when a step is toggled as "Completed" -->
        <span
          class="w-1.5 h-1.5 rounded-full transition-colors duration-300"
          :class="
            completedSteps[item.title]
              ? 'bg-emerald-400 dark:bg-emerald-800'
              : 'bg-transparent group-hover:bg-zinc-800 dark:group-hover:bg-zinc-100'
          "
        ></span>
      </button>

      <!-- Minimal Card content -->
      <div
        @click="$emit('node-click', item)"
        class="cursor-pointer p-6 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-400 dark:hover:border-zinc-600 bg-transparent transition-all duration-300 text-left"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
            STEP {{ item.step }}
          </span>
          <span
            class="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 underline group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors"
          >
            Details →
          </span>
        </div>
        <h3
          class="text-lg font-normal text-zinc-800 dark:text-zinc-100 mb-3 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors"
        >
          {{ item.title }}
        </h3>
        <p
          class="text-zinc-500 dark:text-zinc-400 text-sm font-light leading-relaxed mb-4"
        >
          {{ item.description }}
        </p>

        <!-- Bullet lists / Milestones -->
        <ul class="flex flex-wrap gap-1.5">
          <li
            v-for="milestone in item.milestones"
            :key="milestone"
            class="font-mono text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900/40 px-2 py-0.5 border border-zinc-200/40 dark:border-zinc-800/40"
          >
            {{ milestone }}
          </li>
        </ul>

        <!-- Toggle Button for Completed Step -->
        <div
          class="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-900/50 flex justify-end"
        >
          <button
            @click.stop="toggleCompleted(item.title)"
            class="flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] tracking-wider uppercase border transition-all duration-300"
            :class="
              completedSteps[item.title]
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-transparent'
            "
          >
            <span
              class="w-1.5 h-1.5 rounded-full transition-colors duration-300"
              :class="
                completedSteps[item.title]
                  ? 'bg-emerald-500'
                  : 'bg-zinc-300 dark:bg-zinc-700'
              "
            ></span>
            {{ completedSteps[item.title] ? "Learned" : "Mark as Learned" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
