import { getArchetype } from './archetypes';
import type { Archetype } from './types';

function normalise(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ') // drop parenthetical equipment notes
    .replace(/[^a-z0-9\s/+-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Ordered, first match wins. Order is load-bearing: more specific phrases must come before the
// general word they contain (e.g. "seated calf" before "calf", "incline press" before "press").
const RULES: Array<[RegExp, string]> = [
  // Lower body - split squat/lunge must beat the bare "squat" it contains
  [/single-?leg.*rdl|single-?leg.*deadlift|single-?leg.*hinge/, 'single-leg-hinge'],
  [/split squat|walking lunge|\blunge/, 'lunge'],
  [/\bgoblet squat|\bsquat/, 'squat'],
  [/romanian deadlift|\brdl\b|deadlift|hip hinge/, 'hinge'],
  [/seated calf/, 'calf-raise-seated'],
  [/calf raise|calf hop/, 'calf-raise-standing'],
  [/glute bridge/, 'glute-bridge'],
  [/donkey kick|fire hydrant/, 'donkey-kick'],
  [/leg raise/, 'leg-raise'],
  [/hip flexor stretch/, 'hip-flexor-stretch'],
  [/hamstring stretch/, 'hamstring-stretch'],
  [/quad stretch/, 'quad-stretch'],
  [/calf wall stretch|calf stretch/, 'calf-wall-stretch'],

  // Push
  [/close-?grip push-?up|push-?up/, 'push-up'],
  [/incline.*press|incline.*floor press/, 'incline-press'],
  [/squeeze press/, 'squeeze-press'],
  [/floor fly|\bfly\b/, 'floor-fly'],
  [/shoulder press|overhead press/, 'overhead-press'],
  [/lateral raise/, 'lateral-raise'],
  [/overhead triceps extension|triceps extension/, 'triceps-extension'],
  [/triceps stretch/, 'triceps-stretch'],

  // Pull - grip/carry and scapular variants must beat the bare "pull-up" they contain
  [/\brow\b/, 'row'],
  [/farmer.?s?\s*carry/, 'farmers-carry'],
  [/dead hang/, 'dead-hang'],
  [/scapular pull/, 'scapular-pull'],
  [/pull-?up|chin-?up/, 'pull-up'],
  [/reverse fly/, 'reverse-fly'],
  [/lat stretch|doorway.*lat|lat.*doorway/, 'lat-stretch-doorway'],
  [/chest doorway/, 'chest-doorway-stretch'],
  [/biceps.*doorway|doorway.*biceps/, 'biceps-stretch'],
  [/cross-body shoulder/, 'cross-body-shoulder-stretch'],

  // Arms / forearm - wrist curl must beat the bare "curl" it contains
  [/incline.*curl/, 'incline-curl'],
  [/wrist curl/, 'wrist-curl'],
  [/hammer curl|\bcurl\b/, 'curl'],
  [/pronation|supination|twist/, 'wrist-twist'],
  [/wrist circle|finger extension/, 'wrist-circle'],
  [/wrist flexor/, 'wrist-flexor-stretch'],
  [/wrist extensor/, 'wrist-extensor-stretch'],

  // Core / back
  [/child.?s?\s*pose/, 'childs-pose'],
  [/\bplank\b/, 'plank'],
  [/superman/, 'superman'],
  [/forward fold/, 'forward-fold'],
  [/figure-?4/, 'figure-4-stretch'],
  [/thoracic extension/, 'thoracic-extension'],

  // Warm-ups
  [/arm circle/, 'arm-circle'],
  [/leg swing/, 'leg-swing'],
  [/ankle rock/, 'ankle-rock'],
  [/inchworm/, 'inchworm'],
];

/** Resolves any free-typed exercise name to an archetype, or null if nothing matches - callers
 * should treat null as "show the empty state, offer the picker", never guess further. */
export function resolveArchetype(name: string): Archetype | null {
  const n = normalise(name);
  for (const [pattern, id] of RULES) {
    if (pattern.test(n)) return getArchetype(id);
  }
  return null;
}

export function resolveArchetypeId(name: string): string | null {
  return resolveArchetype(name)?.id ?? null;
}
