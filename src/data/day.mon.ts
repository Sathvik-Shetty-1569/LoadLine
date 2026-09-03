import type { Block } from './types';
import { sharedWarmup, timedBlock, perSide, repeated } from './helpers';

export const monBlocks: Block[] = [
  ...sharedWarmup(),
  {
    id: 'mon-rdl', phase: 'work', mode: 'reps', name: 'DB Romanian Deadlift',
    sourceClockSec: [480, 1020], prescription: '4 x 15-20', sets: 4, estWorkSec: 45, restSec: 90, restKind: 'compound',
    toFailureLastSet: true, notes: '3-sec eccentric, feel the hamstring stretch. Last set to failure',
  },
  {
    id: 'mon-slrdl', phase: 'work', mode: 'unilateral', name: 'Single-leg DB RDL',
    sourceClockSec: [1020, 1500], prescription: '3 x 12/leg', sets: 3, estWorkSec: 50, restSec: 60, restKind: 'unilateral',
    notes: 'Slow, balance-focused',
  },
  {
    id: 'mon-bridge', phase: 'work', mode: 'reps', name: 'Glute Bridge (DB on hips)',
    sourceClockSec: [1500, 1800], prescription: '3 x 20-25', sets: 3, estWorkSec: 40, restSec: 60, restKind: 'isolation',
    notes: '1-sec squeeze at top',
  },
  {
    id: 'mon-donkey', phase: 'work', mode: 'unilateral', name: 'Donkey Kicks / Fire Hydrants',
    sourceClockSec: [1800, 2220], prescription: '3 x 15-20/leg', sets: 3, estWorkSec: 40, restSec: 60, restKind: 'unilateral',
    notes: 'Bodyweight, controlled',
  },
  {
    id: 'mon-slcalf', phase: 'work', mode: 'unilateral', name: 'Single-leg Calf Raise (DB in one hand)',
    sourceClockSec: [2220, 2640], prescription: '3 x 15-20/leg', sets: 3, estWorkSec: 40, restSec: 60, restKind: 'unilateral',
    notes: 'Full range - gastrocnemius',
  },
  {
    id: 'mon-hops', phase: 'work', mode: 'reps', name: 'Calf Raise Hops (light, fast pulses)',
    sourceClockSec: [2640, 2820], prescription: '2 x 20', sets: 2, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    notes: 'Explosive. Highest Achilles load in the program - 48h clear of a run on both sides',
  },
  {
    id: 'mon-superman', phase: 'work', mode: 'hold', name: 'Superman Hold',
    sourceClockSec: [2820, 3060], prescription: '3 x 30-45 sec', sets: 3, holdSec: 37, restSec: 45, restKind: 'hold',
    notes: 'Squeeze lower back and glutes',
  },
  {
    id: 'mon-deadhang', phase: 'work', mode: 'maxtime', name: 'Dead Hang',
    sourceClockSec: [3060, 3240], prescription: '2 x max time', sets: 2, estWorkSec: 30, restSec: 60, restKind: 'hold',
    notes: 'Full hang, relaxed shoulders - GRIP FINISHER',
  },
  timedBlock('cooldown', 'Standing Hamstring Stretch', [3240, 3300], perSide(30),
    'Heel on a low surface, leg straight, hinge from hips'),
  timedBlock('cooldown', 'Seated Forward Fold', [3300, 3360], repeated(2, 30),
    'Sit, legs extended, reach toward toes - hamstrings + low back'),
  timedBlock('cooldown', 'Figure-4 Glute Stretch', [3360, 3420], perSide(30),
    'On back, ankle crossed over opposite knee, pull thigh in'),
  timedBlock('cooldown', 'Kneeling Hip Flexor Stretch', [3420, 3480], perSide(30),
    'Back knee down, front knee bent 90°, push hips forward'),
  timedBlock('cooldown', 'Standing Calf Wall Stretch', [3480, 3600], [
    { label: 'Left, knee straight', durationSec: 30 },
    { label: 'Right, knee straight', durationSec: 30 },
    { label: 'Left, knee softened', durationSec: 30 },
    { label: 'Right, knee softened', durationSec: 30 },
  ], 'The hops load the Achilles hard - do this properly'),
  timedBlock('cooldown', 'Wrist Flexor Stretch', [3600, 3660], perSide(30),
    'Arm extended, palm up, pull fingers back - after the dead hang'),
  timedBlock('cooldown', "Child's Pose", [3660, 3720], repeated(1, 45),
    'Decompresses the low back after RDLs and supermans'),
];
