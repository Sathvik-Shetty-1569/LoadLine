import type { Program } from './types';
import { pushABlocks } from './ppl.push-a';
import { pullABlocks } from './ppl.pull-a';
import { legsABlocks } from './ppl.legs-a';
import { pushBBlocks } from './ppl.push-b';
import { pullBBlocks } from './ppl.pull-b';
import { legsBBlocks } from './ppl.legs-b';

export const pplProgram: Program = {
  title: 'Push / Pull / Legs (Machines)',
  days: [
    { key: 'mon', label: 'Monday', sessionName: 'Push A', blocks: pushABlocks },
    { key: 'tue', label: 'Tuesday', sessionName: 'Pull A', blocks: pullABlocks },
    { key: 'wed', label: 'Wednesday', sessionName: 'Legs A', blocks: legsABlocks },
    { key: 'thu', label: 'Thursday', sessionName: 'Push B', blocks: pushBBlocks },
    { key: 'fri', label: 'Friday', sessionName: 'Pull B', blocks: pullBBlocks },
    { key: 'sat', label: 'Saturday', sessionName: 'Legs B', blocks: legsBBlocks },
    { key: 'sun', label: 'Sunday', sessionName: 'Rest', blocks: [] },
  ],
};

// This file is just the PPL template's data (see data/templates.ts), not the app's active program -
// see data/program.ts's matching comment for the v7 template.
