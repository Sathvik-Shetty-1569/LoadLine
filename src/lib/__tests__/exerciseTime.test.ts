import { describe, expect, it } from 'vitest';
import { exerciseTotals } from '../exerciseTime';
import type { Step, StepKind } from '../../data/types';

let seq = 0;
function mk(blockId: string, blockName: string, kind: StepKind): Step {
  seq += 1;
  return {
    id: `s-${seq}`, blockId, blockName, phase: 'work', kind,
    label: blockName, durationSec: 30,
  };
}

describe('exerciseTotals', () => {
  it('groups by block, keeps between-set rests, drops the trailing rest', () => {
    const steps = [
      mk('a', 'A', 'work'), mk('a', 'A', 'rest'), mk('a', 'A', 'work'), mk('a', 'A', 'rest'),
      mk('b', 'B', 'work'), mk('b', 'B', 'rest'),
    ];
    //            work   rest   work    rest(trailing)  work   rest(trailing)
    const ms = [10_000, 5_000, 12_000, 60_000, 8_000, 3_000];

    expect(exerciseTotals(steps, ms)).toEqual([
      { blockId: 'a', name: 'A', sec: 27 }, // 10 + 5 (interior rest) + 12, trailing 60s rest dropped
      { blockId: 'b', name: 'B', sec: 8 },  // trailing 3s rest dropped
    ]);
  });

  it('omits an exercise that was entirely skipped (zero measured time)', () => {
    const steps = [
      mk('a', 'A', 'work'), mk('a', 'A', 'rest'),
      mk('b', 'B', 'work'), mk('b', 'B', 'rest'),
    ];
    const ms = [0, 0, 9_000, 40_000];

    expect(exerciseTotals(steps, ms)).toEqual([{ blockId: 'b', name: 'B', sec: 9 }]);
  });

  it('handles a timed block with no rest step at all', () => {
    const steps = [mk('w', 'Warmup', 'timed'), mk('w', 'Warmup', 'timed')];
    expect(exerciseTotals(steps, [20_000, 25_000])).toEqual([{ blockId: 'w', name: 'Warmup', sec: 45 }]);
  });

  it('treats a missing elapsed entry as zero', () => {
    const steps = [mk('a', 'A', 'work'), mk('a', 'A', 'work')];
    expect(exerciseTotals(steps, [11_000])).toEqual([{ blockId: 'a', name: 'A', sec: 11 }]);
  });
});
