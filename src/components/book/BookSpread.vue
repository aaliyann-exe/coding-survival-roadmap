<script setup lang="ts">
/**
 * A two-page spread.
 *
 * Every view is authored through this rather than as a stack of full-width
 * sections — that stacking was the thing that kept the old design reading as
 * a web page no matter how it was painted.
 *
 * The left page carries the *apparatus* (folio, chapter numeral, title,
 * marginalia, context) and the right page carries the body. That split is how
 * real manuscripts are laid out, and it gives two genuine pages rather than a
 * wide box with a divider down it.
 *
 * Below `lg` there is no room for two facing pages, so the apparatus becomes
 * a compact chapter band above the body — one page of a field grimoire.
 */
withDefaults(
  defineProps<{
    /** Small caps label above the chapter title. */
    eyebrow?: string;
    /** Chapter title, set in the display face on the left page. */
    title?: string;
    /** Folio mark in the outer margin. */
    folio?: string;
    /** Drop the left page entirely and let the body run the full block. */
    full?: boolean;
  }>(),
  { eyebrow: "", title: "", folio: "", full: false },
);
</script>

<template>
  <!-- `min-w-0` on both pages is load-bearing: grid items default to
       `min-width: auto`, so a single long token anywhere inside a page can
       push the whole spread wider than the book and force the desk to scroll
       sideways. -->
  <div
    class="grid min-h-full w-full"
    :class="full ? 'grid-cols-1' : 'lg:grid-cols-[minmax(0,0.86fr)_18px_minmax(0,1.6fr)]'"
  >
    <!-- ---------------------------------------------- LEFT PAGE (verso) -->
    <aside
      v-if="!full"
      class="page page-left relative flex min-w-0 flex-col px-4 py-6 sm:px-9 sm:py-8 lg:px-10 lg:py-14"
    >
      <div class="lg:sticky lg:top-10">
        <p v-if="folio" class="folio mb-6 hidden lg:block">{{ folio }}</p>

        <p
          v-if="eyebrow"
          class="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-faint sm:text-[10px] sm:tracking-[0.3em]"
        >
          {{ eyebrow }}
        </p>

        <h1
          v-if="title"
          class="text-[1.45rem] leading-[1.08] text-ink sm:text-[1.9rem] sm:leading-[1.05] lg:text-[2.35rem]"
          style="font-family: 'Cinzel', Georgia, serif"
        >
          {{ title }}
        </h1>

        <!-- ornamental divider closing the title block -->
        <div v-if="title" class="mt-5 flex items-center gap-2" aria-hidden="true">
          <span class="h-px flex-1 bg-line/60" />
          <span class="text-[10px] text-line-strong">◆</span>
          <span class="h-px flex-1 bg-line/60" />
        </div>

        <div class="mt-6">
          <slot name="left" />
        </div>
      </div>

      <div class="mt-auto hidden pt-10 lg:block">
        <slot name="left-foot" />
      </div>
    </aside>

    <!-- ------------------------------------------------------- GUTTER -->
    <div v-if="!full" class="gutter hidden lg:block" aria-hidden="true" />

    <!-- --------------------------------------------- RIGHT PAGE (recto) -->
    <div
      class="page relative flex min-w-0 flex-col px-4 py-6 sm:px-9 sm:py-8 lg:px-12 lg:py-14"
      :class="full ? '' : 'page-right'"
    >
      <!-- In `full` there is no verso to carry the apparatus, so the title
           block moves onto the recto. Without this a full-bleed page (the
           404) silently lost its heading entirely. -->
      <header v-if="full && (title || eyebrow)" class="mx-auto mb-8 w-full max-w-2xl">
        <p v-if="folio" class="folio mb-5">{{ folio }}</p>
        <p
          v-if="eyebrow"
          class="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-faint sm:text-[10px] sm:tracking-[0.3em]"
        >
          {{ eyebrow }}
        </p>
        <h1
          v-if="title"
          class="text-[1.45rem] leading-[1.08] text-ink sm:text-[1.9rem] sm:leading-[1.05] lg:text-[2.35rem]"
          style="font-family: 'Cinzel', Georgia, serif"
        >
          {{ title }}
        </h1>
        <div v-if="title" class="mt-5 flex items-center gap-2" aria-hidden="true">
          <span class="h-px flex-1 bg-line/60" />
          <span class="text-[10px] text-line-strong">◆</span>
          <span class="h-px flex-1 bg-line/60" />
        </div>
      </header>

      <slot />
    </div>
  </div>
</template>
