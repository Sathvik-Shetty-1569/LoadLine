import type { Block } from './types';
import { perSide } from './helpers';

export const pullBBlocks: Block[] = [
  {
    id: 'pullb-bandpullaparts', phase: 'warmup', mode: 'timed', name: 'Band Pull-Aparts / Scap Squeezes',
    steps: [{ label: '2 x 15-20 reps', durationSec: 30 }],
    notes: 'Wakes up the lats and mid-back before pulling',
  },
  {
    id: 'pullb-armswings', phase: 'warmup', mode: 'timed', name: 'Arm Swings',
    steps: [
      { label: 'Forward-back', durationSec: 30 },
      { label: 'Across body', durationSec: 30 },
    ],
  },
  {
    id: 'pullb-rampup', phase: 'warmup', mode: 'reps', name: 'Ramp-Up Sets - Seated Row',
    prescription: '3 x 8 (build to working weight)', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'compound',
    notes: 'Increase the load each set - stay well short of failure, this is just priming the pattern',
  },
  {
    id: 'pullb-seatedrow', phase: 'work', mode: 'reps', name: 'Seated Row Machine',
    prescription: '4 x 10-12', sets: 4, estWorkSec: 35, restSec: 90, restKind: 'compound',
    tags: ['hypertrophy'], focus: 'Mid-back, lats, biceps',
  },
  {
    id: 'pullb-latpulldown', phase: 'work', mode: 'reps', name: 'Lat Pulldown, close/underhand grip',
    prescription: '3 x 10-12', sets: 3, estWorkSec: 35, restSec: 90, restKind: 'compound',
    tags: ['hypertrophy'], focus: 'Lats, biceps',
  },
  {
    id: 'pullb-pullup', phase: 'work', mode: 'reps', name: 'Assisted Pull-up',
    prescription: '3 x 10-12', sets: 3, estWorkSec: 35, restSec: 90, restKind: 'compound',
    notes: 'Set assistance so the last rep is hard but clean',
    tags: ['hypertrophy'], focus: 'Lats, upper back, biceps',
  },
  {
    id: 'pullb-facepull', phase: 'work', mode: 'reps', name: 'Cable Face Pull',
    prescription: '3 x 15', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Rear delts, upper back, rotator cuff',
  },
  {
    id: 'pullb-preachercurl', phase: 'work', mode: 'reps', name: 'Preacher Curl',
    prescription: '3 x 12-15', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Biceps',
  },
  {
    id: 'pullb-forearmcurl', phase: 'work', mode: 'reps', name: 'Forearm Curl',
    prescription: '3 x 15', sets: 3, estWorkSec: 25, restSec: 45, restKind: 'isolation',
    tags: ['grip', 'hypertrophy'], focus: 'Forearm flexors',
  },
  {
    id: 'pullb-lat-stretch', phase: 'cooldown', mode: 'timed', name: 'Overhead Lat Stretch',
    steps: perSide(30), notes: 'Reach overhead and lean to the side',
  },
  {
    id: 'pullb-biceps-stretch', phase: 'cooldown', mode: 'timed', name: 'Biceps Wall Stretch',
    steps: perSide(30), notes: 'Arm extended behind you against a wall, palm flat, rotate away',
  },
  {
    id: 'pullb-upperback-stretch', phase: 'cooldown', mode: 'timed', name: 'Upper-back Cross Stretch',
    steps: perSide(30), notes: 'Pull one arm across the chest, round the upper back',
  },
];
