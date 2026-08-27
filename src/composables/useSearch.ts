import { computed, ref } from "vue";
import type { SearchHit } from "@/data/types";
import { allNodes, nodeIndex } from "@/data/roadmaps";
import projectList from "@/data/projects";
import { allResources } from "@/data/resources";

interface IndexEntry extends Omit<SearchHit, "score"> {
  haystack: string;
}

const PAGES: Omit<IndexEntry, "haystack">[] = [
  {
    id: "page-home",
    kind: "page",
    title: "Home",
    subtitle: "Read this first, then pick a path",
    breadcrumb: "Pages",
    to: "/",
  },
  {
    id: "page-roadmaps",
    kind: "page",
    title: "Roadmaps",
    subtitle: "Frontend, Backend, Python / AI",
    breadcrumb: "Pages",
    to: "/roadmaps",
  },
  {
    id: "page-projects",
    kind: "page",
    title: "Projects",
    subtitle: "The whole project library",
    breadcrumb: "Pages",
    to: "/projects",
  },
  {
    id: "page-resources",
    kind: "page",
    title: "Resources",
    subtitle: "Docs, courses, practice, tools",
    breadcrumb: "Pages",
    to: "/resources",
  },
  {
    id: "page-progress",
    kind: "page",
    title: "Progress",
    subtitle: "Your dashboard and achievements",
    breadcrumb: "Pages",
    to: "/progress",
  },
];

const index: IndexEntry[] = (() => {
  const entries: IndexEntry[] = [];

  for (const page of PAGES) {
    entries.push({ ...page, haystack: `${page.title} ${page.subtitle}`.toLowerCase() });
  }

  for (const node of allNodes) {
    const entry = nodeIndex.get(node.id);
    const roadmap = entry?.roadmap;
    const stage = roadmap?.stages.find((s) => s.id === node.stage);
    entries.push({
      id: `topic-${node.id}`,
      kind: "topic",
      title: node.title,
      subtitle: node.tagline,
      breadcrumb: `${roadmap?.title ?? ""} → ${stage?.title ?? node.stage}`,
      to: `/roadmaps/${roadmap?.id}?node=${node.id}`,
      nodeId: node.id,
      haystack: [
        node.title,
        node.tagline,
        node.description,
        node.why,
        node.skills.join(" "),
        stage?.title ?? "",
        roadmap?.title ?? "",
      ]
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const project of projectList) {
    entries.push({
      id: `project-${project.id}`,
      kind: "project",
      title: project.title,
      subtitle: project.blurb,
      breadcrumb: `Projects → ${project.tier === "pain" ? "Why did I do this to myself" : project.tier}`,
      to: `/projects?project=${project.id}`,
      projectId: project.id,
      haystack: [
        project.title,
        project.blurb,
        project.description,
        project.stack.join(" "),
        project.features.join(" "),
      ]
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const resource of allResources) {
    entries.push({
      id: `resource-${resource.url}`,
      kind: "resource",
      title: resource.title,
      subtitle: resource.description,
      breadcrumb: resource.nodeTitle
        ? `Resources → ${resource.nodeTitle}`
        : "Resources",
      to: "/resources",
      url: resource.url,
      haystack: `${resource.title} ${resource.description} ${resource.type}`.toLowerCase(),
    });
  }

  return entries;
})();

const KIND_WEIGHT: Record<SearchHit["kind"], number> = {
  page: 4,
  topic: 3,
  project: 2,
  resource: 1,
};

export function searchAll(rawQuery: string, limit = 24): SearchHit[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];
  const terms = query.split(/\s+/).filter(Boolean);

  const hits: SearchHit[] = [];
  for (const entry of index) {
    let score = 0;
    const title = entry.title.toLowerCase();

    for (const term of terms) {
      if (!entry.haystack.includes(term)) {
        score = -1;
        break;
      }
      if (title === term) score += 120;
      else if (title.startsWith(term)) score += 70;
      else if (title.includes(term)) score += 45;
      else score += 10;
    }
    if (score < 0) continue;
    score += KIND_WEIGHT[entry.kind];
    hits.push({
      id: entry.id,
      kind: entry.kind,
      title: entry.title,
      subtitle: entry.subtitle,
      breadcrumb: entry.breadcrumb,
      to: entry.to,
      nodeId: entry.nodeId,
      projectId: entry.projectId,
      url: entry.url,
      score,
    });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

const isOpen = ref(false);
const query = ref("");

export function useCommandPalette() {
  const results = computed(() => searchAll(query.value));

  function open() {
    isOpen.value = true;
  }
  function close() {
    isOpen.value = false;
    query.value = "";
  }
  function toggle() {
    if (isOpen.value) close();
    else open();
  }

  return { isOpen, query, results, open, close, toggle };
}
