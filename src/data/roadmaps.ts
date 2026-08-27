import type { Roadmap, RoadmapId, RoadmapNode } from "./types";
import frontend from "./frontend";
import backend from "./backend";
import python from "./python";

export const roadmaps: Roadmap[] = [frontend, backend, python];

export const roadmapById = new Map<RoadmapId, Roadmap>(
  roadmaps.map((r) => [r.id, r]),
);

/** Every node across every roadmap, keyed by id. Node ids are globally unique. */
export const nodeIndex = new Map<string, { node: RoadmapNode; roadmap: Roadmap }>();
for (const roadmap of roadmaps) {
  for (const node of roadmap.nodes) {
    nodeIndex.set(node.id, { node, roadmap });
  }
}

export const allNodes: RoadmapNode[] = roadmaps.flatMap((r) => r.nodes);

export const totalTopics = allNodes.length;

export function nodeById(id: string): RoadmapNode | undefined {
  return nodeIndex.get(id)?.node;
}

export function roadmapForNode(id: string): Roadmap | undefined {
  return nodeIndex.get(id)?.roadmap;
}

/** Nodes that list `id` as a prerequisite — i.e. what this unlocks. */
export function unlockedBy(id: string): RoadmapNode[] {
  return allNodes.filter((n) => n.prerequisites.includes(id));
}

export { frontend, backend, python };
