import type { Program } from './types';
import { monBlocks } from './day.mon';
import { tueBlocks } from './day.tue';
import { thuBlocks } from './day.thu';
import { friBlocks } from './day.fri';
import { runDayBlocks, sundayBlocks } from './day.rest';

export const program: Program = {
  title: '7kg Dumbbell + Doorway Bar Hypertrophy Program (v7)',
  days: [
    { key: 'mon', label: 'Monday', sessionName: 'Lower B', blocks: monBlocks },
    { key: 'tue', label: 'Tuesday', sessionName: 'Upper A', blocks: tueBlocks },
    { key: 'wed', label: 'Wednesday', sessionName: 'Run', blocks: runDayBlocks },
    { key: 'thu', label: 'Thursday', sessionName: 'Lower A', blocks: thuBlocks },
    { key: 'fri', label: 'Friday', sessionName: 'Upper B', blocks: friBlocks },
    { key: 'sat', label: 'Saturday', sessionName: 'Run', blocks: runDayBlocks },
    // The listed stretches sum to ~7 min; Notion calls it an optional "10-min" stretch as a loose
    // suggestion rather than a literal schedule, so the target is pinned rather than derived.
    { key: 'sun', label: 'Sunday', sessionName: 'Rest / Optional Stretch', targetMinutesOverride: 10, blocks: sundayBlocks },
  ],
};

// Day lookup and "what day is it" live in lib/programStore.ts (getDay) and lib/date.ts (todayKey) -
// this file is just the v7 template's data (see data/templates.ts), not the app's active program.
