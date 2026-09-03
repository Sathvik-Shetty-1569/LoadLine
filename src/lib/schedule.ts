import type { Block, DayProgram, PullupTier } from '../data/types';
import { compileSession, timedFloorSec } from './compileSession';

/**
 * Schedule time for a single block, in seconds. Deliberately delegates to `compileSession` +
 * `timedFloorSec` instead of re-deriving each mode's arithmetic here: that keeps exactly one
 * place that knows how a block's duration is built, so a builder preview can never drift from
 * what a real session actually runs.
 */
export function blockDurationSec(block: Block, tier: PullupTier): number {
  return timedFloorSec(compileSession([block], tier));
}

/** Total schedule time for a day, in seconds - the sum of every block's `blockDurationSec`. */
export function dayScheduleSec(day: DayProgram, tier: PullupTier): number {
  return timedFloorSec(compileSession(day.blocks, tier));
}

/**
 * The target to display/compare against, in seconds. Uses the day's authored override when one
 * is set (for content that's intentionally approximate, e.g. Sunday's optional stretch); otherwise
 * the schedule derived from the blocks.
 */
export function dayTargetSec(day: DayProgram, tier: PullupTier): number {
  if (day.targetMinutesOverride != null) return day.targetMinutesOverride * 60;
  return dayScheduleSec(day, tier);
}

export function dayTargetMinutes(day: DayProgram, tier: PullupTier): number {
  return Math.round(dayTargetSec(day, tier) / 60);
}
