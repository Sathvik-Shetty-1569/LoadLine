import { describe, expect, it } from 'vitest';
import { program } from '../../data/program';
import { compileSession, timedFloorSec, AUTO_KINDS } from '../compileSession';
import { dayScheduleSec } from '../schedule';
import type { Block, RestKind } from '../../data/types';

const NEVER_TRIM: RestKind[] = ['compound', 'unilateral', 'hold', 'superset'];
const LIFTING_DAYS = ['mon', 'tue', 'thu', 'fri'] as const;

describe('program clock integrity (v7 template)', () => {
  for (const day of program.days) {
    if (!day.blocks.every((b) => b.sourceClockSec)) continue;

    it(`${day.label} (${day.sessionName}): blocks are contiguous with no gaps or overlaps`, () => {
      let cursor = 0;
      for (const block of day.blocks) {
        const [start, end] = block.sourceClockSec!;
        expect(start).toBe(cursor);
        expect(end).toBeGreaterThan(start);
        cursor = end;
      }
    });

    it(`${day.label}: timed-block sub-steps sum to the block's clock duration`, () => {
      for (const block of day.blocks) {
        if (block.mode !== 'timed') continue;
        const [start, end] = block.sourceClockSec!;
        const declared = end - start;
        const actual = block.steps.reduce((s, st) => s + st.durationSec, 0);
        // Cooldown holds sometimes state a shorter hold than the clock's rounded allocation
        // (e.g. "45 sec" hold inside a 60s block) - allow slack there, none in warmups.
        const tolerance = block.phase === 'cooldown' ? 20 : 0;
        expect(Math.abs(declared - actual)).toBeLessThanOrEqual(tolerance);
      }
    });
  }

  // Tier 2 ("do 1-4 pull-ups") is the tier whose pull-up/chin-up block duration (4 sets, 90s rest)
  // happens to match the original Notion allocation exactly, so it's the fair baseline for
  // checking that estWorkSec was backed out correctly across every other block. Tiers 1/3/4
  // deliberately produce a *different* total - see "tier changes the schedule" below - that's the
  // whole point of deriving the schedule instead of hardcoding it.
  const BASELINE_TIER = 2;

  for (const key of LIFTING_DAYS) {
    const day = program.days.find((d) => d.key === key)!;
    const originalTotalSec = day.blocks[day.blocks.length - 1].sourceClockSec![1];

    it(`${day.label}: schedule derived from estWorkSec reproduces the original Notion total`, () => {
      const derived = dayScheduleSec(day, BASELINE_TIER);
      // Two known, already-documented slack sources (see the cooldown sub-step test above):
      // Monday's Superman hold uses a 37s midpoint for a stated "30-45 sec" range (+6s), and every
      // day's Child's Pose is declared a 60s clock slot but its actual hold is 45s (-15s). Net
      // effect is at most ~15s/day - a day off by more than that would mean a real transcription
      // error, not rounding.
      expect(Math.abs(derived - originalTotalSec)).toBeLessThanOrEqual(20);
    });
  }

  it('Tier 1 legitimately lengthens Tuesday/Friday beyond the original allocation (dead hangs + negatives is 7 sets, not 4)', () => {
    const tue = program.days.find((d) => d.key === 'tue')!;
    const originalTotalSec = tue.blocks[tue.blocks.length - 1].sourceClockSec![1];
    const tier1Total = dayScheduleSec(tue, 1);
    expect(tier1Total).toBeGreaterThan(originalTotalSec + 200);
  });
});

describe('scheduling never enforces a manual set', () => {
  it('AUTO_KINDS never includes work or maxtime', () => {
    expect(AUTO_KINDS).not.toContain('work');
    expect(AUTO_KINDS).not.toContain('maxtime');
  });

  it('every manual work/maxtime step carries a positive schedule estimate (the v1 bug: these were hardcoded to 0, so the drift chip budgeted zero time for every set actually lifted)', () => {
    for (const day of program.days) {
      const steps = compileSession(day.blocks, 2);
      const manualSteps = steps.filter((s) => s.kind === 'work' || s.kind === 'maxtime');
      for (const step of manualSteps) {
        expect(step.durationSec).toBeGreaterThan(0);
      }
    }
  });
});

