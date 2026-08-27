import type { Resource, ResourceType } from "./types";
import { allNodes, nodeIndex } from "./roadmaps";

/**
 * Resources that don't belong to one specific topic — general tools,
 * communities and practice sites worth knowing about from day one.
 */
export const generalResources: Resource[] = [
  {
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org/",
    type: "documentation",
    description:
      "The reference for HTML, CSS, JavaScript and every browser API. If a tutorial disagrees with MDN, MDN is right.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "Exercism",
    url: "https://exercism.org/",
    type: "practice",
    description:
      "Exercises in 70+ languages with free human mentoring. Underrated and completely free.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "freeCodeCamp",
    url: "https://www.freecodecamp.org/",
    type: "course",
    description:
      "Huge free curriculum with certifications. Good structure if you want someone else to decide the order for a while.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "The Odin Project",
    url: "https://www.theodinproject.com/",
    type: "course",
    description:
      "Free full-stack curriculum that pushes you to build rather than watch. Heavy on projects, which is the point.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "Full Stack Open",
    url: "https://fullstackopen.com/en/",
    type: "course",
    description:
      "University of Helsinki, free, and genuinely rigorous. Note it's React-based, so it fits after Vue rather than before.",
    free: true,
    difficulty: "intermediate",
  },
  {
    title: "Frontend Masters - Modern Frontend Paths",
    url: "https://frontendmasters.com/",
    type: "course",
    description:
      "Paid, high quality, taught by people who built the tools. Some free courses available too.",
    free: false,
    difficulty: "intermediate",
  },
  {
    title: "Roadmap.sh",
    url: "https://roadmap.sh/",
    type: "article",
    description:
      "The other roadmap site. Useful for seeing the full landscape, though it's a map of everything rather than a path through it.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "Stack Overflow",
    url: "https://stackoverflow.com/",
    type: "community",
    description:
      "Someone has had your bug. Search the exact error message in quotes before asking anything.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "r/learnprogramming",
    url: "https://www.reddit.com/r/learnprogramming/",
    type: "community",
    description:
      "Good for 'am I doing this right' questions and for realising everyone else is also struggling.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "Vue Land (Discord)",
    url: "https://chat.vuejs.org/",
    type: "community",
    description: "The official Vue community. Fast, friendly, and full of core-adjacent people.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "Gophers Slack",
    url: "https://invite.slack.golangbridge.org/",
    type: "community",
    description: "The main Go community chat. #newbies exists and nobody is mean in it.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "Kaggle",
    url: "https://www.kaggle.com/",
    type: "practice",
    description:
      "Datasets, free courses and competitions. The datasets alone make it worth an account.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "Codewars",
    url: "https://www.codewars.com/",
    type: "practice",
    description:
      "Small algorithm katas. Good warmup, but don't mistake this for building things.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "Visual Studio Code",
    url: "https://code.visualstudio.com/",
    type: "tool",
    description:
      "The default editor for most of this. Install the Volar extension for Vue and the official Go extension for Go.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "Excalidraw",
    url: "https://excalidraw.com/",
    type: "tool",
    description:
      "Sketch your architecture before you build it. Drawing the boxes catches design problems for free.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "Can I Use",
    url: "https://caniuse.com/",
    type: "tool",
    description: "Browser support for any web feature. Check before you rely on the shiny thing.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "regex101",
    url: "https://regex101.com/",
    type: "tool",
    description:
      "Explains your regex piece by piece. Essential, because nobody actually reads regex.",
    free: true,
    difficulty: "beginner",
  },
  {
    title: "The Pragmatic Programmer",
    url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
    type: "book",
    description:
      "Not about a language. About how to think as a developer. Worth reading once a year.",
    free: false,
    difficulty: "intermediate",
  },
  {
    title: "Refactoring UI",
    url: "https://www.refactoringui.com/",
    type: "book",
    description:
      "Design advice for developers who can't design. Practical rules, immediate results.",
    free: false,
    difficulty: "intermediate",
  },
];

export interface IndexedResource extends Resource {
  /** Where this resource is attached, if it came from a roadmap node. */
  nodeId?: string;
  nodeTitle?: string;
  roadmapId?: string;
  roadmapTitle?: string;
}

/** Every resource on the site, node-attached ones first, deduplicated by URL. */
export const allResources: IndexedResource[] = (() => {
  const seen = new Map<string, IndexedResource>();
  for (const node of allNodes) {
    const entry = nodeIndex.get(node.id);
    for (const resource of node.resources) {
      if (seen.has(resource.url)) continue;
      seen.set(resource.url, {
        ...resource,
        nodeId: node.id,
        nodeTitle: node.title,
        roadmapId: entry?.roadmap.id,
        roadmapTitle: entry?.roadmap.title,
      });
    }
  }
  for (const resource of generalResources) {
    if (seen.has(resource.url)) continue;
    seen.set(resource.url, { ...resource });
  }
  return [...seen.values()];
})();

export const resourceTypeLabels: Record<ResourceType, string> = {
  documentation: "Documentation",
  course: "Courses",
  video: "Videos",
  practice: "Interactive & Practice",
  book: "Books",
  article: "Articles",
  tool: "Tools",
  community: "Communities",
};

export const resourceTypeOrder: ResourceType[] = [
  "documentation",
  "course",
  "practice",
  "video",
  "article",
  "book",
  "tool",
  "community",
];
