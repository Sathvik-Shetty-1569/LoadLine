import type { PullupTier } from '../data/types';
import type { SessionLogEntry } from './storage';
import { tierPlan } from './tierPlan';

export interface SetLogRecord {
  exerciseId: string; // Step.blockId
  exerciseName: string;
  setIndex: number; // 1-based
  reps?: number;
  weightKg?: number;
}

/** One set/step the user explicitly skipped ("Skip - not done"), i.e. did not perform. */
export interface SkipRecord {
  exerciseId: string; // Step.blockId
  exerciseName: string;
  /** The step's sub-label, e.g. "Set 2 of 4", "Left side". */
  detail?: string;
}

/** Most recent logged reps/weight for one exercise+set, used to prefill the next session's inputs.
 * `history` is newest-first (see storage.ts:logSession), so the first match wins. */
export function getLastSetValues(
  history: SessionLogEntry[],
  exerciseId: string,
  setIndex: number,
): { reps?: number; weightKg?: number } | null {
  for (const entry of history) {
    const match = entry.sets?.find((s) => s.exerciseId === exerciseId && s.setIndex === setIndex);
    if (match) return { reps: match.reps, weightKg: match.weightKg };
  }
  return null;
}

function parseRepRangeTop(prescription: string): number | null {
  const m = prescription.match(/(\d+)\s*-\s*(\d+)/);
  return m ? Number(m[2]) : null;
}

export interface TierUpgradeSuggestion {
  toTier: PullupTier;
  repTarget: number;
}

/**
 * The program's own rule: "move up a tier once you complete all sets at the top of the rep range
 * for two sessions in a row." Only fires for tiers whose stage has an actual numeric rep range to
 * hit (currently Tier 3 -> 4) - Tier 1's negatives are a fixed rep count and Tier 2 trains to
 * failure with no upper bound, so there's no range to detect automatically. Moving off those is
 * an ability judgment call the user makes in Settings, not something set-logging can infer.
 */
export function suggestTierUpgrade(
  history: SessionLogEntry[],
  currentTier: PullupTier,
  blockId: string,
  barExercise: 'pullup' | 'chinup',
): TierUpgradeSuggestion | null {
  if (currentTier >= 4) return null;
  const repStage = tierPlan(currentTier, barExercise).find((s) => s.estWorkSec !== undefined);
  if (!repStage) return null;
  const top = parseRepRangeTop(repStage.prescription);
  if (top === null) return null;

  const relevant = history.filter((h) => h.sets?.some((s) => s.exerciseId === blockId)).slice(0, 2);
  if (relevant.length < 2) return null;

  const allHitTop = relevant.every((h) =>
    h.sets!.filter((s) => s.exerciseId === blockId && s.reps !== undefined).every((s) => (s.reps ?? 0) >= top),
  );
  return allHitTop ? { toTier: (currentTier + 1) as PullupTier, repTarget: top } : null;
}