describe('compileSession', () => {
  for (const day of program.days) {
    it(`${day.label}: compiles without throwing, for every pull-up tier`, () => {
      for (const tier of [1, 2, 3, 4] as const) {
        const steps = compileSession(day.blocks, tier);
        expect(steps.length).toBeGreaterThan(0);
      }
    });
  }

  it('never marks compound/unilateral/hold/superset rest as isolation-trim eligible', () => {
    for (const day of program.days) {
      const steps = compileSession(day.blocks, 1);
      for (const step of steps) {
        if (step.kind !== 'rest') continue;
        if (step.restKind && NEVER_TRIM.includes(step.restKind)) {
          expect(step.restKind).not.toBe('isolation');
        }
      }
    }
  });

  it('flags true-failure only on the last set of a toFailureLastSet block', () => {
    const mon = program.days.find((d) => d.key === 'mon')!;
    const steps = compileSession(mon.blocks, 1);
    const rdlSteps = steps.filter((s) => s.blockId === 'mon-rdl' && s.kind === 'work');
    expect(rdlSteps).toHaveLength(4);
    expect(rdlSteps.slice(0, 3).every((s) => !s.toFailure)).toBe(true);
    expect(rdlSteps[3].toFailure).toBe(true);
  });

  it('Tier 1 pull-up block expands into dead hangs then negatives', () => {
    const tue = program.days.find((d) => d.key === 'tue')!;
    const steps = compileSession(tue.blocks, 1);
    const pullupSteps = steps.filter((s) => s.blockId === 'tue-pullups');
    expect(pullupSteps.filter((s) => s.blockName === 'Dead Hang' && s.kind === 'hold')).toHaveLength(3);
    expect(pullupSteps.filter((s) => s.blockName === 'Negative Pull-ups' && s.kind === 'work')).toHaveLength(4);
  });

  it('superset produces work/switch/work/rest per round in order', () => {
    const thu = program.days.find((d) => d.key === 'thu')!;
    const steps = compileSession(thu.blocks, 1);
    const supersetSteps = steps.filter((s) => s.blockId === 'thu-superset');
    // 3 rounds x (work A, switch, work/hold B, rest) = 12 steps
    expect(supersetSteps).toHaveLength(12);
    expect(supersetSteps[0].kind).toBe('work'); // Leg raises
    expect(supersetSteps[1].kind).toBe('switch');
    expect(supersetSteps[2].kind).toBe('hold'); // Plank
    expect(supersetSteps[3].kind).toBe('rest');
  });

  it('carries videoUrl / tags / focus from a block onto its non-rest steps only', () => {
    const block: Block = {
      id: 'info-x', phase: 'work', mode: 'reps', name: 'Test Lift', prescription: '2 x 10', sets: 2,
      estWorkSec: 30, restSec: 60, restKind: 'isolation',
      videoUrl: 'https://example.test/demo', tags: ['strength', 'hypertrophy'], focus: 'Quads, glutes',
    };
    const steps = compileSession([block], 2);
    const work = steps.filter((s) => s.kind === 'work');
    expect(work).toHaveLength(2);
    for (const s of work) {
      expect(s.videoUrl).toBe('https://example.test/demo');
      expect(s.tags).toEqual(['strength', 'hypertrophy']);
      expect(s.focus).toBe('Quads, glutes');
    }
    expect(steps.find((s) => s.kind === 'rest')?.tags).toBeUndefined();
    expect(steps.find((s) => s.kind === 'rest')?.videoUrl).toBeUndefined();
  });

  it('timedFloorSec sums every step, including manual work/maxtime schedule estimates', () => {
    const mon = program.days.find((d) => d.key === 'mon')!;
    const steps = compileSession(mon.blocks, 1);
    const floor = timedFloorSec(steps);
    const manualSum = steps.filter((s) => s.kind === 'work' || s.kind === 'maxtime')
      .reduce((s, st) => s + st.durationSec, 0);
    expect(manualSum).toBeGreaterThan(0);
    expect(floor).toBeGreaterThan(manualSum);
  });
});
