import type { Block } from './types';
import { timedBlock, perSide } from './helpers';

/** Wed/Sat post-run stretch: ~3 min, optional. */
export const runDayBlocks: Block[] = [
  timedBlock('cooldown', 'Standing Calf Wall Stretch', [0, 120], [
    { label: 'Left, knee straight', durationSec: 30 },
    { label: 'Right, knee straight', durationSec: 30 },
    { label: 'Left, knee softened', durationSec: 30 },
    { label: 'Right, knee softened', durationSec: 30 },
  ], 'If legs feel tight after the run'),
  timedBlock('cooldown', 'Standing Quad Stretch', [120, 180], perSide(30)),
];

/** Sunday optional full-body stretch. */
export const sundayBlocks: Block[] = [
  timedBlock('cooldown', 'Doorway Lat Stretch', [0, 60], perSide(30)),
  timedBlock('cooldown', 'Chest Doorway Stretch', [60, 120], perSide(30)),
  timedBlock('cooldown', 'Standing Quad Stretch', [120, 180], perSide(30)),
  timedBlock('cooldown', 'Seated Forward Fold', [180, 240], perSide(30)),
  timedBlock('cooldown', 'Standing Calf Wall Stretch', [240, 360], [
    { label: 'Left, knee straight', durationSec: 30 },
    { label: 'Right, knee straight', durationSec: 30 },
    { label: 'Left, knee softened', durationSec: 30 },
    { label: 'Right, knee softened', durationSec: 30 },
  ]),
  timedBlock('cooldown', 'Figure-4 Glute Stretch', [360, 420], perSide(30)),
];
