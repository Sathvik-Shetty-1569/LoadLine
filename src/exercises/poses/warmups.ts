import type { Archetype } from '../types';
import { STANDING, PLANK, pose } from '../types';

export const warmupArchetypes: Archetype[] = [
  {
    id: 'arm-circle', label: 'Arm circles',
    poses: [
      pose(STANDING, { elbowL: [32, 30], elbowR: [67, 30], handL: [24, 32], handR: [76, 32] }),
      pose(STANDING, { elbowL: [32, 26], elbowR: [67, 26], handL: [26, 16], handR: [74, 16] }),
    ],
    cycleSec: 1.0,
  },
  {
    id: 'leg-swing', label: 'Walking leg swings',
    poses: [
      pose(STANDING, { kneeR: [58, 72], footR: [64, 88] }),
      pose(STANDING, { kneeR: [42, 68], footR: [34, 78] }),
    ],
    cycleSec: 1.0,
  },
  {
    id: 'ankle-rock', label: 'Ankle rocks',
    poses: [
      pose(STANDING, { footL: [44, 91], footR: [56, 91] }),
      pose(STANDING, { footL: [42, 94], footR: [58, 94] }),
    ],
    cycleSec: 0.9,
  },
  {
    id: 'inchworm', label: 'Inchworm to push-up position',
    poses: [
      pose(STANDING, {
        head: [48, 46], neck: [49, 52], shoulderL: [44, 54], shoulderR: [50, 56],
        elbowL: [40, 68], elbowR: [46, 70], handL: [38, 84], handR: [44, 86],
        hip: [56, 60], kneeL: [58, 76], kneeR: [62, 78], footL: [60, 94], footR: [66, 94],
      }),
      PLANK,
    ],
    cycleSec: 1.6,
  },
];
