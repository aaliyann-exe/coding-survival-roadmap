/**
 * Every bit of roadmap content on this site is plain structured data.
 * Add an object here, the UI picks it up. No template surgery required.
 */

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type NodeStatus =
  | "locked"
  | "available"
  | "in-progress"
  | "completed"
  | "mastered";

export type ResourceType =
  | "documentation"
  | "course"
  | "video"
  | "practice"
  | "book"
  | "article"
  | "tool"
  | "community";

export type RoadmapId = "frontend" | "backend" | "python";

export type ProjectTier = "beginner" | "intermediate" | "advanced" | "pain";

export interface Resource {
  title: string;
  url: string;
  type: ResourceType;
  description: string;
  free?: boolean;
  difficulty?: Difficulty;
}

/**
 * Three honest numbers instead of one dishonest one.
 * `basics` = you can follow along. `useful` = you can build with it.
 * `mastery` = the part nobody finishes, and that's fine.
 */
export interface TimeEstimate {
  basics: string;
  useful: string;
  mastery?: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  /** One-line summary shown on the node card. */
  tagline: string;
  /** The longer explanation shown in the detail drawer. */
  description: string;
  /** The "why should I care" answer. */
  why: string;
  /** Which stage of the roadmap this belongs to. */
  stage: string;
  difficulty: Difficulty;
  time: TimeEstimate;
  /** Node ids that should realistically come first. Also draws the graph edges. */
  prerequisites: string[];
  /** The practical checklist of what you actually need to know. */
  skills: string[];
  resources: Resource[];
  /** Project ids from data/projects.ts */
  projects?: string[];
  /** Things nobody tells beginners about this topic. */
  gotchas?: string[];
  /** Optional detour rather than part of the main line. */
  optional?: boolean;
  /** Graph position: column lane (0-based) and row. */
  col: number;
  row: number;
}

export interface Stage {
  id: string;
  title: string;
  blurb: string;
}

export interface Roadmap {
  id: RoadmapId;
  title: string;
  /** Short label for tabs and nav. */
  short: string;
  /** The funny one-liner on the hub card. */
  tagline: string;
  /** The original field overview text. */
  overview: string;
  /** Extra context written for the revamp. */
  intro: string;
  difficulty: string;
  totalTime: string;
  /** CSS class that sets the --track accent for this roadmap. */
  trackClass: string;
  /** How wide the node graph is, in lanes. */
  lanes: number;
  stages: Stage[];
  nodes: RoadmapNode[];
}

export interface Project {
  id: string;
  title: string;
  tier: ProjectTier;
  roadmap: RoadmapId;
  /** Card-level summary. */
  blurb: string;
  /** Full brief shown in the modal. */
  description: string;
  time: string;
  stack: string[];
  /** Node ids this project exercises. */
  skills: string[];
  features: string[];
  stretch: string[];
  /** Original level label, where the project came from the first version of the site. */
  legacyLevel?: string;
}

export interface AchievementContext {
  completedNodes: Set<string>;
  startedNodes: Set<string>;
  completedProjects: Set<string>;
  completedByRoadmap: Record<RoadmapId, number>;
  totalByRoadmap: Record<RoadmapId, number>;
  streak: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  /** How you unlock it, in plain words. */
  hint: string;
  icon: string;
  condition: (ctx: AchievementContext) => boolean;
}

export interface AdviceCard {
  title: string;
  body: string;
}

export interface SearchHit {
  id: string;
  kind: "topic" | "project" | "resource" | "page";
  title: string;
  subtitle: string;
  breadcrumb: string;
  to: string;
  /** For topics: opens the drawer straight away. */
  nodeId?: string;
  projectId?: string;
  url?: string;
  score: number;
}
