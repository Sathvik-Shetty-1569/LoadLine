import type { TimedBlock, BlockPhase, TimedSubStep } from './types';

/** Split a "30 sec/side" stretch into Left/Right timed steps. */
export function perSide(sec: number): TimedSubStep[] {
  return [
    { label: 'Left side', durationSec: sec },
    { label: 'Right side', durationSec: sec },
  ];
}

/** A stretch done twice with no side distinction, e.g. "2 x 30 sec". */
export function repeated(count: number, sec: number, label = 'Hold'): TimedSubStep[] {
  return Array.from({ length: count }, (_, i) => ({
    label: count > 1 ? `${label} ${i + 1} of ${count}` : label,
    durationSec: sec,
  }));
}

/** Single unsplit timed block, e.g. a warmup counted in reps but boxed by the clock. */
export function single(sec: number, label = 'Go'): TimedSubStep[] {
  return [{ label, durationSec: sec }];
}

let counter = 0;
export function timedBlock(
  phase: BlockPhase,
  name: string,
  sourceClockSec: [number, number],
  steps: TimedSubStep[],
  notes?: string,
): TimedBlock {
  counter += 1;
  return {
    id: `${phase}-${counter}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    phase,
    mode: 'timed',
    name,
    sourceClockSec,
    steps,
    notes,
  };
}

/** The 7 shared warmup blocks common to every lifting day, starting at t=0. */
export function sharedWarmup(): TimedBlock[] {
  return [
    timedBlock('warmup', 'Arm Circles', [0, 60], [
      { label: 'Forward', durationSec: 30 },
      { label: 'Backward', durationSec: 30 },
    ], 'Loosens shoulders'),
    timedBlock('warmup', 'Scapular Pulls on the Bar', [60, 120], single(60, '8-10 reps'),
      'Hang, pull shoulder blades down, no elbow bend'),
    timedBlock('warmup', 'Bodyweight Squats', [120, 180], single(60, '10-15 reps'),
      'General activation'),
    timedBlock('warmup', 'Walking Leg Swings', [180, 300], [
      { label: 'Front-to-back (both legs)', durationSec: 60 },
      { label: 'Side-to-side (both legs)', durationSec: 60 },
    ], 'Hip mobility'),
    timedBlock('warmup', 'Ankle Rocks', [300, 360], single(60, '15-20 reps'), 'Preps ankles'),
    timedBlock('warmup', 'Wrist Circles + Finger Extensions', [360, 420], single(60, '10 each direction'),
      'Preps wrists'),
    timedBlock('warmup', 'Inchworm to Push-up Position', [420, 480], single(60, '5-6 reps'),
      'Full-body: hamstrings, shoulders, core'),
  ];
}
