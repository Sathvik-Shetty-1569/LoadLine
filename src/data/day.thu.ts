import type { Block } from './types';
import { sharedWarmup, timedBlock, perSide } from './helpers';

export const thuBlocks: Block[] = [
  ...sharedWarmup(),
  {
    id: 'thu-goblet', phase: 'work', mode: 'reps', name: 'DB Goblet Squat',
    sourceClockSec: [480, 1020], prescription: '4 x 15-20', sets: 4, estWorkSec: 45, restSec: 90, restKind: 'compound',
    toFailureLastSet: true, notes: '3-sec eccentric. Last set to failure',
  },
  {
    id: 'thu-bulgarian', phase: 'work', mode: 'unilateral', name: 'Bulgarian Split Squat (DB each hand)',
    sourceClockSec: [1020, 1560], prescription: '3 x 12-15/leg', sets: 3, estWorkSec: 45, restSec: 90, restKind: 'compound',
    notes: 'Full range, controlled',
  },
  {
    id: 'thu-lunges', phase: 'work', mode: 'unilateral', name: 'Walking Lunges (DB)',
    sourceClockSec: [1560, 2040], prescription: '3 x 12/leg', sets: 3, estWorkSec: 35, restSec: 90, restKind: 'compound',
    notes: 'Long stride, deep',
  },
  {
    id: 'thu-slcalf', phase: 'work', mode: 'unilateral', name: 'Single-leg Calf Raise (knee straight)',
    sourceClockSec: [2040, 2580], prescription: '4 x 15-20/leg', sets: 4, estWorkSec: 37.5, restSec: 60, restKind: 'unilateral',
    notes: 'Full stretch, pause at top - gastrocnemius. Wall for balance',
  },
  {
    id: 'thu-seatedcalf', phase: 'work', mode: 'reps', name: 'Seated Calf Raise (DB on knees, heels on a step)',
    sourceClockSec: [2580, 2880], prescription: '3 x 20-25', sets: 3, estWorkSec: 40, restSec: 60, restKind: 'isolation',
    notes: 'Bent knee isolates the soleus, which standing work misses',
  },
  {
    id: 'thu-superset', phase: 'work', mode: 'superset', name: 'Lying Leg Raises + Plank',
    sourceClockSec: [2880, 3300], rounds: 3, switchSec: 15, restSec: 75, restKind: 'superset',
    exerciseA: { name: 'Lying Leg Raises', prescription: '15-20', kind: 'reps', estWorkSec: 13, notes: 'No swinging' },
    exerciseB: { name: 'Plank', prescription: '30-45 sec', kind: 'hold', holdSec: 37, notes: 'Hold between leg-raise sets' },
  },
  {
    id: 'thu-farmers', phase: 'work', mode: 'hold', name: "Farmer's Carry Hold",
    sourceClockSec: [3300, 3540], prescription: '3 x 30-40 sec', sets: 3, holdSec: 35, restSec: 45, restKind: 'hold',
    notes: 'DB each hand, stand tall or walk in place - GRIP FINISHER',
  },
  timedBlock('cooldown', 'Standing Quad Stretch', [3540, 3600], perSide(30),
    'Heel to glute, knee pointing down'),
  timedBlock('cooldown', 'Kneeling Hip Flexor Stretch', [3600, 3660], perSide(30),
    'Back knee down, front knee bent 90°, push hips forward'),
  timedBlock('cooldown', 'Standing Hamstring Stretch', [3660, 3720], perSide(30),
    'Heel on a low surface, leg straight, hinge from the hips'),
  timedBlock('cooldown', 'Figure-4 Glute Stretch', [3720, 3780], perSide(30),
    'On back, ankle crossed over opposite knee, pull thigh in'),
  timedBlock('cooldown', 'Standing Calf Wall Stretch', [3780, 3900], [
    { label: 'Left, knee straight', durationSec: 30 },
    { label: 'Right, knee straight', durationSec: 30 },
    { label: 'Left, knee softened', durationSec: 30 },
    { label: 'Right, knee softened', durationSec: 30 },
  ], 'Straight knee hits gastrocnemius, bent knee hits soleus'),
  timedBlock('cooldown', 'Wrist Flexor Stretch', [3900, 3960], perSide(30),
    "After the farmer's carry"),
  timedBlock('cooldown', "Child's Pose", [3960, 4020], [{ label: 'Hold', durationSec: 45 }],
    'Low back after squat and lunge loading'),
];
