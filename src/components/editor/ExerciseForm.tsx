import { useState } from 'react';
import type { Block, BlockPhase, RestKind, TimedSubStep } from '../../data/types';
import { newBlockId } from '../../lib/programStore';
import { blockDurationSec } from '../../lib/schedule';
import { TimedStepsEditor } from './TimedStepsEditor';
import { FigurePicker } from './FigurePicker';

type ExerciseKind = 'timed' | 'reps' | 'unilateral' | 'hold' | 'maxtime' | 'superset';

interface SupersetExerciseDraft {
  name: string;
  prescription: string;
  notes: string;
  kind: 'reps' | 'hold';
  estWorkSec: number;
  holdSec: number;
  amrap: boolean;
  /** '' means auto-resolve from name - see FigurePicker. */
  figure: string;
  videoUrl: string;
  tags: string[];
  focus: string;
}

/** Offered as one-tap toggles in the form; the user can still type any other tag. */
const COMMON_TAGS = ['cardio', 'hypertrophy', 'strength', 'power', 'mobility', 'endurance', 'core', 'balance'];

function toggleTag(tags: string[], tag: string): string[] {
  return tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
}

/** Split "a, b ,c" into ['a','b','c'] and back, for the free-text "other tags" field. */
function parseTagList(raw: string): string[] {
  return raw.split(',').map((t) => t.trim()).filter(Boolean);
}

interface Draft {
  kind: ExerciseKind;
  phase: BlockPhase;
  name: string;
  notes: string;
  /** '' means auto-resolve from name - see FigurePicker. */
  figure: string;
  videoUrl: string;
  tags: string[];
  focus: string;
  prescription: string;
  sets: number;
  estWorkSec: number;
  holdSec: number;
  restSec: number;
  restKind: RestKind;
  toFailureLastSet: boolean;
  steps: TimedSubStep[];
  rounds: number;
  switchSec: number;
  exerciseA: SupersetExerciseDraft;
  exerciseB: SupersetExerciseDraft;
}

const KIND_LABELS: Record<ExerciseKind, string> = {
  reps: 'Sets & reps',
  unilateral: 'Sets & reps, each side',
  hold: 'Timed hold',
  maxtime: 'Max-effort hold',
  superset: 'Superset pair',
  timed: 'Warm-up / stretch',
};

const REST_KIND_LABELS: Record<RestKind, string> = {
  compound: 'Compound - never shortened',
  isolation: 'Isolation - may be trimmed if you fall behind',
  unilateral: 'Each side - never shortened',
  hold: 'Hold - never shortened',
  superset: 'Superset pair - never shortened',
  none: 'None',
};

const PHASE_LABELS: Record<BlockPhase, string> = {
  warmup: 'Warm-up',
  work: 'Working set',
  cooldown: 'Cool-down',
};

function blankExercise(kind: 'reps' | 'hold' = 'reps'): SupersetExerciseDraft {
  return {
    name: '', prescription: '12-15', notes: '', kind, estWorkSec: 30, holdSec: 30, amrap: false,
    figure: '', videoUrl: '', tags: [], focus: '',
  };
}

function draftFromBlock(block: Block | null): Draft {
  const base: Draft = {
    kind: 'reps', phase: 'work', name: '', notes: '', figure: '', videoUrl: '', tags: [], focus: '',
    prescription: '3 x 12-15', sets: 3, estWorkSec: 30, holdSec: 30, restSec: 60, restKind: 'isolation',
    toFailureLastSet: false, steps: [{ label: 'Go', durationSec: 30 }],
    rounds: 3, switchSec: 15, exerciseA: blankExercise('reps'), exerciseB: blankExercise('reps'),
  };
  if (!block) return base;

  base.phase = block.phase;
  base.name = block.name;
  base.notes = block.notes ?? '';
  base.videoUrl = block.videoUrl ?? '';
  base.tags = block.tags ?? [];
  base.focus = block.focus ?? '';

  switch (block.mode) {
    case 'timed':
      base.kind = 'timed';
      base.figure = block.figure ?? '';
      base.steps = block.steps.map((s) => ({ ...s }));
      return base;
    case 'reps':
    case 'unilateral':
      base.kind = block.mode;
      base.figure = block.figure ?? '';
      base.prescription = block.prescription;
      base.sets = block.sets;
      base.estWorkSec = block.estWorkSec;
      base.restSec = block.restSec;
      base.restKind = block.restKind;
      base.toFailureLastSet = !!block.toFailureLastSet;
      return base;
    case 'hold':
      base.kind = 'hold';
      base.figure = block.figure ?? '';
      base.prescription = block.prescription;
      base.sets = block.sets;
      base.holdSec = block.holdSec;
      base.restSec = block.restSec;
      base.restKind = block.restKind;
      return base;
    case 'maxtime':
      base.kind = 'maxtime';
      base.figure = block.figure ?? '';
      base.prescription = block.prescription;
      base.sets = block.sets;
      base.estWorkSec = block.estWorkSec;
      base.restSec = block.restSec;
      base.restKind = block.restKind;
      return base;
    case 'superset':
      base.kind = 'superset';
      base.rounds = block.rounds;
      base.switchSec = block.switchSec;
      base.restSec = block.restSec;
      base.restKind = block.restKind;
      base.exerciseA = {
        ...blankExercise(), ...block.exerciseA, notes: block.exerciseA.notes ?? '', figure: block.exerciseA.figure ?? '',
        videoUrl: block.exerciseA.videoUrl ?? '', tags: block.exerciseA.tags ?? [], focus: block.exerciseA.focus ?? '',
      };
      base.exerciseB = {
        ...blankExercise(), ...block.exerciseB, notes: block.exerciseB.notes ?? '', figure: block.exerciseB.figure ?? '',
        videoUrl: block.exerciseB.videoUrl ?? '', tags: block.exerciseB.tags ?? [], focus: block.exerciseB.focus ?? '',
      };
      return base;
    case 'tiered':
      // Not editable in the builder (v7-specific) - shouldn't reach here, but fall back safely.
      return base;
    default:
      return base;
  }
}

