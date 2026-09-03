import type { Program } from './types';
import { program as hypertrophy7kgV7 } from './program';

export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  /** Returns a fresh, independent copy - editing a loaded template must never mutate the
   * pristine module-level source, or "reload the template" would stop meaning what it says. */
  build: () => Program;
}

export const templates: ProgramTemplate[] = [
  {
    id: 'hypertrophy-7kg-v7',
    name: hypertrophy7kgV7.title,
    description: 'Upper/Lower x2 per week built around 2 running days. Dumbbells + doorway bar, 4 lifting days.',
    build: () => structuredClone(hypertrophy7kgV7),
  },
];
