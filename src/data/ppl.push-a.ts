import type { Block } from './types';
import { perSide, single } from './helpers';

export const pushABlocks: Block[] = [
  {
    id: 'pusha-armcircles', phase: 'warmup', mode: 'timed', name: 'Arm Circles',
    steps: [
      { label: 'Forward', durationSec: 20 },
      { label: 'Backward', durationSec: 20 },
    ],
    notes: 'Loosens shoulders',
  },
  {
    id: 'pusha-bandpullaparts', phase: 'warmup', mode: 'timed', name: 'Band Pull-Aparts / Shoulder Rolls',
    steps: single(30, '2 x 15-20 reps'),
    notes: 'Wakes up rear delts and rotator cuff before pressing',
  },
  {
    id: 'pusha-pushups', phase: 'warmup', mode: 'reps', name: 'Push-ups',
    prescription: '1 x 10', sets: 1, estWorkSec: 25, restSec: 30, restKind: 'compound',
    notes: 'Bodyweight, general upper-body activation',
  },
  {
    id: 'pusha-rampup', phase: 'warmup', mode: 'reps', name: 'Ramp-Up Sets - Bench Press',
    prescription: '3 x 5 (build to working weight)', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'compound',
    notes: 'Increase the load each set - stay well short of failure, this is just priming the pattern',
  },
  {
    id: 'pusha-bench', phase: 'work', mode: 'reps', name: 'Bench Press',
    prescription: '4 x 6-8', sets: 4, estWorkSec: 40, restSec: 120, restKind: 'compound',
    tags: ['strength', 'hypertrophy'], focus: 'Chest, shoulders, triceps',
  },
  {
    id: 'pusha-incline', phase: 'work', mode: 'reps', name: 'Incline Chest Press Machine',
    prescription: '3 x 8-10', sets: 3, estWorkSec: 35, restSec: 90, restKind: 'compound',
    tags: ['hypertrophy'], focus: 'Upper chest, shoulders, triceps',
  },
  {
    id: 'pusha-pecdeck', phase: 'work', mode: 'reps', name: 'Pec Deck Fly',
    prescription: '3 x 12-15', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Chest (isolation)',
  },
  {
    id: 'pusha-shoulderpress', phase: 'work', mode: 'reps', name: 'Shoulder Press Machine',
    prescription: '3 x 8-10', sets: 3, estWorkSec: 35, restSec: 90, restKind: 'compound',
    tags: ['hypertrophy', 'strength'], focus: 'Shoulders, triceps',
  },
  {
    id: 'pusha-lateral', phase: 'work', mode: 'reps', name: 'Standing Lateral Raise Machine',
    prescription: '3 x 12-15', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Side delts',
  },
  {
    id: 'pusha-pushdown', phase: 'work', mode: 'reps', name: 'Cable Rope Pushdown',
    prescription: '3 x 12-15', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Triceps',
  },
  {
    id: 'pusha-dips', phase: 'work', mode: 'reps', name: 'Dip Station',
    prescription: '2 x 10-12', sets: 2, estWorkSec: 35, restSec: 90, restKind: 'compound',
    notes: 'Assisted machine or bodyweight - lean forward to bias chest',
    tags: ['hypertrophy', 'strength'], focus: 'Chest, triceps, front delts',
  },
  {
    id: 'pusha-chest-stretch', phase: 'cooldown', mode: 'timed', name: 'Doorway Chest Stretch',
    steps: perSide(30), notes: 'Forearm on doorframe at shoulder height, rotate body away',
  },
  {
    id: 'pusha-triceps-stretch', phase: 'cooldown', mode: 'timed', name: 'Overhead Triceps Stretch',
    steps: perSide(30), notes: 'One arm bent overhead, other hand pulls elbow back',
  },
  {
    id: 'pusha-shoulder-stretch', phase: 'cooldown', mode: 'timed', name: 'Cross-body Shoulder Stretch',
    steps: perSide(30), notes: 'Pull one arm across the chest - rear delts',
  },
];
