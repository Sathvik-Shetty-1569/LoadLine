import type { Block } from './types';
import { perSide } from './helpers';

export const legsBBlocks: Block[] = [
  {
    id: 'legsb-legswings', phase: 'warmup', mode: 'timed', name: 'Leg Swings',
    steps: [
      { label: 'Front-to-back (both legs)', durationSec: 30 },
      { label: 'Side-to-side (both legs)', durationSec: 30 },
    ],
    notes: 'Hip mobility',
  },
  {
    id: 'legsb-squats', phase: 'warmup', mode: 'reps', name: 'Bodyweight Squats',
    prescription: '1 x 15', sets: 1, estWorkSec: 30, restSec: 20, restKind: 'isolation',
    notes: 'General activation',
  },
  {
    id: 'legsb-lunges', phase: 'warmup', mode: 'unilateral', name: 'Walking Lunges',
    prescription: '1 x 10/leg', sets: 1, estWorkSec: 35, restSec: 20, restKind: 'unilateral',
    notes: 'Controlled, knee tracking over toes',
  },
  {
    id: 'legsb-rampup', phase: 'warmup', mode: 'reps', name: 'Ramp-Up Sets - Smith Machine RDL',
    prescription: '3 x 6 (build to working weight)', sets: 3, estWorkSec: 35, restSec: 75, restKind: 'compound',
    notes: 'Increase the load each set - stay well short of failure, this is just priming the pattern',
  },
  {
    id: 'legsb-smithrdl', phase: 'work', mode: 'reps', name: 'Smith Machine RDL',
    prescription: '4 x 10-12', sets: 4, estWorkSec: 40, restSec: 120, restKind: 'compound',
    notes: '3-sec eccentric, feel the hamstring stretch',
    tags: ['strength', 'hypertrophy'], focus: 'Hamstrings, glutes',
  },
  {
    id: 'legsb-legpress', phase: 'work', mode: 'reps', name: 'Leg Press, feet high',
    prescription: '3 x 12-15', sets: 3, estWorkSec: 35, restSec: 90, restKind: 'compound',
    tags: ['hypertrophy'], focus: 'Hamstrings, glutes',
  },
  {
    id: 'legsb-legext', phase: 'work', mode: 'reps', name: 'Leg Extension',
    prescription: '3 x 15-20', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Quads',
  },
  {
    id: 'legsb-calf', phase: 'work', mode: 'reps', name: 'Calf Raise on Leg Press',
    prescription: '4 x 15-20', sets: 4, estWorkSec: 30, restSec: 45, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Calves',
  },
  {
    id: 'legsb-backext', phase: 'work', mode: 'reps', name: 'Back Extension, higher reps',
    prescription: '3 x 15-20', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Lower back, glutes, hamstrings',
  },
  {
    id: 'legsb-abductor', phase: 'work', mode: 'reps', name: 'Abductor Machine',
    prescription: '3 x 15-20', sets: 3, estWorkSec: 25, restSec: 45, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Glute medius, hip abductors',
  },
  {
    id: 'legsb-quad-stretch', phase: 'cooldown', mode: 'timed', name: 'Standing Quad Stretch',
    steps: perSide(30), notes: 'Heel to glute, knees together, hips forward',
  },
  {
    id: 'legsb-ham-stretch', phase: 'cooldown', mode: 'timed', name: 'Seated Hamstring Stretch',
    steps: perSide(30), notes: 'Leg extended, hinge from hips toward toes',
  },
  {
    id: 'legsb-calf-stretch', phase: 'cooldown', mode: 'timed', name: 'Wall Calf Stretch',
    steps: [
      { label: 'Left, knee straight', durationSec: 30 },
      { label: 'Right, knee straight', durationSec: 30 },
      { label: 'Left, knee softened', durationSec: 30 },
      { label: 'Right, knee softened', durationSec: 30 },
    ],
    notes: 'Gastrocnemius, then soleus',
  },
  {
    id: 'legsb-hipflexor-stretch', phase: 'cooldown', mode: 'timed', name: 'Kneeling Hip Flexor Stretch',
    steps: perSide(30), notes: 'Back knee down, front knee bent 90 degrees, push hips forward',
  },
];
