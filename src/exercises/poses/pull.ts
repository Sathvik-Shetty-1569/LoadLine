import type { Archetype } from '../types';
import { STANDING, HANGING, pose } from '../types';

export const pullArchetypes: Archetype[] = [
  {
    id: 'row', label: 'Single-arm row', equipment: 'dumbbell', prop: 'chair',
    poses: [
      pose(STANDING, {
        head: [58, 40], neck: [55, 44], shoulderL: [52, 46], shoulderR: [58, 46],
        elbowL: [50, 58], elbowR: [64, 54], handL: [48, 70], handR: [64, 66],
        hip: [46, 54], kneeL: [45, 74], kneeR: [51, 74], footL: [46, 94], footR: [54, 94],
      }),
      pose(STANDING, {
        head: [58, 40], neck: [55, 44], shoulderL: [52, 46], shoulderR: [58, 46],
        elbowL: [50, 58], elbowR: [63, 48], handL: [48, 70], handR: [58, 50],
        hip: [46, 54], kneeL: [45, 74], kneeR: [51, 74], footL: [46, 94], footR: [54, 94],
      }),
    ],
    cycleSec: 1.1,
  },
  {
    id: 'pull-up', label: 'Pull-up / chin-up', prop: 'bar',
    poses: [
      HANGING,
      pose(HANGING, {
        head: [50, 14], neck: [50, 22], shoulderL: [46, 25], shoulderR: [54, 25],
        elbowL: [42, 21], elbowR: [58, 21], hip: [50, 55], kneeL: [48, 70], kneeR: [53, 70],
        footL: [47, 84], footR: [54, 84],
      }),
    ],
    cycleSec: 1.2,
  },
  {
    id: 'farmers-carry', label: "Farmer's carry hold", equipment: 'dumbbells',
    poses: [
      pose(STANDING, { handL: [43, 62], handR: [56, 62], elbowL: [44, 48], elbowR: [55, 48] }),
      pose(STANDING, {
        handL: [43, 62], handR: [56, 62], elbowL: [44, 48], elbowR: [55, 48],
        kneeL: [44, 74], kneeR: [56, 74], footL: [40, 94], footR: [60, 94],
      }),
    ],
    cycleSec: 1.4,
  },
  {
    id: 'dead-hang', label: 'Dead hang', prop: 'bar',
    poses: [HANGING, pose(HANGING, { hip: [51, 65], kneeL: [49, 79], kneeR: [54, 79], footL: [48, 92], footR: [55, 92] })],
    cycleSec: 2.4,
  },
  {
    id: 'scapular-pull', label: 'Scapular pull / shrug on the bar', prop: 'bar',
    poses: [HANGING, pose(HANGING, { shoulderL: [46, 37], shoulderR: [54, 37], neck: [50, 34] })],
    cycleSec: 1.3,
  },
  {
    id: 'reverse-fly', label: 'Bent-over reverse fly', equipment: 'dumbbells',
    poses: [
      pose(STANDING, {
        head: [58, 38], neck: [55, 42], shoulderL: [52, 44], shoulderR: [58, 44],
        elbowL: [51, 56], elbowR: [57, 56], handL: [50, 68], handR: [56, 68],
        hip: [46, 52], kneeL: [45, 74], kneeR: [51, 74], footL: [46, 94], footR: [54, 94],
      }),
      pose(STANDING, {
        head: [58, 38], neck: [55, 42], shoulderL: [52, 44], shoulderR: [58, 44],
        elbowL: [40, 44], elbowR: [70, 44], handL: [32, 46], handR: [78, 46],
        hip: [46, 52], kneeL: [45, 74], kneeR: [51, 74], footL: [46, 94], footR: [54, 94],
      }),
    ],
    cycleSec: 1.1,
  },
  {
    id: 'lat-stretch-doorway', label: 'Lat stretch (overhead on a doorframe)', prop: 'doorframe',
    poses: [
      pose(STANDING, { elbowL: [42, 18], elbowR: [58, 18], handL: [40, 6], handR: [60, 6] }),
      pose(STANDING, {
        elbowL: [42, 18], elbowR: [58, 18], handL: [40, 6], handR: [60, 6],
        hip: [49, 60], kneeL: [46, 76], kneeR: [53, 76],
      }),
    ],
    cycleSec: 2.2,
  },
  {
    id: 'chest-doorway-stretch', label: 'Chest doorway stretch', prop: 'doorframe',
    poses: [
      pose(STANDING, { elbowR: [64, 40], handR: [64, 28] }),
      pose(STANDING, { elbowR: [64, 40], handR: [64, 28], hip: [52, 55], shoulderR: [58, 32] }),
    ],
    cycleSec: 2.2,
  },
  {
    id: 'biceps-stretch', label: 'Biceps doorway stretch', prop: 'doorframe',
    poses: [
      pose(STANDING, { elbowR: [64, 46], handR: [66, 46] }),
      pose(STANDING, { elbowR: [64, 46], handR: [66, 46], shoulderR: [56, 30], hip: [46, 55] }),
    ],
    cycleSec: 2.2,
  },
  {
    id: 'cross-body-shoulder-stretch', label: 'Cross-body shoulder stretch',
    poses: [
      pose(STANDING, { elbowR: [38, 40], handR: [30, 40] }),
      pose(STANDING, { elbowR: [36, 42], handR: [26, 42], shoulderR: [50, 28] }),
    ],
    cycleSec: 2.2,
  },
];
