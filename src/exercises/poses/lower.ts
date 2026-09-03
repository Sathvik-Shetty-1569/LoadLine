import type { Archetype } from '../types';
import { STANDING, SUPINE, QUADRUPED, KNEELING, pose } from '../types';

export const lowerArchetypes: Archetype[] = [
  {
    id: 'squat', label: 'Squat', equipment: 'dumbbell',
    poses: [
      STANDING,
      pose(STANDING, {
        hip: [49, 68], kneeL: [42, 76], kneeR: [58, 76], footL: [40, 94], footR: [60, 94],
        shoulderL: [46, 34], shoulderR: [53, 34], elbowL: [46, 46], elbowR: [53, 46],
        handL: [49, 58], handR: [52, 58], head: [50, 21], neck: [50, 31],
      }),
    ],
    cycleSec: 1.1,
  },
  {
    id: 'hinge', label: 'Hip hinge (RDL / deadlift)', equipment: 'dumbbells',
    poses: [
      STANDING,
      pose(STANDING, {
        head: [58, 38], neck: [55, 42], shoulderL: [52, 44], shoulderR: [58, 44],
        elbowL: [51, 56], elbowR: [57, 56], handL: [50, 68], handR: [56, 68],
        hip: [46, 52], kneeL: [45, 74], kneeR: [51, 74], footL: [46, 94], footR: [54, 94],
      }),
    ],
    cycleSec: 1.2,
  },
  {
    id: 'single-leg-hinge', label: 'Single-leg RDL', equipment: 'dumbbells',
    poses: [
      STANDING,
      pose(STANDING, {
        head: [62, 38], neck: [58, 42], shoulderL: [55, 44], shoulderR: [61, 44],
        elbowL: [54, 56], elbowR: [60, 56], handL: [53, 68], handR: [59, 68],
        hip: [46, 52], kneeL: [46, 74], kneeR: [30, 60], footL: [46, 94], footR: [16, 58],
      }),
    ],
    cycleSec: 1.3,
  },
  {
    id: 'lunge', label: 'Lunge / split squat', equipment: 'dumbbells',
    poses: [
      pose(STANDING, { kneeL: [43, 74], kneeR: [56, 74], footL: [38, 94], footR: [62, 88] }),
      pose(STANDING, {
        hip: [49, 62], kneeL: [40, 74], kneeR: [63, 82], footL: [36, 94], footR: [70, 90],
        shoulderL: [46, 32], shoulderR: [53, 32], elbowL: [46, 44], elbowR: [53, 44],
        handL: [49, 56], handR: [52, 56], head: [50, 19], neck: [50, 29],
      }),
    ],
    cycleSec: 1.1,
  },
  {
    id: 'calf-raise-standing', label: 'Standing calf raise', equipment: 'dumbbell',
    poses: [
      STANDING,
      pose(STANDING, {
        head: [50, 12], neck: [50, 22], shoulderL: [46, 25], shoulderR: [53, 25],
        elbowL: [45, 38], elbowR: [52, 38], handL: [45, 51], handR: [52, 51],
        hip: [49, 51], kneeL: [47, 70], kneeR: [53, 70], footL: [47, 91], footR: [53, 91],
      }),
    ],
    cycleSec: 0.9,
  },
  {
    id: 'calf-raise-seated', label: 'Seated calf raise', equipment: 'dumbbell', prop: 'step',
    poses: [
      pose(STANDING, {
        head: [42, 30], neck: [43, 40], shoulderL: [40, 43], shoulderR: [46, 43],
        elbowL: [41, 55], elbowR: [47, 55], handL: [44, 65], handR: [50, 65],
        hip: [42, 68], kneeL: [64, 66], kneeR: [64, 70], footL: [70, 84], footR: [74, 84],
      }),
      pose(STANDING, {
        head: [42, 30], neck: [43, 40], shoulderL: [40, 43], shoulderR: [46, 43],
        elbowL: [41, 55], elbowR: [47, 55], handL: [44, 65], handR: [50, 65],
        hip: [42, 68], kneeL: [64, 66], kneeR: [64, 70], footL: [72, 80], footR: [76, 80],
      }),
    ],
    cycleSec: 0.9,
  },
  {
    id: 'glute-bridge', label: 'Glute bridge', equipment: 'dumbbell',
    poses: [
      pose(SUPINE, {}),
      pose(SUPINE, { hip: [56, 68], kneeL: [71, 78], kneeR: [71, 84] }),
    ],
    cycleSec: 1.0,
  },
  {
    id: 'donkey-kick', label: 'Donkey kick / fire hydrant',
    poses: [
      QUADRUPED,
      pose(QUADRUPED, { kneeR: [80, 60], footR: [92, 62], kneeL: [63, 76], footL: [70, 88] }),
    ],
    cycleSec: 0.9,
  },
  {
    id: 'leg-raise', label: 'Lying leg raise',
    poses: [
      pose(SUPINE, { kneeL: [71, 80], kneeR: [71, 86], footL: [86, 82], footR: [86, 87] }),
      pose(SUPINE, { kneeL: [58, 42], kneeR: [58, 48], footL: [58, 20], footR: [58, 26] }),
    ],
    cycleSec: 1.1,
  },
  {
    id: 'hip-flexor-stretch', label: 'Kneeling hip flexor stretch', prop: 'floor',
    poses: [KNEELING, pose(KNEELING, { hip: [52, 60], head: [53, 22], neck: [53, 32] })],
    cycleSec: 2.2,
  },
  {
    id: 'hamstring-stretch', label: 'Standing hamstring stretch', prop: 'step',
    poses: [
      pose(STANDING, { footR: [66, 70], kneeR: [64, 72], hip: [47, 56] }),
      pose(STANDING, {
        footR: [66, 70], kneeR: [64, 72], hip: [45, 60],
        head: [56, 48], neck: [52, 52], shoulderL: [46, 54], shoulderR: [50, 56],
        elbowL: [50, 62], elbowR: [54, 64], handL: [58, 68], handR: [61, 69],
      }),
    ],
    cycleSec: 2.2,
  },
  {
    id: 'quad-stretch', label: 'Standing quad stretch', prop: 'wall',
    poses: [STANDING, pose(STANDING, { kneeR: [58, 68], footR: [56, 52], handR: [56, 56], elbowR: [55, 47] })],
    cycleSec: 2.2,
  },
  {
    id: 'calf-wall-stretch', label: 'Standing calf wall stretch', prop: 'wall',
    poses: [
      pose(STANDING, {
        footR: [70, 94], kneeR: [66, 78], hip: [46, 58],
        shoulderL: [50, 34], shoulderR: [55, 32], elbowL: [56, 34], elbowR: [60, 30],
        handL: [64, 32], handR: [66, 28], head: [52, 22], neck: [51, 30],
      }),
      pose(STANDING, {
        footR: [70, 94], kneeR: [66, 76], hip: [44, 60],
        shoulderL: [50, 36], shoulderR: [55, 34], elbowL: [58, 34], elbowR: [62, 30],
        handL: [66, 32], handR: [68, 28], head: [53, 24], neck: [52, 32],
      }),
    ],
    cycleSec: 2.4,
  },
];
