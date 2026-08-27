<script setup lang="ts">
import { computed } from "vue";
import type { RoadmapNode } from "@/data/types";
import { useProgress } from "@/composables/useProgress";
import AppIcon from "@/components/ui/AppIcon.vue";

const props = defineProps<{ node: RoadmapNode }>();

const { statusOf, startTopic, completeTopic, masterTopic, resetTopic } =
  useProgress();

const status = computed(() => statusOf(props.node));
const touched = computed(() => status.value !== "available" && status.value !== "locked");
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      v-if="status !== 'in-progress' && !touched"
      type="button"
      class="btn btn-primary"
      @click="startTopic(node.id)"
    >
      <AppIcon name="play" :size="12" /> Start learning
    </button>

    <button
      v-if="status === 'in-progress'"
      type="button"
      class="btn btn-primary"
      @click="completeTopic(node.id)"
    >
      <AppIcon name="check" :size="12" /> Mark completed
    </button>

    <button
      v-if="status === 'completed'"
      type="button"
      class="btn"
      @click="masterTopic(node.id)"
    >
      <AppIcon name="trophy" :size="12" /> Mark mastered
    </button>

    <span
      v-if="status === 'mastered'"
      class="btn cursor-default border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
    >
      <AppIcon name="trophy" :size="12" /> Mastered
    </span>

    <button v-if="touched" type="button" class="btn" @click="resetTopic(node.id)">
      <AppIcon name="reset" :size="12" /> Reset
    </button>

    <p v-if="status === 'locked'" class="ml-auto text-2xs text-faint">
      Prerequisites aren't done — but nothing's stopping you.
    </p>
  </div>
</template>
