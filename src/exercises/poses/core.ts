import type { Archetype } from '../types';
import { PLANK, PRONE, SEATED, SUPINE, KNEELING, FLOOR, pose } from '../types';

export const coreArchetypes: Archetype[] = [
  {
    id: 'plank', label: 'Plank hold',
    poses: [PLANK, pose(PLANK, { hip: [62, 65] })],
    cycleSec: 2.0,
  },
  {
    id: 'superman', label: 'Superman hold',
    poses: [
      PRONE,
      pose(PRONE, {
        head: [16, 74], neck: [26, 76], shoulderL: [30, 74], shoulderR: [30, 79],
        handL: [8, 68], handR: [8, 80], kneeL: [76, 78], kneeR: [76, 82],
        footL: [92, 76], footR: [92, 80],
      }),
    ],
    cycleSec: 1.6,
  },
  {
    id: 'forward-fold', label: 'Seated forward fold', prop: 'floor',
    poses: [
      pose(SEATED, { footL: [78, FLOOR], footR: [82, FLOOR] }),
      pose(SEATED, {
        head: [66, 58], neck: [60, 56], shoulderL: [56, 54], shoulderR: [58, 58],
        elbowL: [66, 62], elbowR: [68, 66], handL: [76, 68], handR: [78, 72],
        footL: [78, FLOOR], footR: [82, FLOOR],
      }),
    ],
    cycleSec: 2.2,
  },
  {
    id: 'figure-4-stretch', label: 'Figure-4 glute stretch',
    poses: [
      pose(SUPINE, {}),
      pose(SUPINE, { kneeR: [64, 68], footR: [76, 78], kneeL: [71, 80], footL: [80, 70] }),
    ],
    cycleSec: 2.2,
  },
  {
    id: 'thoracic-extension', label: 'Thoracic extension over a chair', prop: 'chair',
    poses: [KNEELING, pose(KNEELING, { hip: [52, 66], head: [56, 34], neck: [54, 42], shoulderL: [50, 42], shoulderR: [56, 44] })],
    cycleSec: 2.4,
  },
  {
    id: 'childs-pose', label: "Child's pose",
    poses: [
      {
        head: [80, 84], neck: [70, 82], shoulderL: [63, 79], shoulderR: [63, 84],
        elbowL: [76, 80], elbowR: [76, 85], handL: [88, 82], handR: [88, 87],
        hip: [38, 68], kneeL: [30, 82], kneeR: [30, 87], footL: [24, 88], footR: [24, 92],
      },
      {
        head: [83, 88], neck: [71, 85], shoulderL: [64, 81], shoulderR: [64, 86],
        elbowL: [78, 83], elbowR: [78, 88], handL: [92, 86], handR: [92, 90],
        hip: [37, 70], kneeL: [30, 82], kneeR: [30, 87], footL: [24, 88], footR: [24, 92],
      },
    ],
    cycleSec: 2.6,
  },
];
