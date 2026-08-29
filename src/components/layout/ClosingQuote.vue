<script setup lang="ts">
/**
 * The closing quotation, set on the desk just above the colophon.
 *
 * It used to live only on the frontispiece's verso foot, where it was easy to
 * miss and only ever appeared on one page. Mounted in the shell instead, it
 * closes every chapter — the epigraph the tome always ends on.
 *
 * The wording is the author's and is reproduced exactly; only the three verbs
 * are wrapped, so they can be gilded and underscored without altering a word.
 */
import { onBeforeUnmount, onMounted, ref } from "vue";

const root = ref<HTMLElement | null>(null);
const lit = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  // The epigraph sits below the fold on most pages, so the reveal is tied to
  // it actually being looked at rather than to mount. Fires once.
  if (!root.value || typeof IntersectionObserver === "undefined") {
    lit.value = true;
    return;
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          lit.value = true;
          observer?.disconnect();
          observer = null;
        }
      }
    },
    { threshold: 0.45 },
  );
  observer.observe(root.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <aside
    ref="root"
    class="on-board mx-auto max-w-[1560px] px-5 pb-6 pt-10 sm:px-10"
    :class="lit ? 'epigraph-lit' : ''"
    aria-label="Epigraph"
  >
    <!-- an ornamental rule to set the quotation apart from the page above -->
    <div class="mx-auto flex max-w-md items-center gap-3 opacity-40" aria-hidden="true">
      <span class="h-px flex-1 bg-current" />
      <span class="text-[10px]">❖</span>
      <span class="h-px flex-1 bg-current" />
    </div>

    <figure class="mx-auto mt-7 max-w-3xl text-center">
      <blockquote
        class="font-rune text-[1.5rem] leading-[1.7] opacity-95 sm:text-[1.9rem]"
      >
        <!-- Only the three verbs in the list are wrapped. The earlier "who
             learn how to" is the sentence's main verb, not one of the three
             things being enumerated, so it stays plain. -->
        "Smart people in our industry are the ones who learn how to
        <span class="quote-key">learn</span>,
        <span class="quote-key quote-key-undo">unlearn</span>, and
        <span class="quote-key">relearn</span>"
      </blockquote>
      <figcaption class="mt-5 font-hand text-[1.15rem] opacity-70 sm:text-[1.35rem]">
        - Shafiqa Iqbal
      </figcaption>
    </figure>
  </aside>
</template>
