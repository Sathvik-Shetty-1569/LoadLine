import type { Step } from '../data/types';

export interface ExerciseTime {
  blockId: string;
  name: string;
  sec: number;
}

/**
 * Wall-clock time actually spent on each exercise, "first set start -> last set end".
 *
 * `elapsedMs[i]` is the real time the user spent on `steps[i]` (Session.tsx measures this per
 * step, pauses excluded). Steps of one block are contiguous in the compiled list, so we walk them
 * in order, group by `blockId`, and sum - keeping the rests *between* sets (they're part of the
 * exercise) but dropping the block's trailing rest, which is really the gap before the next
 * exercise. A block with no measured time at all (e.g. every set skipped) is left out.
 */
export function exerciseTotals(steps: Step[], elapsedMs: number[]): ExerciseTime[] {
  const out: ExerciseTime[] = [];
  let i = 0;
  while (i < steps.length) {
    const blockId = steps[i].blockId;
    let end = i;
    while (end + 1 < steps.length && steps[end + 1].blockId === blockId) end += 1;

    // Trim trailing rest step(s) - the wind-down before the next exercise, not part of this one.
    let last = end;
    while (last > i && steps[last].kind === 'rest') last -= 1;

    let ms = 0;
    for (let j = i; j <= last; j += 1) ms += elapsedMs[j] ?? 0;

    const sec = Math.round(ms / 1000);
    if (sec > 0) {
      out.push({ blockId, name: steps[i].blockName, sec });
    }
    i = end + 1;
  }
  return out;
}
