import type { Block } from './types';
import { perSide } from './helpers';

export const pullABlocks: Block[] = [
  {
    id: 'pulla-bandpullaparts', phase: 'warmup', mode: 'timed', name: 'Band Pull-Aparts / Scap Squeezes',
    steps: [{ label: '2 x 15-20 reps', durationSec: 30 }],
    notes: 'Wakes up the lats and mid-back before pulling',
  },
  {
    id: 'pulla-armswings', phase: 'warmup', mode: 'timed', name: 'Arm Swings',
    steps: [
      { label: 'Forward-back', durationSec: 30 },
      { label: 'Across body', durationSec: 30 },
    ],
  },
  {
    id: 'pulla-rampup', phase: 'warmup', mode: 'reps', name: 'Ramp-Up Sets - Lat Pulldown',
    prescription: '3 x 8 (build to working weight)', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'compound',
    notes: 'Increase the load each set - stay well short of failure, this is just priming the pattern',
  },
  {
    id: 'pulla-latpulldown', phase: 'work', mode: 'reps', name: 'Lat Pulldown',
    prescription: '4 x 8-10', sets: 4, estWorkSec: 35, restSec: 90, restKind: 'compound',
    tags: ['hypertrophy', 'strength'], focus: 'Lats, upper back',
  },
  {
    id: 'pulla-seatedrow', phase: 'work', mode: 'reps', name: 'Seated Row Machine',
    prescription: '3 x 8-10', sets: 3, estWorkSec: 35, restSec: 90, restKind: 'compound',
    tags: ['hypertrophy'], focus: 'Mid-back, lats, biceps',
  },
  {
    id: 'pulla-pullup', phase: 'work', mode: 'reps', name: 'Assisted Pull-up (wide grip)',
    prescription: '3 x 8-10', sets: 3, estWorkSec: 35, restSec: 90, restKind: 'compound',
    notes: 'Set assistance so the last rep is hard but clean',
    tags: ['hypertrophy', 'strength'], focus: 'Lats, upper back, biceps',
  },
  {
    id: 'pulla-facepull', phase: 'work', mode: 'reps', name: 'Cable Face Pull',
    prescription: '3 x 15', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Rear delts, upper back, rotator cuff',
  },
  {
    id: 'pulla-preachercurl', phase: 'work', mode: 'reps', name: 'Preacher Curl Machine',
    prescription: '3 x 10-12', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Biceps',
  },
  {
    id: 'pulla-forearmcurl', phase: 'work', mode: 'reps', name: 'Forearm Curl Machine',
    prescription: '3 x 15', sets: 3, estWorkSec: 25, restSec: 45, restKind: 'isolation',
    tags: ['grip', 'hypertrophy'], focus: 'Forearm flexors',
  },
  {
    id: 'pulla-lat-stretch', phase: 'cooldown', mode: 'timed', name: 'Overhead Lat Stretch',
    steps: perSide(30), notes: 'Reach overhead and lean to the side',
  },
  {
    id: 'pulla-biceps-stretch', phase: 'cooldown', mode: 'timed', name: 'Biceps Wall Stretch',
    steps: perSide(30), notes: 'Arm extended behind you against a wall, palm flat, rotate away',
  },
  {
    id: 'pulla-upperback-stretch', phase: 'cooldown', mode: 'timed', name: 'Upper-back Cross Stretch',
    steps: perSide(30), notes: 'Pull one arm across the chest, round the upper back',
  },
];
