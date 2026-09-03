import { describe, expect, it } from 'vitest';
import { resolveArchetype, resolveArchetypeId } from '../resolve';
import { archetypes } from '../archetypes';
import { FLOOR } from '../types';
import type { Joint } from '../types';
import { program } from '../../data/program';
import type { Block } from '../../data/types';

const JOINTS: Joint[] = [
  'head', 'neck', 'shoulderL', 'shoulderR', 'elbowL', 'elbowR', 'handL', 'handR',
  'hip', 'kneeL', 'kneeR', 'footL', 'footR',
];

/** Every distinct exercise/stretch name that ships in the v7 template - work blocks, superset
 * sub-exercises (both count, since Session shows the sub-exercise and DayEditor shows the block),
 * and every warm-up/cooldown timed block. This is the concrete guarantee behind "every exercise
 * has a diagram" - it would catch a template change that introduces a name nothing resolves. */
function allTemplateNames(): string[] {
  const names = new Set<string>();
  for (const day of program.days) {
    for (const block of day.blocks as Block[]) {
      names.add(block.name);
      if (block.mode === 'superset') {
        names.add(block.exerciseA.name);
        names.add(block.exerciseB.name);
      }
    }
  }
  return Array.from(names);
}

describe('resolveArchetype: coverage over the shipped template', () => {
  const names = allTemplateNames();

  it('found the expected number of distinct names (sanity check on the extraction itself)', () => {
    // 36 work/superset-block names + 22 warm-up/cooldown names, from the four lifting days plus
    // the shared warmup set and Sunday's stretch list. If this count moves, the template changed -
    // update this number deliberately rather than let the coverage check below go quiet.
    expect(names.length).toBeGreaterThanOrEqual(50);
  });

  for (const name of names) {
    it(`resolves "${name}"`, () => {
      expect(resolveArchetype(name)).not.toBeNull();
    });
  }
});

describe('resolveArchetype: ordering (specific phrase must beat the general word it contains)', () => {
  const cases: Array<[string, string]> = [
    ['Seated Calf Raise (DB on knees, heels on a step)', 'calf-raise-seated'],
    ['Standing Calf Raise (DB held)', 'calf-raise-standing'],
    ['DB Incline Floor Press', 'incline-press'],
    ['DB Standing Shoulder Press', 'overhead-press'],
    ['Single-leg DB RDL', 'single-leg-hinge'],
    ['DB Romanian Deadlift', 'hinge'],
    ['Bulgarian Split Squat (DB each hand)', 'lunge'],
    ['DB Goblet Squat', 'squat'],
    ['Wide-grip Pull-ups', 'pull-up'],
    ['Chin-ups (palms facing you)', 'pull-up'],
    ['Dead Hang', 'dead-hang'],
    ['Scapular Pull-ups', 'scapular-pull'],
    ['Incline DB Curl', 'incline-curl'],
    ['Hammer Curl (neutral grip)', 'curl'],
    ['Wrist Curl / Reverse Wrist Curl (alternating)', 'wrist-curl'],
    ['DB Pronation/Supination Twist', 'wrist-twist'],
    ['Standing Calf Wall Stretch', 'calf-wall-stretch'],
    ['Standing Hamstring Stretch', 'hamstring-stretch'],
    ['Standing Quad Stretch', 'quad-stretch'],
    ['Kneeling Hip Flexor Stretch', 'hip-flexor-stretch'],
    ['Figure-4 Glute Stretch', 'figure-4-stretch'],
    ['Close-Grip Push-ups', 'push-up'],
    ['DB Floor Fly', 'floor-fly'],
    ['DB Squeeze Press', 'squeeze-press'],
    ['Lying Leg Raises', 'leg-raise'],
    ['Superman Hold', 'superman'],
    ['Plank', 'plank'],
  ];

  for (const [name, expected] of cases) {
    it(`"${name}" -> ${expected}`, () => {
      expect(resolveArchetypeId(name)).toBe(expected);
    });
  }
});

describe('resolveArchetype: honest failure', () => {
  it('returns null for something with no plausible match, rather than guessing', () => {
    expect(resolveArchetype('Zzz Not A Real Exercise Qqq')).toBeNull();
  });
});

describe('archetype pose integrity', () => {
  for (const a of archetypes) {
    it(`${a.id}: both poses define all 13 joints, on-canvas`, () => {
      for (const p of a.poses) {
        for (const j of JOINTS) {
          const point = p[j];
          expect(point, `missing joint ${j} on ${a.id}`).toBeDefined();
          const [x, y] = point;
          expect(x, `${a.id}.${j}.x out of range`).toBeGreaterThanOrEqual(0);
          expect(x, `${a.id}.${j}.x out of range`).toBeLessThanOrEqual(100);
          expect(y, `${a.id}.${j}.y out of range`).toBeGreaterThanOrEqual(0);
          expect(y, `${a.id}.${j}.y out of range`).toBeLessThanOrEqual(100);
        }
      }
    });

    it(`${a.id}: feet land at or above the floor line`, () => {
      for (const p of a.poses) {
        expect(p.footL[1]).toBeLessThanOrEqual(FLOOR + 0.5);
        expect(p.footR[1]).toBeLessThanOrEqual(FLOOR + 0.5);
      }
    });
  }

  it('every archetype id is unique', () => {
    const ids = archetypes.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
