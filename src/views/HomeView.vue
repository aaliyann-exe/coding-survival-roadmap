<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { roadmaps, totalTopics, roadmapForNode } from "@/data/roadmaps";
import projectList from "@/data/projects";
import { allResources } from "@/data/resources";
import { generalAdvice, nobodyTellsYou } from "@/data/advice";
import { useProgress } from "@/composables/useProgress";
import ProgressRing from "@/components/ui/ProgressRing.vue";
import ProgressBar from "@/components/ui/ProgressBar.vue";
import AppIcon from "@/components/ui/AppIcon.vue";

const router = useRouter();
const {
  overallPercent,
  perRoadmap,
  nextUp,
  streak,
  skillLevel,
  completedProjectIds,
} = useProgress();

const quickStart = [
  {
    id: "frontend",
    prompt:
      "I want to build websites cuz I fw design and hate myself (Front-End)",
    detail: "HTML, CSS, JavaScript, TypeScript, Vue. The visible half.",
    to: "/roadmaps/frontend",
    track: "track-frontend",
  },
  {
    id: "backend",
    prompt: "I want to build what runs a website cuz I fw logic (Back-End)",
    detail: "Go, APIs, SQL, concurrency, the bit that gets blamed.",
    to: "/roadmaps/backend",
    track: "track-backend",
  },
  {
    id: "python",
    prompt: "I want to destroy datasets with Python (AI/ML)",
    detail: "Pandas, stats, scikit-learn, and eventually actual ML.",
    to: "/roadmaps/python",
    track: "track-python",
  },
];

const nextNode = computed(() => nextUp.value?.node ?? null);
const nextRoadmap = computed(() =>
  nextNode.value ? roadmapForNode(nextNode.value.id) : undefined,
);

const featuredProject = computed(() => {
  const undone = projectList.filter(
    (p) => !completedProjectIds.value.has(p.id),
  );
  if (nextNode.value?.projects?.length) {
    const linked = undone.find((p) => nextNode.value?.projects?.includes(p.id));
    if (linked) return linked;
  }
  // Deterministic per day so it doesn't shuffle on every render.
  const day = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
  return undone[day % undone.length] ?? projectList[0];
});

function openNext() {
  if (!nextNode.value || !nextRoadmap.value) return;
  router.push(`/roadmaps/${nextRoadmap.value.id}?node=${nextNode.value.id}`);
}
</script>

