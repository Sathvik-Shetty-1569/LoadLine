import type { Block } from './types';
import { sharedWarmup, timedBlock, perSide } from './helpers';

export const tueBlocks: Block[] = [
  ...sharedWarmup(),
  {
    id: 'tue-scap-pullups', phase: 'warmup', mode: 'reps', name: 'Scapular Pull-ups',
    sourceClockSec: [480, 600], prescription: '2 x 5, slow, unweighted', sets: 2, estWorkSec: 30, restSec: 30, restKind: 'isolation',
    notes: 'Wakes up the lats before working pull-ups',
  },
  { id: 'tue-pullups', phase: 'work', mode: 'tiered', name: 'Wide-grip Pull-ups', sourceClockSec: [600, 1020],
    barExercise: 'pullup', notes: 'Full hang to chin over bar - first, freshest' },
  {
    id: 'tue-squeeze', phase: 'work', mode: 'reps', name: 'DB Squeeze Press',
    sourceClockSec: [1020, 1380], prescription: '3 x 15-20', sets: 3, estWorkSec: 30, restSec: 90, restKind: 'compound',
    notes: 'Squeeze DBs together the whole set, 2-sec hold at peak',
  },
  {
    id: 'tue-floorfly', phase: 'work', mode: 'reps', name: 'DB Floor Fly',
    sourceClockSec: [1380, 1740], prescription: '3 x 15-20', sets: 3, estWorkSec: 60, restSec: 60, restKind: 'isolation',
    notes: 'Shoulders elevated, hands converging at top. Set up the couch/pillows before starting - biases inner/sternal chest',
  },
  {
    id: 'tue-shoulderpress', phase: 'work', mode: 'reps', name: 'DB Standing Shoulder Press',
    sourceClockSec: [1740, 2100], prescription: '3 x 12-15', sets: 3, estWorkSec: 30, restSec: 90, restKind: 'compound',
    notes: '3-sec eccentric',
  },
  {
    id: 'tue-superset', phase: 'work', mode: 'superset', name: 'Lateral Raise + Overhead Triceps Extension',
    sourceClockSec: [2100, 2880], rounds: 4, switchSec: 15, restSec: 90, restKind: 'superset',
    exerciseA: { name: 'DB Lateral Raise', prescription: '15-20', kind: 'reps', estWorkSec: 45, notes: '1-sec pause at top' },
    exerciseB: { name: 'DB Overhead Triceps Extension', prescription: '15-20', kind: 'reps', estWorkSec: 45, notes: 'Full stretch at bottom' },
  },
  {
    id: 'tue-calf', phase: 'work', mode: 'reps', name: 'Standing Calf Raise (DB held)',
    sourceClockSec: [2880, 3300], prescription: '4 x 20-25', sets: 4, estWorkSec: 45, restSec: 60, restKind: 'isolation',
    notes: 'Full stretch at bottom, 1-sec pause at top',
  },
  {
    id: 'tue-forearm', phase: 'work', mode: 'reps', name: 'Wrist Curl / Reverse Wrist Curl (alternating)',
    sourceClockSec: [3300, 3660], prescription: '2 x 20-25 (palms up), 2 x 15-20 (palms down)', sets: 4, estWorkSec: 45,
    restSec: 45, restKind: 'isolation', notes: 'FOREARM FINISHER - palms up, then palms down',
  },
  timedBlock('cooldown', 'Doorway/Wall Lat Stretch', [3660, 3720], perSide(30),
    'Hold doorframe overhead, lean body away and down'),
  timedBlock('cooldown', 'Chest Doorway Stretch', [3720, 3780], perSide(30),
    'Forearm on doorframe at shoulder height, rotate body away'),
  timedBlock('cooldown', 'Overhead Triceps Stretch', [3780, 3840], perSide(30),
    'One arm bent overhead, other hand pulls elbow back'),
  timedBlock('cooldown', 'Cross-body Shoulder Stretch', [3840, 3900], perSide(30),
    'Pull one arm across the chest - rear delts'),
  timedBlock('cooldown', 'Wrist Flexor Stretch', [3900, 3960], perSide(30),
    'Arm extended, palm up, pull fingers back'),
  timedBlock('cooldown', 'Wrist Extensor Stretch', [3960, 4020], perSide(30),
    'Arm extended, palm down, pull hand down'),
  timedBlock('cooldown', 'Standing Calf Wall Stretch', [4020, 4140], [
    { label: 'Left, knee straight', durationSec: 30 },
    { label: 'Right, knee straight', durationSec: 30 },
    { label: 'Left, knee softened', durationSec: 30 },
    { label: 'Right, knee softened', durationSec: 30 },
  ], 'Gastrocnemius, then soleus'),
];
