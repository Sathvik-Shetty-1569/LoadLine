import type { Archetype } from '../types';
import { STANDING, SEATED, SUPINE, PLANK, pose } from '../types';

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
    id: 'bench-press', label: 'Bench press', prop: 'floor',
    poses: [
      pose(SUPINE, { elbowL: [38, 68], elbowR: [38, 92], handL: [51, 74], handR: [51, 86] }),
      pose(SUPINE, { elbowL: [48, 74], elbowR: [48, 88], handL: [62, 76], handR: [62, 86] }),
    ],
    cycleSec: 1.1,
  },
  {
    id: 'incline-press-machine', label: 'Incline chest press machine', prop: 'chair',
    poses: [
      pose(SEATED, { elbowL: [38, 50], elbowR: [44, 50], handL: [42, 58], handR: [48, 58] }),
      pose(SEATED, { elbowL: [52, 44], elbowR: [58, 44], handL: [66, 44], handR: [72, 44] }),
    ],
    cycleSec: 1.1,
  },
  {
    id: 'pec-deck', label: 'Pec deck fly', prop: 'chair',
    poses: [
      pose(SEATED, { elbowL: [28, 40], elbowR: [30, 46], handL: [24, 50], handR: [26, 58] }),
      pose(SEATED, { elbowL: [50, 42], elbowR: [54, 46], handL: [58, 44], handR: [62, 48] }),
    ],
    cycleSec: 1.0,
  },
  {
    id: 'cable-crossover', label: 'Cable crossover fly (low-to-high)',
    poses: [
      pose(STANDING, { elbowL: [36, 58], elbowR: [40, 64], handL: [26, 64], handR: [30, 72] }),
      pose(STANDING, { elbowL: [52, 30], elbowR: [56, 34], handL: [60, 22], handR: [64, 26] }),
    ],
    cycleSec: 1.2,
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
    id: 'overhead-press-machine', label: 'Overhead press machine',
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
    id: 'lateral-raise-machine', label: 'Lateral raise machine',
    poses: [
      STANDING,
      pose(STANDING, { elbowL: [30, 28], elbowR: [69, 28], handL: [22, 28], handR: [78, 28] }),
    ],
    cycleSec: 1.0,
  },
  {
    id: 'triceps-pushdown', label: 'Cable triceps pushdown',
    poses: [
      pose(STANDING, { elbowL: [45, 38], elbowR: [52, 38], handL: [44, 28], handR: [53, 28] }),
      pose(STANDING, { elbowL: [45, 38], elbowR: [52, 38], handL: [44, 58], handR: [53, 58] }),
    ],
    cycleSec: 0.9,
  },
  {
    id: 'dip', label: 'Dip (bars / dip station)',
    poses: [
      pose(STANDING, {
        head: [46, 20], neck: [47, 28], shoulderL: [44, 32], shoulderR: [50, 34],
        elbowL: [40, 46], elbowR: [46, 48], handL: [42, 58], handR: [48, 60],
        hip: [50, 50], kneeL: [54, 66], kneeR: [58, 68], footL: [58, 80], footR: [62, 82],
      }),
      pose(STANDING, {
        head: [48, 14], neck: [49, 22], shoulderL: [45, 25], shoulderR: [52, 27],
        elbowL: [43, 40], elbowR: [50, 42], handL: [42, 58], handR: [48, 60],
        hip: [49, 46], kneeL: [52, 64], kneeR: [56, 66], footL: [56, 78], footR: [60, 80],
      }),
    ],
    cycleSec: 1.1,
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
