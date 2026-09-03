import type { Archetype } from '../types';
import { STANDING, SUPINE, PLANK, pose } from '../types';

export const pushArchetypes: Archetype[] = [
  {
    id: 'push-up', label: 'Push-up',
    poses: [
      PLANK,
      pose(PLANK, {
        head: [24, 68], neck: [32, 68], shoulderL: [36, 68], shoulderR: [36, 72],
        hip: [61, 74], kneeL: [76, 80], kneeR: [76, 82],
      }),
    ],
    cycleSec: 1.0,
  },
  {
    id: 'incline-press', label: 'Incline chest press', equipment: 'dumbbells', prop: 'floor',
    poses: [
      pose(SUPINE, {
        elbowL: [41, 60], elbowR: [41, 68], handL: [51, 56], handR: [51, 72],
      }),
      pose(SUPINE, { elbowL: [44, 74], elbowR: [44, 78], handL: [58, 76], handR: [58, 78] }),
    ],
    cycleSec: 1.0,
  },
  {
    id: 'squeeze-press', label: 'DB squeeze press', equipment: 'dumbbells', prop: 'floor',
    poses: [
      pose(SUPINE, { elbowL: [45, 76], elbowR: [45, 84], handL: [57, 79], handR: [57, 81] }),
      pose(SUPINE, { elbowL: [41, 62], elbowR: [41, 68], handL: [55, 63], handR: [55, 65] }),
    ],
    cycleSec: 1.1,
  },
  {
    id: 'floor-fly', label: 'DB floor fly', equipment: 'dumbbells', prop: 'floor',
    poses: [
      pose(SUPINE, { elbowL: [45, 62], elbowR: [45, 96], handL: [50, 58], handR: [50, 100] }),
      pose(SUPINE, { elbowL: [42, 74], elbowR: [42, 84], handL: [54, 76], handR: [54, 82] }),
    ],
    cycleSec: 1.2,
  },
  {
    id: 'overhead-press', label: 'Standing overhead press', equipment: 'dumbbells',
    poses: [
      pose(STANDING, { elbowL: [44, 40], elbowR: [51, 40], handL: [44, 52], handR: [51, 52] }),
      pose(STANDING, { elbowL: [43, 20], elbowR: [52, 20], handL: [43, 10], handR: [52, 10] }),
    ],
    cycleSec: 1.0,
  },
  {
    id: 'lateral-raise', label: 'Lateral raise', equipment: 'dumbbells',
    poses: [
      STANDING,
      pose(STANDING, { elbowL: [30, 28], elbowR: [69, 28], handL: [22, 28], handR: [78, 28] }),
    ],
    cycleSec: 1.0,
  },
  {
    id: 'triceps-extension', label: 'Overhead triceps extension', equipment: 'dumbbell',
    poses: [
      pose(STANDING, { elbowL: [46, 22], elbowR: [53, 22], handL: [50, 38], handR: [51, 38] }),
      pose(STANDING, { elbowL: [46, 22], elbowR: [53, 22], handL: [47, 12], handR: [52, 12] }),
    ],
    cycleSec: 1.0,
  },
  {
    id: 'triceps-stretch', label: 'Overhead triceps stretch',
    poses: [
      pose(STANDING, { elbowR: [58, 20], handR: [46, 24] }),
      pose(STANDING, { elbowR: [56, 18], handR: [42, 26] }),
    ],
    cycleSec: 2.2,
  },
];
