import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { roadmapById } from "@/data/roadmaps";
import type { RoadmapId } from "@/data/types";

const SITE = "Coding Survival Roadmap";

/** Per-route page titles.
 *
 * The whole app previously shared one <title>, so every browser-history
 * entry, every bookmark and every tab read "Coding Survival Roadmap" — and
 * screen readers announced the same string on every navigation, giving no
 * signal that the page had changed at all. */
const TITLES: Record<string, string> = {
  home: SITE,
  roadmaps: `Roadmaps · ${SITE}`,
  projects: `Projects · ${SITE}`,
  resources: `Resources · ${SITE}`,
  progress: `Progress · ${SITE}`,
  "not-found": `Page not found · ${SITE}`,
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    {
      path: "/roadmaps",
      name: "roadmaps",
      component: () => import("@/views/RoadmapsView.vue"),
    },
    {
      path: "/roadmaps/:id",
      name: "roadmap",
      component: () => import("@/views/RoadmapDetailView.vue"),
    },
    {
      path: "/projects",
      name: "projects",
      component: () => import("@/views/ProjectsView.vue"),
    },
    {
      path: "/resources",
      name: "resources",
      component: () => import("@/views/ResourcesView.vue"),
    },
    {
      path: "/progress",
      name: "progress",
      component: () => import("@/views/ProgressView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    // Opening a node drawer changes the query, not the page. Don't jump.
    if (to.path === from.path) return false;
    return { top: 0 };
  },
});

/** Titles are set after the navigation resolves, so the tab only changes once
 * the page it names is actually showing. The roadmap route is named from its
 * own data rather than the table above. */
router.afterEach((to) => {
  let title = TITLES[String(to.name ?? "")] ?? SITE;

  if (to.name === "roadmap") {
    const roadmap = roadmapById.get(to.params.id as RoadmapId);
    title = roadmap ? `${roadmap.title} · ${SITE}` : `Roadmaps · ${SITE}`;
  }

  document.title = title;
});

export default router;
