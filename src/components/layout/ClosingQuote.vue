<script setup lang="ts">
/**
 * The closing quotation, set on the desk just above the colophon.
 *
 * It used to live only on the frontispiece's verso foot, where it was easy to
 * miss and only ever appeared on one page. Mounted in the shell instead, it
 * closes every chapter — the epigraph the tome always ends on.
 *
 * The wording is the author's and is reproduced exactly.
 */
</script>

<template>
  <aside class="on-board mx-auto max-w-[1560px] px-5 pb-6 pt-10 sm:px-10" aria-label="Epigraph">
    <!-- an ornamental rule to set the quotation apart from the page above -->
    <div class="mx-auto flex max-w-md items-center gap-3 opacity-40" aria-hidden="true">
      <span class="h-px flex-1 bg-current" />
      <span class="text-[10px]">❖</span>
      <span class="h-px flex-1 bg-current" />
    </div>

    <figure class="mx-auto mt-6 max-w-2xl text-center">
      <blockquote
        class="font-rune text-[1.35rem] leading-relaxed opacity-90 sm:text-[1.6rem]"
      >
        "Smart people in our industry are the ones who learn how to learn,
        unlearn, and relearn"
      </blockquote>
      <figcaption class="mt-3 font-hand text-[1.15rem] opacity-70 sm:text-[1.3rem]">
        - Shafiqa Iqbal
      </figcaption>
    </figure>
  </aside>
</template>
