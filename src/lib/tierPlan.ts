import type { PullupTier } from '../data/types';

export interface TierPlanStage {
  label: string;
  prescription: string;
  sets: number;
  restSec: number;
  /** Set when this stage is an auto-timed hold (Tier 1's dead hangs). */
  holdSec?: number;
  /** Estimated seconds for one rep-based set - schedule hint only, mirrors RepsBlock.estWorkSec.
   * Present whenever holdSec isn't. */
  estWorkSec?: number;
}

/** Resolves a pull-up/chin-up tiered block into its concrete stages. Shared by compileSession.ts
 * (runtime steps) and schedule.ts (time budget) so the two can never disagree. */
export function tierPlan(tier: PullupTier, barExercise: 'pullup' | 'chinup'): TierPlanStage[] {
  const barName = barExercise === 'pullup' ? 'Wide-grip Pull-ups' : 'Chin-ups';
  const negName = barExercise === 'pullup' ? 'Negative Pull-ups' : 'Negative Chin-ups';
  switch (tier) {
    case 1:
      return [
        { label: 'Dead Hang', prescription: '3 x 20-30 sec', sets: 3, restSec: 90, holdSec: 25 },
        { label: negName, prescription: '4 x 5 (jump to top, lower 4-5 sec)', sets: 4, restSec: 90, estWorkSec: 10 },
      ];
    case 2:
      return [{ label: barName, prescription: '4 sets to failure', sets: 4, restSec: 90, estWorkSec: 15 }];
    case 3:
      return [{ label: barName, prescription: '4 x 6-10, 2-sec pause at top', sets: 4, restSec: 90, estWorkSec: 20 }];
    case 4:
    default:
      return [{ label: barName, prescription: '4 x 8-12, 3-sec eccentric (or weighted)', sets: 4, restSec: 105, estWorkSec: 25 }];
  }
}
