import type { BlockPhase, DayKey, DayProgram, Program, RestKind } from '../data/types';

const STORAGE_KEY = 'gym.program.v1';
const ALL_DAY_KEYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};

export function getDay(program: Program, key: DayKey): DayProgram {
  const day = program.days.find((d) => d.key === key);
  if (!day) throw new Error(`Unknown day key: ${key}`);
  return day;
}

/** A fresh, empty program: every day present as a rest day with no blocks, ready to edit. */
export function createBlankProgram(name = 'My Program'): Program {
  return {
    title: name,
    days: ALL_DAY_KEYS.map((key) => ({
      key,
      label: DAY_LABELS[key],
      sessionName: 'Rest',
      blocks: [],
    })),
  };
}

let idCounter = 0;
/** Stable id for a newly created block/exercise. Uses crypto.randomUUID where available (every
 * modern browser), falling back to a counter so the app still works in an environment without it. */
export function newBlockId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  idCounter += 1;
  return `block-${Date.now()}-${idCounter}`;
}

export function loadProgram(): Program | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    const error = validateProgram(data);
    if (error) {
      console.warn('Stored program failed validation, ignoring:', error);
      return null;
    }
    return data as Program;
  } catch {
    return null;
  }
}

export function saveProgram(program: Program): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(program));
}

export function clearProgram(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportProgramJson(program: Program): string {
  return JSON.stringify(program, null, 2);
}

export interface ImportResult {
  ok: boolean;
  program?: Program;
  error?: string;
}

/** Parses and validates a program JSON file. Never throws, never returns a partially-loaded
 * program - either the whole thing is well-formed or the caller gets a readable error and the
 * existing active program is left untouched. */
export function importProgramJson(json: string): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch (e) {
    return { ok: false, error: `Not valid JSON: ${(e as Error).message}` };
  }
  const error = validateProgram(data);
  if (error) return { ok: false, error };
  return { ok: true, program: data as Program };
}

const PHASES: BlockPhase[] = ['warmup', 'work', 'cooldown'];
const REST_KINDS: RestKind[] = ['compound', 'isolation', 'unilateral', 'hold', 'superset', 'none'];
const MODES = ['timed', 'reps', 'unilateral', 'hold', 'maxtime', 'superset', 'tiered'];

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/** Returns a human-readable error, or null if `data` is a well-formed Program. Deliberately a
 * plain hand-written walk rather than a schema library - the shape is small and stable, and this
 * keeps the project dependency-free. */
export function validateProgram(data: unknown): string | null {
  if (!isObj(data)) return 'Expected a JSON object at the top level.';
  if (typeof data.title !== 'string' || !data.title.trim()) return 'Missing or empty "title".';
  if (!Array.isArray(data.days)) return 'Missing "days" array.';

  const seenKeys = new Set<string>();
  for (let i = 0; i < data.days.length; i += 1) {
    const day = data.days[i];
    if (!isObj(day)) return `Day ${i + 1}: expected an object.`;
    if (typeof day.key !== 'string' || !ALL_DAY_KEYS.includes(day.key as DayKey)) {
      return `Day ${i + 1}: "key" must be one of ${ALL_DAY_KEYS.join(', ')}.`;
    }
    if (seenKeys.has(day.key)) return `Day ${i + 1}: duplicate day key "${day.key}".`;
    seenKeys.add(day.key);
    if (typeof day.label !== 'string' || !day.label.trim()) return `Day "${day.key}": missing "label".`;
    if (typeof day.sessionName !== 'string') return `Day "${day.key}": missing "sessionName".`;
    if (!Array.isArray(day.blocks)) return `Day "${day.key}": "blocks" must be an array.`;
    for (let b = 0; b < day.blocks.length; b += 1) {
      const err = validateBlock(day.blocks[b], `Day "${day.key}", exercise ${b + 1}`);
      if (err) return err;
    }
  }
  return null;
}

function validateBlock(block: unknown, where: string): string | null {
  if (!isObj(block)) return `${where}: expected an object.`;
  if (typeof block.id !== 'string' || !block.id) return `${where}: missing "id".`;
  if (typeof block.phase !== 'string' || !PHASES.includes(block.phase as BlockPhase)) {
    return `${where}: "phase" must be one of ${PHASES.join(', ')}.`;
  }
  if (typeof block.name !== 'string' || !block.name.trim()) return `${where}: missing "name".`;
  if (typeof block.mode !== 'string' || !MODES.includes(block.mode)) {
    return `${where}: "mode" must be one of ${MODES.join(', ')}.`;
  }

  const num = (field: string): string | null =>
    typeof (block as Record<string, unknown>)[field] !== 'number' ? `${where}: "${field}" must be a number.` : null;
  const restKindOk = (): string | null =>
    REST_KINDS.includes(block.restKind as RestKind) ? null : `${where}: "restKind" must be one of ${REST_KINDS.join(', ')}.`;

  switch (block.mode) {
    case 'timed':
      if (!Array.isArray(block.steps) || block.steps.length === 0) return `${where}: "steps" must be a non-empty array.`;
      for (const s of block.steps) {
        if (!isObj(s) || typeof s.label !== 'string' || typeof s.durationSec !== 'number') {
          return `${where}: each timed step needs a "label" and numeric "durationSec".`;
        }
      }
      return null;
    case 'reps':
    case 'unilateral':
    case 'maxtime':
      return num('sets') || num('estWorkSec') || num('restSec') || restKindOk();
    case 'hold':
      return num('sets') || num('holdSec') || num('restSec') || restKindOk();
    case 'superset': {
      const e1 = num('rounds') || num('switchSec') || num('restSec') || restKindOk();
      if (e1) return e1;
      for (const key of ['exerciseA', 'exerciseB'] as const) {
        const ex = block[key];
        if (!isObj(ex) || typeof ex.name !== 'string' || (ex.kind !== 'reps' && ex.kind !== 'hold')) {
          return `${where}: "${key}" needs a "name" and kind of "reps" or "hold".`;
        }
      }
      return null;
    }
    case 'tiered':
      return block.barExercise === 'pullup' || block.barExercise === 'chinup'
        ? null
        : `${where}: "barExercise" must be "pullup" or "chinup".`;
    default:
      return null;
  }
}
