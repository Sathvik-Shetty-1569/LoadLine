import type { Step } from '../data/types';

/** Cumulative planned offset (seconds) at the start of each step, using each step's *nominal*
 * duration - for 'work'/'maxtime' steps that's the block's `estWorkSec` schedule estimate, not an
 * enforced length (those steps still end on a manual tap, so real elapsed time can land above or
 * below it). Drift is only meaningful once real elapsed time is compared against this. */
export function scheduledOffsets(steps: Step[]): number[] {
  const offsets: number[] = [];
  let cursor = 0;
  for (const s of steps) {
    offsets.push(cursor);
    cursor += s.durationSec;
  }
  return offsets;
}

export interface DriftInfo {
  /** Positive = behind schedule (taking longer than planned), negative = ahead. */
  driftSec: number;
  isBehind: boolean;
}

export function computeDrift(scheduledElapsedSec: number, actualElapsedSec: number): DriftInfo {
  const driftSec = actualElapsedSec - scheduledElapsedSec;
  return { driftSec, isBehind: driftSec > 0 };
}

export function formatDrift(driftSec: number): string {
  const sign = driftSec > 0 ? '+' : driftSec < 0 ? '−' : '';
  const abs = Math.abs(Math.round(driftSec));
  const m = Math.floor(abs / 60);
  const s = abs % 60;
  return `${sign}${m}:${String(s).padStart(2, '0')}`;
}

/** Behind by more than this, with isolation rest still ahead, triggers the catch-up offer. */
export const CATCHUP_THRESHOLD_SEC = 120;
export const TRIMMED_ISOLATION_REST_SEC = 45;
export const STANDARD_ISOLATION_REST_SEC = 60;
