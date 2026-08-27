import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

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

export default router;
