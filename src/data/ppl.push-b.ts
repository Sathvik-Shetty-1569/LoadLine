import type { Block } from './types';
import { perSide, single } from './helpers';

export const pushBBlocks: Block[] = [
  {
    id: 'pushb-armcircles', phase: 'warmup', mode: 'timed', name: 'Arm Circles',
    steps: [
      { label: 'Forward', durationSec: 20 },
      { label: 'Backward', durationSec: 20 },
    ],
    notes: 'Loosens shoulders',
  },
  {
    id: 'pushb-bandpullaparts', phase: 'warmup', mode: 'timed', name: 'Band Pull-Aparts / Shoulder Rolls',
    steps: single(30, '2 x 15-20 reps'),
    notes: 'Wakes up rear delts and rotator cuff before pressing',
  },
  {
    id: 'pushb-pushups', phase: 'warmup', mode: 'reps', name: 'Push-ups',
    prescription: '1 x 10', sets: 1, estWorkSec: 25, restSec: 30, restKind: 'compound',
    notes: 'Bodyweight, general upper-body activation',
  },
  {
    id: 'pushb-rampup', phase: 'warmup', mode: 'reps', name: 'Ramp-Up Sets - Smith Machine Overhead Press',
    prescription: '3 x 5 (build to working weight)', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'compound',
    notes: 'Increase the load each set - stay well short of failure, this is just priming the pattern',
  },
  {
    id: 'pushb-smithohp', phase: 'work', mode: 'reps', name: 'Smith Machine Overhead Press',
    prescription: '4 x 6-8', sets: 4, estWorkSec: 40, restSec: 120, restKind: 'compound',
    tags: ['strength', 'hypertrophy'], focus: 'Shoulders, triceps',
  },
  {
    id: 'pushb-incline', phase: 'work', mode: 'reps', name: 'Incline Chest Press Machine',
    prescription: '3 x 8-10', sets: 3, estWorkSec: 35, restSec: 90, restKind: 'compound',
    tags: ['hypertrophy'], focus: 'Upper chest, shoulders, triceps',
  },
  {
    id: 'pushb-crossover', phase: 'work', mode: 'reps', name: 'Cable Crossover Low-to-High Fly',
    prescription: '3 x 12-15', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Upper / inner chest',
  },
  {
    id: 'pushb-lateral', phase: 'work', mode: 'reps', name: 'Standing Lateral Raise Machine',
    prescription: '4 x 12-15', sets: 4, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Side delts',
  },
  {
    id: 'pushb-dips', phase: 'work', mode: 'reps', name: 'Dip Station',
    prescription: '3 x 10-12', sets: 3, estWorkSec: 35, restSec: 90, restKind: 'compound',
    notes: 'Assisted machine or bodyweight - lean forward to bias chest',
    tags: ['hypertrophy', 'strength'], focus: 'Chest, triceps, front delts',
  },
  {
    id: 'pushb-pushdown', phase: 'work', mode: 'reps', name: 'Cable Triceps Pushdown',
    prescription: '3 x 12-15', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Triceps',
  },
  {
    id: 'pushb-chest-stretch', phase: 'cooldown', mode: 'timed', name: 'Doorway Chest Stretch',
    steps: perSide(30), notes: 'Forearm on doorframe at shoulder height, rotate body away',
  },
  {
    id: 'pushb-triceps-stretch', phase: 'cooldown', mode: 'timed', name: 'Overhead Triceps Stretch',
    steps: perSide(30), notes: 'One arm bent overhead, other hand pulls elbow back',
  },
  {
    id: 'pushb-shoulder-stretch', phase: 'cooldown', mode: 'timed', name: 'Cross-body Shoulder Stretch',
    steps: perSide(30), notes: 'Pull one arm across the chest - rear delts',
  },
  {
    id: 'pushb-run', phase: 'work', mode: 'timed', name: 'Easy Run',
    steps: [{ label: '20-30 min, conversational pace', durationSec: 1500 }],
    notes: 'Active recovery - keeps the aerobic base up without adding lower-body fatigue for tomorrow\'s pull day',
  },
];
