import type { Archetype } from '../types';
import { STANDING, SEATED, pose } from '../types';

export const armsArchetypes: Archetype[] = [
  {
    id: 'curl', label: 'Curl (biceps / hammer)', equipment: 'dumbbells',
    poses: [
      STANDING,
      pose(STANDING, { elbowL: [45, 41], elbowR: [52, 41], handL: [42, 30], handR: [55, 30] }),
    ],
    cycleSec: 1.0,
  },
  {
    id: 'incline-curl', label: 'Incline DB curl', equipment: 'dumbbells',
    poses: [
      pose(STANDING, { shoulderL: [46, 28], elbowL: [40, 46], handL: [38, 58], shoulderR: [53, 28], elbowR: [59, 46], handR: [61, 58] }),
      pose(STANDING, { shoulderL: [46, 28], elbowL: [40, 46], handL: [34, 34], shoulderR: [53, 28], elbowR: [59, 46], handR: [65, 34] }),
    ],
    cycleSec: 1.1,
  },
  {
    id: 'wrist-curl', label: 'Wrist curl / reverse wrist curl', equipment: 'dumbbell', prop: 'chair',
    poses: [
      pose(SEATED, { elbowR: [56, 68], handR: [66, 76] }),
      pose(SEATED, { elbowR: [56, 68], handR: [66, 68] }),
    ],
    cycleSec: 0.9,
  },
  {
    id: 'wrist-twist', label: 'Pronation / supination twist', equipment: 'dumbbell',
    poses: [
      pose(STANDING, { elbowR: [52, 41], handR: [58, 54] }),
      pose(STANDING, { elbowR: [52, 41], handR: [58, 54], shoulderR: [54, 27] }),
    ],
    cycleSec: 1.0,
  },
  {
    id: 'wrist-circle', label: 'Wrist circles + finger extensions',
    poses: [
      pose(STANDING, { handL: [43, 55], handR: [54, 55] }),
      pose(STANDING, { handL: [47, 56], handR: [50, 56] }),
    ],
    cycleSec: 1.0,
  },
  {
    id: 'wrist-flexor-stretch', label: 'Wrist flexor stretch',
    poses: [
      pose(STANDING, { elbowR: [58, 46], handR: [66, 46] }),
      pose(STANDING, { elbowR: [58, 46], handR: [64, 40] }),
    ],
    cycleSec: 2.0,
  },
  {
    id: 'wrist-extensor-stretch', label: 'Wrist extensor stretch',
    poses: [
      pose(STANDING, { elbowR: [58, 46], handR: [66, 46] }),
      pose(STANDING, { elbowR: [58, 46], handR: [64, 52] }),
    ],
    cycleSec: 2.0,
  },
];
