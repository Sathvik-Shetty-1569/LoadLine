import type { Archetype } from './types';
import { lowerArchetypes } from './poses/lower';
import { pushArchetypes } from './poses/push';
import { pullArchetypes } from './poses/pull';
import { armsArchetypes } from './poses/arms';
import { coreArchetypes } from './poses/core';
import { warmupArchetypes } from './poses/warmups';

export const archetypes: Archetype[] = [
  ...lowerArchetypes,
  ...pushArchetypes,
  ...pullArchetypes,
  ...armsArchetypes,
  ...coreArchetypes,
  ...warmupArchetypes,
];

export const archetypeById: Record<string, Archetype> = Object.fromEntries(
  archetypes.map((a) => [a.id, a]),
);

export function getArchetype(id: string): Archetype | null {
  return archetypeById[id] ?? null;
}
