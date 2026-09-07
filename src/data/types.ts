// Core data model for the 7kg Hypertrophy Program (v7).
// A `Block` is one row-group from the Notion tables (e.g. "DB Romanian Deadlift").
// `compileSession.ts` flattens Blocks into a linear list of `Step`s that the
// Session screen plays through top to bottom.

export type RestKind = 'compound' | 'isolation' | 'unilateral' | 'hold' | 'superset' | 'none';

export type BlockPhase = 'warmup' | 'work' | 'cooldown';

/** A single timed sub-step inside a warmup/cooldown block, e.g. one side of a stretch. */
export interface TimedSubStep {
  label: string;
  durationSec: number;
}

export interface BaseBlock {
  id: string;
  phase: BlockPhase;
  name: string;
  /**
   * Template-only: the seconds-from-session-start printed on the source document's clock column.
   * Authored programs don't have this - their schedule is derived from `estWorkSec`/`holdSec`/rest
   * by `lib/schedule.ts`. Kept on the shipped v7 template purely so tests can assert the derived
   * schedule still reproduces the original Notion timings.
   */
  sourceClockSec?: [number, number];
  notes?: string;
  /** Link to a form/technique video. When unset the UI falls back to a YouTube search for the
   * exercise name (see `lib/exerciseVideo.ts`). */
  videoUrl?: string;
  /** What the movement trains - free strings, but the editor offers a common set
   * (cardio, hypertrophy, strength, power, mobility, endurance, core, balance). Shown as chips. */
  tags?: string[];
  /** One-line "what it targets", e.g. "Hamstrings, glutes". Shown above the prescription. */
  focus?: string;
}

/** Warmup or cooldown: always auto-timed, no manual advance. */
export interface TimedBlock extends BaseBlock {
  mode: 'timed';
  steps: TimedSubStep[];
  /** See RepsBlock.figure - override for the auto-resolved diagram. */
  figure?: string | null;
}

/** Standard reps-based working set: manual "Set done" tap per set, auto rest after each set. */
export interface RepsBlock extends BaseBlock {
  mode: 'reps';
  prescription: string;
  sets: number;
  /** Estimated seconds for ONE set - a schedule/pace hint only. Never enforced: the set still
   * ends on a manual tap, per the program's 0-2 RIR rule. */
  estWorkSec: number;
  restSec: number;
  restKind: RestKind;
  toFailureLastSet?: boolean;
  image?: string | null;
  /**
   * Explicit override for which archetype diagram (`src/exercises/archetypes.ts`) to show.
   * Optional: when unset, the render layer resolves one automatically from the exercise's name
   * (`src/exercises/resolve.ts`) - this field exists only so the builder can correct a guess that
   * doesn't fit a user's own exercise name. `image`, if set, always wins over both.
   */
  figure?: string | null;
}

/** Unilateral reps work: manual tap per side, one rest after both sides. */
export interface UnilateralBlock extends BaseBlock {
  mode: 'unilateral';
  prescription: string;
  sets: number;
  /** Estimated seconds for ONE side of ONE set - hint only, see RepsBlock.estWorkSec. */
  estWorkSec: number;
  restSec: number;
  restKind: RestKind;
  toFailureLastSet?: boolean;
  image?: string | null;
  /**
   * Explicit override for which archetype diagram (`src/exercises/archetypes.ts`) to show.
   * Optional: when unset, the render layer resolves one automatically from the exercise's name
   * (`src/exercises/resolve.ts`) - this field exists only so the builder can correct a guess that
   * doesn't fit a user's own exercise name. `image`, if set, always wins over both.
   */
  figure?: string | null;
}

/** A prescribed-duration hold (superman, farmer's carry): auto countdown per set, then rest. */
export interface HoldBlock extends BaseBlock {
  mode: 'hold';
  prescription: string;
  sets: number;
  holdSec: number;
  restSec: number;
  restKind: RestKind;
  image?: string | null;
  /**
   * Explicit override for which archetype diagram (`src/exercises/archetypes.ts`) to show.
   * Optional: when unset, the render layer resolves one automatically from the exercise's name
   * (`src/exercises/resolve.ts`) - this field exists only so the builder can correct a guess that
   * doesn't fit a user's own exercise name. `image`, if set, always wins over both.
   */
  figure?: string | null;
}

