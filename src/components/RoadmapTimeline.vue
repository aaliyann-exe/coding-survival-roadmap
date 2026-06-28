<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
});

defineEmits(["node-click"]);
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
        <span
          class="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-zinc-800 dark:group-hover:bg-zinc-100 transition-colors duration-300"
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
      </div>
    </div>
  </div>
</template>