<template>
  <div>
    <!-- ============================================================ HERO -->
    <section class="relative overflow-hidden border-b border-line">
      <div
        class="absolute inset-0 pointer-events-none grid-paper opacity-70"
        aria-hidden="true"
      />
      <div
        class="absolute inset-x-0 bottom-0 h-32 pointer-events-none bg-gradient-to-t from-canvas to-transparent"
        aria-hidden="true"
      />

      <div class="relative max-w-6xl px-4 py-16 mx-auto sm:px-6 sm:py-24">
        <p class="mb-6 label-mono seesaw-text">
          <span class="seesaw-num num-6">6</span>-<span class="seesaw-num num-7"
            >7</span
          >
          (omg 67) months of coding, mapped out
        </p>

        <h1
          class="max-w-4xl text-3xl font-light leading-[1.15] tracking-tight text-ink md:text-5xl lg:text-[3.4rem]"
        >
          A no bs guide/roadmap to what I have learned in 6 months
        </h1>

        <p
          class="max-w-2xl mt-6 text-base font-light leading-relaxed text-muted md:text-lg"
        >
          Not another list of technologies. This one tells you what to learn, in
          what order, why it matters, roughly how long it takes, and what to
          build so you actually remember it.
        </p>

        <div class="flex flex-wrap items-center gap-3 mt-9">
          <RouterLink to="/roadmaps" class="btn btn-primary px-5 py-2.5">
            Start learning <AppIcon name="arrow-right" :size="13" />
          </RouterLink>
          <RouterLink to="/projects" class="btn px-5 py-2.5">
            Just gimme something to build
          </RouterLink>
        </div>

        <dl
          class="grid max-w-3xl grid-cols-2 gap-px border mt-14 border-line bg-line sm:grid-cols-4"
        >
          <div class="p-4 bg-canvas">
            <dt class="label-mono mb-1.5">Topics</dt>
            <dd class="font-mono text-xl tabular-nums text-ink">
              {{ totalTopics }}
            </dd>
          </div>
          <div class="p-4 bg-canvas">
            <dt class="label-mono mb-1.5">Projects</dt>
            <dd class="font-mono text-xl tabular-nums text-ink">
              {{ projectList.length }}
            </dd>
          </div>
          <div class="p-4 bg-canvas">
            <dt class="label-mono mb-1.5">Resources</dt>
            <dd class="font-mono text-xl tabular-nums text-ink">
              {{ allResources.length }}
            </dd>
          </div>
          <div class="p-4 bg-canvas">
            <dt class="label-mono mb-1.5">Paths</dt>
            <dd class="font-mono text-xl tabular-nums text-ink">
              {{ roadmaps.length }}
            </dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- ===================================================== QUICK START -->
    <section class="max-w-6xl px-4 mx-auto py-14 sm:px-6 sm:py-20">
      <h2 class="mb-6 rule-heading">Pick a lane</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <RouterLink
          v-for="choice in quickStart"
          :key="choice.id"
          :to="choice.to"
          class="group border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgb(var(--track))]"
          :class="choice.track"
        >
          <span
            class="block w-8 h-1 mb-4 transition-all duration-200 group-hover:w-14"
            style="background-color: rgb(var(--track))"
          />
          <h3 class="text-lg font-normal leading-snug text-ink">
            {{ choice.prompt }}
          </h3>
          <p class="mt-2 text-[13px] font-light leading-relaxed text-muted">
            {{ choice.detail }}
          </p>
          <span
            class="mt-5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-faint transition-colors group-hover:text-[rgb(var(--track))]"
          >
            Open roadmap <AppIcon name="arrow-right" :size="11" />
          </span>
        </RouterLink>
      </div>
    </section>

    <!-- ================================================== DOCS / THE YAP -->
    <section class="border-y border-line bg-raised/40">
      <div class="max-w-6xl px-4 mx-auto py-14 sm:px-6 sm:py-20">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
          <div>
            <h2 class="mb-8 rule-heading">Read this first</h2>

            <!-- Original writing. Preserved exactly. -->
            <div class="max-w-2xl">
              <p
                class="mb-6 text-base font-light leading-relaxed text-muted md:text-[17px]"
              >
                Okay so, consider this para as the "docs" (documentation) of the
                roadmap. There is litchy so much in this field that I can't
                remember from the top of my head, however I will update the
                stuff here if I remember them/as my own learning increases.
              </p>

              <h3
                class="mt-10 mb-6 text-2xl font-light leading-tight tracking-tight text-ink md:text-3xl"
              >
                Sooo, what's the roadmap about?
              </h3>
              <p
                class="mb-6 text-base font-light leading-relaxed text-muted md:text-[17px]"
              >
                I've made this site such that it has all the 3 areas I learned,
                i.e Frontend, Backend, AI / ML. Kinza told me ke you wanna learn
                AI, but I still added the other stuff just in case you wanna
                explore it. Each category has an overview, a roadmap of how to
                learn and what to learn, and a list of projects to build to
                truly know if you've grasped the concepts.
              </p>
              <p
                class="mb-6 text-base font-light leading-relaxed text-muted md:text-[17px]"
              >
                In the roadmap, there are clickable nodes. Most nodes have a
                description and a list of resources to learn from, and some
                other miscellaneous info. The roadmap is designed to be followed
                in order, but you can also jump around if you want to focus on a
                specific area.
              </p>
              <p
                class="mb-6 text-base font-light leading-relaxed text-muted md:text-[17px]"
              >
                DO THE PROJECTS LAZMI !!! They are the best way to learn and
                retain the concepts. The projects might be difficult at first,
                but remember, our brains learn the most when we're struggling so
                try not to go "Screw this, I'll just skip this" or use ai. Also
                bonus tip, think of projects that YOU wanna do or you think
                might be useful to you. Like say, I can't speak for you, but I
                often get bored of songs quickly, and it takes weeks or months
                for me to find a song which reminds me of the vibe of the song I
                play on repeat, so if you have the same problem, you could use
                the spotify API to analyze the songs you like the most, and it
                could automatically generate a playlist of recommended songs. Or
                say, you're watching your calories, so create a program with an
                array of nutritional value of foods, and you can easily just add
                the foods you ate into the program and it tracks your daily
                macros, ykwim? Like fun stuff.
              </p>
              <p
                class="mb-6 text-base font-light leading-relaxed text-muted md:text-[17px]"
              >
                This will sound like unc advice and it's annoying af but do NAWT
                use AI for coding. Stay away from vibe coding like it's an O
                level paper leaker on discord. When I was first learning coding,
                ALL my seniors told me to stay away from AI but for the first 2
                months I didn't listen and secretly used AI, and guess what. I
                learned nothing. And once you get hooked on vibe coding, it's
                OVER for your learning. So for your own sake, stay away from AI.
                You can hmu, or ask reddit, or check stackoverflow for
                solutions, but do NOT consult chatgpt or gemini or claude. Even
                if you do use chatgpt or gemini, then tell it to act as an
                INSTRUCTOR instead of generating you code. Tell it to explain
                concepts to you and YOU should solve the problem yourself, even
                if it takes multiple days.
              </p>
              <p
                class="mb-6 text-base font-light leading-relaxed text-muted md:text-[17px]"
              >
                Btw, your screen WILL light up with multiple red errors
                constantly. That doesn't mean you're failing, that's just what
                coding is 90% of the time 🙁🥀. The debugging is actually one of
                the funnest parts about coding and problem solving (or maybe I'm
                a masochist...)
              </p>
              <p
                class="mb-6 text-base font-light leading-relaxed text-muted md:text-[17px]"
              >
                VERY VERY IMP FINAL TIP: Try to read the docs (documentation)
                for any language/framework/library/tool you want to learn/use
                instead of just watching tutorials. I know docs are the most
                annoying and head bashing part, but they are genuinely the best
                way to learn about the thing you're learning.
              </p>
              <p
                class="mb-6 text-base font-light leading-relaxed text-muted md:text-[17px]"
              >
                TLDR: read docs >>> watch tutorials (consult ai IF and only if
                needed) >>> build projects >>> get 194883 bugs >>> fix project
                >>> learn new topic >>> repeat
              </p>
              <p
                class="text-base font-light leading-relaxed text-muted md:text-[17px]"
              >
                Anws, enough with the yappucino, let's get to the programmucino
                😋
              </p>
            </div>
          </div>

          <!-- sticky mini-nav for the long read -->
          <aside class="hidden lg:block">
            <div class="sticky p-5 border top-24 border-line bg-surface">
              <p class="mb-4 label-mono">The short version</p>
              <ol
                class="space-y-3 text-[13px] font-light leading-relaxed text-muted"
              >
                <li class="flex gap-2.5">
                  <span class="font-mono text-faint">01</span> Read the docs,
                  not another 12-hour video.
                </li>
                <li class="flex gap-2.5">
                  <span class="font-mono text-faint">02</span> Build the
                  projects. Lazmi. Not optional.
                </li>
                <li class="flex gap-2.5">
                  <span class="font-mono text-faint">03</span> Don't let AI
                  write it for you.
                </li>
                <li class="flex gap-2.5">
                  <span class="font-mono text-faint">04</span> The red errors
                  are the job, not a verdict.
                </li>
                <li class="flex gap-2.5">
                  <span class="font-mono text-faint">05</span> Consistency &gt;
                  intensity, every time.
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- =================================================== YOUR PROGRESS -->
    <section class="max-w-6xl px-4 mx-auto py-14 sm:px-6 sm:py-20">
      <h2 class="mb-8 rule-heading">Where you're at</h2>

      <div class="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-12">
        <div class="flex items-center gap-6">
          <ProgressRing
            :percent="overallPercent"
            label="Overall"
            :sublabel="`${skillLevel}`"
          />
          <dl class="space-y-4">
            <div>
              <dt class="mb-1 label-mono">Streak</dt>
              <dd class="font-mono text-lg tabular-nums text-ink">
                {{ streak }} <span class="text-xs text-faint">days</span>
              </dd>
            </div>
            <div>
              <dt class="mb-1 label-mono">Projects built</dt>
              <dd class="font-mono text-lg tabular-nums text-ink">
                {{ completedProjectIds.size }}
                <span class="text-xs text-faint"
                  >/ {{ projectList.length }}</span
                >
              </dd>
            </div>
          </dl>
        </div>

        <div class="space-y-5">
          <div
            v-for="entry in perRoadmap"
            :key="entry.roadmap.id"
            :class="entry.roadmap.trackClass"
          >
            <RouterLink
              :to="`/roadmaps/${entry.roadmap.id}`"
              class="block p-4 transition-colors border group border-line bg-surface hover:border-line-strong"
            >
              <div class="flex items-baseline justify-between gap-3 mb-3">
                <span class="text-[15px] text-ink">{{
                  entry.roadmap.title
                }}</span>
                <span class="font-mono text-[11px] tabular-nums text-faint"
                  >{{ entry.completed }} / {{ entry.total }} topics</span
                >
              </div>
              <ProgressBar :percent="entry.percent" :show-value="false" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================== WHAT'S NEXT -->
    <section class="border-y border-line bg-raised/40">
      <div class="max-w-6xl px-4 mx-auto py-14 sm:px-6 sm:py-20">
        <div class="grid gap-6 md:grid-cols-2">
          <!-- next topic -->
          <div
            v-if="nextNode && nextRoadmap"
            class="p-6 border border-line bg-surface"
            :class="nextRoadmap.trackClass"
          >
            <p class="mb-4 label-mono">What should I learn next?</p>
            <h3 class="mb-1 text-xl font-normal text-ink">
              {{ nextNode.title }}
            </h3>
            <p
              class="mb-4 font-mono text-[10px] uppercase tracking-widest text-faint"
            >
              {{ nextRoadmap.title }} · {{ nextNode.time.basics }} for the
              basics
            </p>
            <p class="mb-6 text-[14px] font-light leading-relaxed text-muted">
              {{ nextNode.why }}
            </p>
            <button type="button" class="btn btn-primary" @click="openNext">
              <AppIcon name="arrow-right" :size="12" />
              {{ nextUp?.reason === "in-progress" ? "Continue" : "Open topic" }}
            </button>
          </div>

          <!-- featured project -->
          <div
            v-if="featuredProject"
            class="p-6 border border-line bg-surface"
            :class="{
              'track-frontend': featuredProject.roadmap === 'frontend',
              'track-backend': featuredProject.roadmap === 'backend',
              'track-python': featuredProject.roadmap === 'python',
            }"
          >
            <p class="mb-4 label-mono">Build this</p>
            <h3 class="mb-1 text-xl font-normal text-ink">
              {{ featuredProject.title }}
            </h3>
            <p
              class="mb-4 font-mono text-[10px] uppercase tracking-widest text-faint"
            >
              {{
                featuredProject.tier === "pain"
                  ? "Regret tier"
                  : featuredProject.tier
              }}
              · {{ featuredProject.time }}
            </p>
            <p class="mb-6 text-[14px] font-light leading-relaxed text-muted">
              {{ featuredProject.blurb }}
            </p>
            <RouterLink
              :to="`/projects?project=${featuredProject.id}`"
              class="btn btn-primary"
            >
              <AppIcon name="box" :size="12" /> Read the brief
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- =========================================================== ADVICE -->
    <section class="max-w-6xl px-4 mx-auto py-14 sm:px-6 sm:py-20">
      <div class="mb-10">
        <p class="mb-2 label-mono">Guideline</p>
        <h2 class="text-xl font-normal text-ink">
          Best Practices &amp; Advice
        </h2>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div
          v-for="advice in generalAdvice"
          :key="advice.title"
          class="p-6 border border-line bg-raised/50"
        >
          <h3 class="mb-3 font-mono text-xs tracking-wider uppercase text-ink">
            {{ advice.title }}
          </h3>
          <p class="text-sm font-light leading-relaxed text-muted">
            {{ advice.body }}
          </p>
        </div>
      </div>

      <h2 class="mt-16 mb-6 rule-heading">Things nobody tells beginners</h2>
      <div
        class="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2"
      >
        <div
          v-for="item in nobodyTellsYou"
          :key="item.title"
          class="p-6 bg-surface"
        >
          <h3 class="mb-2 text-[15px] font-medium text-ink">
            {{ item.title }}
          </h3>
          <p class="text-[13.5px] font-light leading-relaxed text-muted">
            {{ item.body }}
          </p>
        </div>
      </div>
    </section>

    <!-- ============================================================ QUOTE -->
    <section class="border-t border-line">
      <div class="max-w-6xl px-4 mx-auto text-center py-14 sm:px-6">
        <p
          class="max-w-xl mx-auto text-sm italic font-light leading-relaxed text-faint"
        >
          "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra
        </p>
      </div>
    </section>
  </div>
</template>

<style>
.seesaw-num {
  display: inline-block;
  transition: transform 0.2s ease;
}

/* Start the animation when hovering over the paragraph */
.seesaw-text:hover .num-6 {
  animation: moveUpFirst 1.2s ease-in-out infinite;
}

.seesaw-text:hover .num-7 {
  animation: moveDownFirst 1.2s ease-in-out infinite;
}

/* 6 goes up first, then down */
@keyframes moveUpFirst {
  0%,
  100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-5px);
  }
  75% {
    transform: translateY(5px);
  }
}

/* 7 goes down first, then up */
@keyframes moveDownFirst {
  0%,
  100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(5px);
  }
  75% {
    transform: translateY(-5px);
  }
}
</style>