/** Max-effort timed hold (dead hang): counts up, manual stop, logs the time. */
export interface MaxTimeBlock extends BaseBlock {
  mode: 'maxtime';
  prescription: string;
  sets: number;
  /** Expected max-effort duration - a schedule estimate only. The actual attempt is unbounded
   * and stops on a manual tap; this never cuts it short. */
  estWorkSec: number;
  restSec: number;
  restKind: RestKind;
  image?: string | null;
  /**
   * Explicit override for which archetype diagram (`src/exercises/archetypes.ts`) to show.
   * Optional: when unset, the render layer resolves one automatically from the exercise's name
   * (`src/exercises/resolve.ts`) - this field exists only so the builder can correct a guess that
   * doesn't fit a user's own exercise name. `image`, if set, always wins over both.
   */
  figure?: string | null;
}

export interface SupersetExercise {
  name: string;
  prescription: string;
  notes?: string;
  image?: string | null;
  /** See BaseBlock.videoUrl. */
  videoUrl?: string;
  /** See BaseBlock.tags. */
  tags?: string[];
  /** See BaseBlock.focus. */
  focus?: string;
  /** See RepsBlock.figure - override for the auto-resolved diagram. */
  figure?: string | null;
  /** 'reps' = manual tap; 'hold' = auto countdown for holdSec. */
  kind: 'reps' | 'hold';
  /** Required when kind is 'reps' - schedule estimate only, see RepsBlock.estWorkSec. */
  estWorkSec?: number;
  holdSec?: number;
  amrap?: boolean;
}

/** Two exercises alternated for N rounds: manual tap (or auto hold) + auto switch + rest. */
export interface SupersetBlock extends BaseBlock {
  mode: 'superset';
  rounds: number;
  switchSec: number;
  restSec: number;
  restKind: RestKind;
  exerciseA: SupersetExercise;
  exerciseB: SupersetExercise;
}

/** Pull-up/chin-up block whose actual prescription depends on the stored tier (1-4). */
export interface TieredBlock extends BaseBlock {
  mode: 'tiered';
  barExercise: 'pullup' | 'chinup';
}

export type Block =
  | TimedBlock
  | RepsBlock
  | UnilateralBlock
  | HoldBlock
  | MaxTimeBlock
  | SupersetBlock
  | TieredBlock;

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface DayProgram {
  key: DayKey;
  label: string;
  sessionName: string;
  /**
   * Optional override for the displayed target, in minutes. Normally omitted - the target is
   * derived from the blocks by `lib/schedule.ts`. Only used where the authored target is
   * intentionally approximate and doesn't match a literal content sum (e.g. Sunday's "optional
   * 10-min stretch" lists ~7 min of named stretches - it's a loose suggestion, not a schedule).
   */
  targetMinutesOverride?: number | null;
  blocks: Block[];
}

export interface Program {
  title: string;
  days: DayProgram[];
}

export type PullupTier = 1 | 2 | 3 | 4;

// ---- Flattened runtime steps (produced by compileSession) ----

export type StepKind =
  | 'timed'      // auto countdown, no set concept
  | 'work'       // manual "done" tap (reps or one side of unilateral)
  | 'hold'       // auto countdown hold (superman etc.)
  | 'maxtime'    // manual start/stop, counts up
  | 'switch'     // auto countdown, superset transition
  | 'rest';      // auto countdown

export interface Step {
  id: string;
  blockId: string;
  blockName: string;
  phase: BlockPhase;
  kind: StepKind;
  label: string;
  /** Sub-label, e.g. "Set 2 of 4", "Left side", "Exercise B" */
  detail?: string;
  notes?: string;
  image?: string | null;
  /** Explicit figure override carried from the block; the render layer falls back to resolving
   * one from `label` when this is unset. */
  figure?: string | null;
  prescription?: string;
  /** Carried from the block - a form/technique video link (see `lib/exerciseVideo.ts`). */
  videoUrl?: string;
  /** Carried from the block - training-quality / target chips. */
  tags?: string[];
  /** Carried from the block - one-line "what it targets". */
  focus?: string;
  /** Planned duration in seconds. For 'work'/'maxtime' this is a hint, not enforced. */
  durationSec: number;
  restKind?: RestKind;
  isLastSet?: boolean;
  toFailure?: boolean;
}