/** Normalise the shared info fields: blank text -> undefined, empty tag list -> undefined, so a
 * saved block round-trips cleanly through export/import. */
function infoFields(d: { videoUrl: string; tags: string[]; focus: string }) {
  return {
    videoUrl: d.videoUrl.trim() || undefined,
    tags: d.tags.length ? d.tags : undefined,
    focus: d.focus.trim() || undefined,
  };
}

function draftToBlock(draft: Draft, id: string): Block {
  const common = {
    id, phase: draft.phase, name: draft.name.trim() || 'Untitled exercise',
    notes: draft.notes.trim() || undefined, figure: draft.figure || undefined,
    ...infoFields(draft),
  };
  switch (draft.kind) {
    case 'timed':
      return { ...common, mode: 'timed', steps: draft.steps };
    case 'reps':
      return {
        ...common, mode: 'reps', prescription: draft.prescription, sets: draft.sets,
        estWorkSec: draft.estWorkSec, restSec: draft.restSec, restKind: draft.restKind,
        toFailureLastSet: draft.toFailureLastSet,
      };
    case 'unilateral':
      return {
        ...common, mode: 'unilateral', prescription: draft.prescription, sets: draft.sets,
        estWorkSec: draft.estWorkSec, restSec: draft.restSec, restKind: draft.restKind,
        toFailureLastSet: draft.toFailureLastSet,
      };
    case 'hold':
      return {
        ...common, mode: 'hold', prescription: draft.prescription, sets: draft.sets,
        holdSec: draft.holdSec, restSec: draft.restSec, restKind: draft.restKind,
      };
    case 'maxtime':
      return {
        ...common, mode: 'maxtime', prescription: draft.prescription, sets: draft.sets,
        estWorkSec: draft.estWorkSec, restSec: draft.restSec, restKind: draft.restKind,
      };
    case 'superset':
      return {
        ...common, mode: 'superset', rounds: draft.rounds, switchSec: draft.switchSec,
        restSec: draft.restSec, restKind: draft.restKind,
        exerciseA: { ...draft.exerciseA, notes: draft.exerciseA.notes.trim() || undefined, figure: draft.exerciseA.figure || undefined, ...infoFields(draft.exerciseA) },
        exerciseB: { ...draft.exerciseB, notes: draft.exerciseB.notes.trim() || undefined, figure: draft.exerciseB.figure || undefined, ...infoFields(draft.exerciseB) },
      };
  }
}

/** Shared "info" inputs: form-video link, purpose/target tags, and a one-line target note.
 * Used for a plain exercise and for each half of a superset. */
