/**
 * The arcane alphabet's vocabulary and the deterministic mapping from a
 * content id to a sigil. Kept out of the component so both the sigil renderer
 * and anything that needs to reason about symbols share one source.
 */

export type SigilName =
  | "fire"
  | "water"
  | "earth"
  | "air"
  | "arcane"
  | "celestial"
  | "void"
  | "nature"
  | "knowledge";

export const SIGIL_NAMES: SigilName[] = [
  "fire",
  "water",
  "earth",
  "air",
  "arcane",
  "celestial",
  "void",
  "nature",
  "knowledge",
];

/** FNV-1a. Small, fast, and stable across runs — the same node id must always
 * draw the same sigil, or the symbol layer would flicker between renders. */
export function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function sigilFor(seed: string): SigilName {
  return SIGIL_NAMES[hashString(seed) % SIGIL_NAMES.length];
}
