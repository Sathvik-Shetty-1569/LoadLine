import type { Block, PullupTier, HoldBlock, Step, StepKind } from '../data/types';
import { tierPlan } from './tierPlan';

/**
 * Step kinds that auto-advance on a countdown. Everything else ('work', 'maxtime') waits for a
 * manual tap - the program's 0-2 RIR / true-failure rule means a set's real length can never be
 * enforced by a timer. This is the single source of truth for that split: Session.tsx drives off
 * it, and program.test.ts asserts 'work'/'maxtime' can never be added to it.
 */
export const AUTO_KINDS: StepKind[] = ['timed', 'hold', 'switch', 'rest'];

let seq = 0;
function nextId(): string {
  seq += 1;
  return `step-${seq}`;
}

/** The exercise-info fields that ride along from a block (or a superset sub-exercise) onto every
 * one of its non-rest steps, so the Session screen can show them per set. */
function infoOf(src: { videoUrl?: string; tags?: string[]; focus?: string }): Pick<Step, 'videoUrl' | 'tags' | 'focus'> {
  return { videoUrl: src.videoUrl, tags: src.tags, focus: src.focus };
}

export function compileSession(blocks: Block[], tier: PullupTier): Step[] {
  const out: Step[] = [];

  for (const block of blocks) {
    switch (block.mode) {
      case 'timed': {
        for (const s of block.steps) {
          out.push({
            id: nextId(), blockId: block.id, blockName: block.name, phase: block.phase, kind: 'timed',
            label: block.name, detail: s.label, notes: block.notes, durationSec: s.durationSec,
            figure: block.figure, ...infoOf(block),
          });
        }
        break;
      }

      case 'reps': {
        for (let i = 1; i <= block.sets; i += 1) {
          const isLast = i === block.sets;
          out.push({
            id: nextId(), blockId: block.id, blockName: block.name, phase: block.phase, kind: 'work',
            label: block.name, detail: `Set ${i} of ${block.sets}`, notes: block.notes, image: block.image,
            figure: block.figure, prescription: block.prescription, durationSec: block.estWorkSec,
            isLastSet: isLast, toFailure: isLast && !!block.toFailureLastSet, ...infoOf(block),
          });
          out.push({
            id: nextId(), blockId: block.id, blockName: block.name, phase: block.phase, kind: 'rest',
            label: 'Rest', durationSec: block.restSec, restKind: block.restKind,
          });
        }
        break;
      }

      case 'unilateral': {
        for (let i = 1; i <= block.sets; i += 1) {
          const isLast = i === block.sets;
          out.push({
            id: nextId(), blockId: block.id, blockName: block.name, phase: block.phase, kind: 'work',
            label: block.name, detail: `Set ${i} of ${block.sets} - Left`, notes: block.notes,
            image: block.image, figure: block.figure, prescription: block.prescription,
            durationSec: block.estWorkSec, ...infoOf(block),
          });
          out.push({
            id: nextId(), blockId: block.id, blockName: block.name, phase: block.phase, kind: 'work',
            label: block.name, detail: `Set ${i} of ${block.sets} - Right`, notes: block.notes,
            image: block.image, figure: block.figure, prescription: block.prescription,
            durationSec: block.estWorkSec, isLastSet: isLast, toFailure: isLast && !!block.toFailureLastSet,
            ...infoOf(block),
          });
          out.push({
            id: nextId(), blockId: block.id, blockName: block.name, phase: block.phase, kind: 'rest',
            label: 'Rest (both sides done)', durationSec: block.restSec, restKind: block.restKind,
          });
        }
        break;
      }

      case 'hold': {
        const h = block as HoldBlock;
        for (let i = 1; i <= h.sets; i += 1) {
          out.push({
            id: nextId(), blockId: h.id, blockName: h.name, phase: h.phase, kind: 'hold',
            label: h.name, detail: `Set ${i} of ${h.sets}`, notes: h.notes, image: h.image,
            figure: h.figure, prescription: h.prescription, durationSec: h.holdSec, ...infoOf(h),
          });
          out.push({
            id: nextId(), blockId: h.id, blockName: h.name, phase: h.phase, kind: 'rest',
            label: 'Rest', durationSec: h.restSec, restKind: h.restKind,
          });
        }
        break;
      }

      case 'maxtime': {
        for (let i = 1; i <= block.sets; i += 1) {
          out.push({
            id: nextId(), blockId: block.id, blockName: block.name, phase: block.phase, kind: 'maxtime',
            label: block.name, detail: `Set ${i} of ${block.sets}`, notes: block.notes, image: block.image,
            figure: block.figure, prescription: block.prescription, durationSec: block.estWorkSec,
            ...infoOf(block),
          });
          out.push({
            id: nextId(), blockId: block.id, blockName: block.name, phase: block.phase, kind: 'rest',
            label: 'Rest', durationSec: block.restSec, restKind: block.restKind,
          });
        }
        break;
      }

      case 'superset': {
        for (let r = 1; r <= block.rounds; r += 1) {
          const isLastRound = r === block.rounds;
          const pair: Array<['A' | 'B', typeof block.exerciseA]> = [
            ['A', block.exerciseA],
            ['B', block.exerciseB],
          ];
          for (const [tag, ex] of pair) {
            out.push({
              id: nextId(), blockId: block.id, blockName: block.name, phase: block.phase,
              kind: ex.kind === 'hold' ? 'hold' : 'work',
              label: ex.name, detail: `Round ${r} of ${block.rounds}${ex.amrap ? ' - AMRAP' : ''}`,
              notes: ex.notes, image: ex.image, figure: ex.figure, prescription: ex.prescription,
              durationSec: ex.kind === 'hold' ? (ex.holdSec ?? 0) : (ex.estWorkSec ?? 0),
              isLastSet: isLastRound, toFailure: isLastRound && !!ex.amrap, ...infoOf(ex),
            });
            if (tag === 'A') {
              out.push({
                id: nextId(), blockId: block.id, blockName: block.name, phase: block.phase, kind: 'switch',
                label: 'Switch exercise', durationSec: block.switchSec,
              });
            }
          }
          out.push({
            id: nextId(), blockId: block.id, blockName: block.name, phase: block.phase, kind: 'rest',
            label: 'Rest (after the pair)', durationSec: block.restSec, restKind: block.restKind,
          });
        }
        break;
      }

      case 'tiered': {
        const plans = tierPlan(tier, block.barExercise);
        for (const plan of plans) {
          for (let i = 1; i <= plan.sets; i += 1) {
            const isLast = i === plan.sets;
            out.push({
              id: nextId(), blockId: block.id, blockName: plan.label, phase: block.phase,
              kind: plan.holdSec !== undefined ? 'hold' : 'work',
              label: plan.label, detail: `Set ${i} of ${plan.sets}`, notes: block.notes,
              prescription: plan.prescription, durationSec: plan.holdSec ?? plan.estWorkSec ?? 0, isLastSet: isLast,
              ...infoOf(block),
            });
            out.push({
              id: nextId(), blockId: block.id, blockName: plan.label, phase: block.phase, kind: 'rest',
              label: 'Rest', durationSec: plan.restSec, restKind: 'compound',
            });
          }
        }
        break;
      }

      default: {
        const _exhaustive: never = block;
        throw new Error(`Unhandled block mode: ${JSON.stringify(_exhaustive)}`);
      }
    }
  }

  return out;
}

/** Sum of every step's planned duration, in seconds - the session's schedule target. For
 * 'work'/'maxtime' steps this is the schedule *estimate* (`estWorkSec`), not an enforced length:
 * those steps still end on a manual tap, so real elapsed time can land above or below this total. */
export function timedFloorSec(steps: Step[]): number {
  return steps.reduce((sum, s) => sum + s.durationSec, 0);
}