function InfoFieldset({
  videoUrl, tags, focus, onChange,
}: {
  videoUrl: string;
  tags: string[];
  focus: string;
  onChange: (p: { videoUrl?: string; tags?: string[]; focus?: string }) => void;
}) {
  const custom = tags.filter((t) => !COMMON_TAGS.includes(t));
  const [otherText, setOtherText] = useState(custom.join(', '));

  function setCommon(tag: string) {
    onChange({ tags: [...toggleTag(tags.filter((t) => COMMON_TAGS.includes(t)), tag), ...custom] });
  }
  function setOther(text: string) {
    setOtherText(text);
    onChange({ tags: [...tags.filter((t) => COMMON_TAGS.includes(t)), ...parseTagList(text)] });
  }

  return (
    <div className="exercise-form__info">
      <div className="exercise-form__tag-toggles">
        <span className="exercise-form__tag-label">Info tags</span>
        {COMMON_TAGS.map((t) => (
          <button
            key={t}
            type="button"
            className={`exercise-form__tag${tags.includes(t) ? ' exercise-form__tag--on' : ''}`}
            aria-pressed={tags.includes(t)}
            onClick={() => setCommon(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <label className="exercise-form__full">
        Other tags (comma-separated)
        <input type="text" value={otherText} onChange={(e) => setOther(e.target.value)} placeholder="e.g. grip, explosive" />
      </label>
      <label className="exercise-form__full">
        Targets (shown as "Targets: ...")
        <input type="text" value={focus} onChange={(e) => onChange({ focus: e.target.value })} placeholder="e.g. Hamstrings, glutes" />
      </label>
      <label className="exercise-form__full">
        Demo video URL (optional - blank falls back to a YouTube search)
        <input type="url" value={videoUrl} onChange={(e) => onChange({ videoUrl: e.target.value })} placeholder="https://..." />
      </label>
    </div>
  );
}

interface Props {
  block: Block | null;
  onSave: (block: Block) => void;
  onCancel: () => void;
}

export function ExerciseForm({ block, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<Draft>(() => draftFromBlock(block));

  function patch(p: Partial<Draft>) {
    setDraft((d) => ({ ...d, ...p }));
  }
  function patchExercise(which: 'exerciseA' | 'exerciseB', p: Partial<SupersetExerciseDraft>) {
    setDraft((d) => ({ ...d, [which]: { ...d[which], ...p } }));
  }

  const previewBlock = draftToBlock(draft, block?.id ?? 'preview');
  const previewSec = blockDurationSec(previewBlock, 2);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(draftToBlock(draft, block?.id ?? newBlockId()));
  }

  return (
    <form className="exercise-form" onSubmit={handleSubmit}>
      <div className="exercise-form__row">
        <label>
          Type
          <select value={draft.kind} onChange={(e) => patch({ kind: e.target.value as ExerciseKind })}>
            {(Object.keys(KIND_LABELS) as ExerciseKind[]).map((k) => (
              <option key={k} value={k}>{KIND_LABELS[k]}</option>
            ))}
          </select>
        </label>
        <label>
          Section
          <select value={draft.phase} onChange={(e) => patch({ phase: e.target.value as BlockPhase })}>
            {(Object.keys(PHASE_LABELS) as BlockPhase[]).map((p) => (
              <option key={p} value={p}>{PHASE_LABELS[p]}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="exercise-form__full">
        Name
        <input type="text" value={draft.name} onChange={(e) => patch({ name: e.target.value })} placeholder="e.g. DB Romanian Deadlift" required />
      </label>

      {draft.kind !== 'superset' && (
        <FigurePicker name={draft.name} figure={draft.figure} onChange={(figure) => patch({ figure })} />
      )}

      {draft.kind !== 'superset' && (
        <InfoFieldset videoUrl={draft.videoUrl} tags={draft.tags} focus={draft.focus} onChange={patch} />
      )}

      {draft.kind === 'timed' && (
        <TimedStepsEditor steps={draft.steps} onChange={(steps) => patch({ steps })} />
      )}

      {(draft.kind === 'reps' || draft.kind === 'unilateral' || draft.kind === 'maxtime') && (
        <>
          <div className="exercise-form__row">
            <label>
              Prescription (shown to you)
              <input type="text" value={draft.prescription} onChange={(e) => patch({ prescription: e.target.value })} placeholder="3 x 12-15" />
            </label>
            <label>
              Sets
              <input type="number" min={1} value={draft.sets} onChange={(e) => patch({ sets: Number(e.target.value) || 1 })} />
            </label>
          </div>
          <div className="exercise-form__row">
            <label>
              {draft.kind === 'unilateral' ? 'Est. seconds per side' : draft.kind === 'maxtime' ? 'Expected max-effort seconds' : 'Est. seconds per set'}
              <input type="number" min={1} value={draft.estWorkSec} onChange={(e) => patch({ estWorkSec: Number(e.target.value) || 0 })} />
            </label>
            <label>
              Rest (sec)
              <input type="number" min={0} value={draft.restSec} onChange={(e) => patch({ restSec: Number(e.target.value) || 0 })} />
            </label>
          </div>
          <label className="exercise-form__full">
            Rest type
            <select value={draft.restKind} onChange={(e) => patch({ restKind: e.target.value as RestKind })}>
              {(Object.keys(REST_KIND_LABELS) as RestKind[]).map((k) => (
                <option key={k} value={k}>{REST_KIND_LABELS[k]}</option>
              ))}
            </select>
          </label>
          {draft.kind !== 'maxtime' && (
            <label className="exercise-form__checkbox">
              <input type="checkbox" checked={draft.toFailureLastSet} onChange={(e) => patch({ toFailureLastSet: e.target.checked })} />
              Last set is to true failure
            </label>
          )}
        </>
      )}

      {draft.kind === 'hold' && (
        <>
          <div className="exercise-form__row">
            <label>
              Prescription (shown to you)
              <input type="text" value={draft.prescription} onChange={(e) => patch({ prescription: e.target.value })} placeholder="3 x 30-45 sec" />
            </label>
            <label>
              Sets
              <input type="number" min={1} value={draft.sets} onChange={(e) => patch({ sets: Number(e.target.value) || 1 })} />
            </label>
          </div>
          <div className="exercise-form__row">
            <label>
              Hold (sec)
              <input type="number" min={1} value={draft.holdSec} onChange={(e) => patch({ holdSec: Number(e.target.value) || 0 })} />
            </label>
            <label>
              Rest (sec)
              <input type="number" min={0} value={draft.restSec} onChange={(e) => patch({ restSec: Number(e.target.value) || 0 })} />
            </label>
          </div>
          <label className="exercise-form__full">
            Rest type
            <select value={draft.restKind} onChange={(e) => patch({ restKind: e.target.value as RestKind })}>
              {(Object.keys(REST_KIND_LABELS) as RestKind[]).map((k) => (
                <option key={k} value={k}>{REST_KIND_LABELS[k]}</option>
              ))}
            </select>
          </label>
        </>
      )}

      {draft.kind === 'superset' && (
        <>
          <div className="exercise-form__row">
            <label>
              Rounds
              <input type="number" min={1} value={draft.rounds} onChange={(e) => patch({ rounds: Number(e.target.value) || 1 })} />
            </label>
            <label>
              Switch time (sec)
              <input type="number" min={0} value={draft.switchSec} onChange={(e) => patch({ switchSec: Number(e.target.value) || 0 })} />
            </label>
            <label>
              Rest after pair (sec)
              <input type="number" min={0} value={draft.restSec} onChange={(e) => patch({ restSec: Number(e.target.value) || 0 })} />
            </label>
          </div>
          <label className="exercise-form__full">
            Rest type
            <select value={draft.restKind} onChange={(e) => patch({ restKind: e.target.value as RestKind })}>
              {(Object.keys(REST_KIND_LABELS) as RestKind[]).map((k) => (
                <option key={k} value={k}>{REST_KIND_LABELS[k]}</option>
              ))}
            </select>
          </label>

          {(['exerciseA', 'exerciseB'] as const).map((which, i) => (
            <fieldset className="exercise-form__fieldset" key={which}>
              <legend>Exercise {i === 0 ? 'A' : 'B'}</legend>
              <label className="exercise-form__full">
                Name
                <input type="text" value={draft[which].name} onChange={(e) => patchExercise(which, { name: e.target.value })} required />
              </label>
              <FigurePicker
                name={draft[which].name}
                figure={draft[which].figure}
                onChange={(figure) => patchExercise(which, { figure })}
              />
              <InfoFieldset
                videoUrl={draft[which].videoUrl}
                tags={draft[which].tags}
                focus={draft[which].focus}
                onChange={(p) => patchExercise(which, p)}
              />
              <div className="exercise-form__row">
                <label>
                  Kind
                  <select value={draft[which].kind} onChange={(e) => patchExercise(which, { kind: e.target.value as 'reps' | 'hold' })}>
                    <option value="reps">Reps (manual tap)</option>
                    <option value="hold">Timed hold</option>
                  </select>
                </label>
                <label>
                  Prescription
                  <input type="text" value={draft[which].prescription} onChange={(e) => patchExercise(which, { prescription: e.target.value })} placeholder="15-20" />
                </label>
              </div>
              {draft[which].kind === 'reps' ? (
                <label>
                  Est. seconds
                  <input type="number" min={1} value={draft[which].estWorkSec} onChange={(e) => patchExercise(which, { estWorkSec: Number(e.target.value) || 0 })} />
                </label>
              ) : (
                <label>
                  Hold (sec)
                  <input type="number" min={1} value={draft[which].holdSec} onChange={(e) => patchExercise(which, { holdSec: Number(e.target.value) || 0 })} />
                </label>
              )}
              {draft[which].kind === 'reps' && (
                <label className="exercise-form__checkbox">
                  <input type="checkbox" checked={draft[which].amrap} onChange={(e) => patchExercise(which, { amrap: e.target.checked })} />
                  AMRAP (as many reps as possible) on the final round
                </label>
              )}
            </fieldset>
          ))}
        </>
      )}

      <label className="exercise-form__full">
        Notes (shown during the set)
        <textarea value={draft.notes} onChange={(e) => patch({ notes: e.target.value })} rows={2} />
      </label>

      <div className="exercise-form__preview">Adds about {Math.round(previewSec / 6) / 10} min to this day</div>

      <div className="exercise-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn--primary">Save exercise</button>
      </div>
    </form>
  );
}
