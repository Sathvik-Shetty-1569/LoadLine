import type { Block } from './types';
import { perSide } from './helpers';

export const legsABlocks: Block[] = [
  {
    id: 'legsa-legswings', phase: 'warmup', mode: 'timed', name: 'Leg Swings',
    steps: [
      { label: 'Front-to-back (both legs)', durationSec: 30 },
      { label: 'Side-to-side (both legs)', durationSec: 30 },
    ],
    notes: 'Hip mobility',
  },
  {
    id: 'legsa-squats', phase: 'warmup', mode: 'reps', name: 'Bodyweight Squats',
    prescription: '1 x 15', sets: 1, estWorkSec: 30, restSec: 20, restKind: 'isolation',
    notes: 'General activation',
  },
  {
    id: 'legsa-lunges', phase: 'warmup', mode: 'unilateral', name: 'Walking Lunges',
    prescription: '1 x 10/leg', sets: 1, estWorkSec: 35, restSec: 20, restKind: 'unilateral',
    notes: 'Controlled, knee tracking over toes',
  },
  {
    id: 'legsa-rampup', phase: 'warmup', mode: 'reps', name: 'Ramp-Up Sets - Hack Squat',
    prescription: '3 x 6 (build to working weight)', sets: 3, estWorkSec: 35, restSec: 75, restKind: 'compound',
    notes: 'Increase the load each set - stay well short of failure, this is just priming the pattern',
  },
  {
    id: 'legsa-hacksquat', phase: 'work', mode: 'reps', name: 'Hack Squat',
    prescription: '4 x 8-10', sets: 4, estWorkSec: 40, restSec: 120, restKind: 'compound',
    tags: ['strength', 'hypertrophy'], focus: 'Quads, glutes',
  },
  {
    id: 'legsa-legpress', phase: 'work', mode: 'reps', name: 'Leg Press',
    prescription: '3 x 10-12', sets: 3, estWorkSec: 35, restSec: 90, restKind: 'compound',
    tags: ['hypertrophy'], focus: 'Quads, glutes, hamstrings',
  },
  {
    id: 'legsa-legext', phase: 'work', mode: 'reps', name: 'Leg Extension',
    prescription: '3 x 12-15', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Quads',
  },
  {
    id: 'legsa-calf', phase: 'work', mode: 'reps', name: 'Calf Raise on Leg Press',
    prescription: '4 x 15-20', sets: 4, estWorkSec: 30, restSec: 45, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Calves',
  },
  {
    id: 'legsa-backext', phase: 'work', mode: 'reps', name: 'Back Extension',
    prescription: '3 x 12-15', sets: 3, estWorkSec: 30, restSec: 60, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Lower back, glutes, hamstrings',
  },
  {
    id: 'legsa-abductor', phase: 'work', mode: 'reps', name: 'Abductor Machine',
    prescription: '2 x 15', sets: 2, estWorkSec: 25, restSec: 45, restKind: 'isolation',
    tags: ['hypertrophy'], focus: 'Glute medius, hip abductors',
  },
  {
    id: 'legsa-quad-stretch', phase: 'cooldown', mode: 'timed', name: 'Standing Quad Stretch',
    steps: perSide(30), notes: 'Heel to glute, knees together, hips forward',
  },
  {
    id: 'legsa-ham-stretch', phase: 'cooldown', mode: 'timed', name: 'Seated Hamstring Stretch',
    steps: perSide(30), notes: 'Leg extended, hinge from hips toward toes',
  },
  {
    id: 'legsa-calf-stretch', phase: 'cooldown', mode: 'timed', name: 'Wall Calf Stretch',
    steps: [
      { label: 'Left, knee straight', durationSec: 30 },
      { label: 'Right, knee straight', durationSec: 30 },
      { label: 'Left, knee softened', durationSec: 30 },
      { label: 'Right, knee softened', durationSec: 30 },
    ],
    notes: 'Gastrocnemius, then soleus',
  },
  {
    id: 'legsa-hipflexor-stretch', phase: 'cooldown', mode: 'timed', name: 'Kneeling Hip Flexor Stretch',
    steps: perSide(30), notes: 'Back knee down, front knee bent 90 degrees, push hips forward',
  },
];
