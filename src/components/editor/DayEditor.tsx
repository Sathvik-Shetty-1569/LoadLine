import { useState } from 'react';
import type { Block, DayProgram, PullupTier } from '../../data/types';
import { blockDurationSec, dayScheduleSec } from '../../lib/schedule';
import { newBlockId } from '../../lib/programStore';
import { ExerciseForm } from './ExerciseForm';
import { ExerciseImage } from '../ExerciseImage';

interface Props {
  day: DayProgram;
  tier: PullupTier;
  onChange: (day: DayProgram) => void;
}

const MODE_LABELS: Record<Block['mode'], string> = {
  timed: 'Warm-up / stretch', reps: 'Sets & reps', unilateral: 'Sets & reps, each side',
  hold: 'Timed hold', maxtime: 'Max-effort hold', superset: 'Superset pair', tiered: 'Tiered (built-in)',
};

/** image/figure live on different fields depending on block mode - superset blocks carry them on
 * their first sub-exercise, tiered blocks have neither (they resolve by name at render time). */
function blockVisual(block: Block): { image?: string | null; figure?: string | null } {
  switch (block.mode) {
    case 'timed':
      return { figure: block.figure };
    case 'superset':
      return { image: block.exerciseA.image, figure: block.exerciseA.figure };
    case 'tiered':
      return {};
    default:
      return { image: block.image, figure: block.figure };
  }
}

export function DayEditor({ day, tier, onChange }: Props) {
  const [editing, setEditing] = useState<'new' | number | null>(null);

  function setBlocks(blocks: Block[]) {
    onChange({ ...day, blocks });
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= day.blocks.length) return;
    const blocks = [...day.blocks];
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    setBlocks(blocks);
  }

  function duplicate(i: number) {
    const copy: Block = { ...day.blocks[i], id: newBlockId() };
    const blocks = [...day.blocks];
    blocks.splice(i + 1, 0, copy);
    setBlocks(blocks);
  }

  function remove(i: number) {
    setBlocks(day.blocks.filter((_, idx) => idx !== i));
  }

  function saveExercise(block: Block) {
    if (editing === 'new') {
      setBlocks([...day.blocks, block]);
    } else if (typeof editing === 'number') {
      setBlocks(day.blocks.map((b, idx) => (idx === editing ? block : b)));
    }
    setEditing(null);
  }

  const totalMin = Math.round(dayScheduleSec(day, tier) / 6) / 10;

  if (editing !== null) {
    const editingBlock = typeof editing === 'number' ? day.blocks[editing] : null;
    if (editingBlock?.mode === 'tiered') {
      return (
        <div className="day-editor">
          <p className="day-editor__note">
            "{editingBlock.name}" follows the built-in pull-up/chin-up tier table and isn't editable here.
            Change your tier in Settings instead.
          </p>
          <button type="button" className="btn btn--ghost" onClick={() => setEditing(null)}>Back</button>
        </div>
      );
    }
    return (
      <ExerciseForm
        block={editingBlock}
        onSave={saveExercise}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="day-editor">
      <div className="day-editor__header">
        <label className="day-editor__session-name">
          Session name
          <input
            type="text"
            value={day.sessionName}
            onChange={(e) => onChange({ ...day, sessionName: e.target.value })}
          />
        </label>
        <div className="day-editor__total">~{totalMin} min total</div>
      </div>

      {day.blocks.length === 0 && <p className="day-editor__empty">No exercises yet.</p>}

      <ol className="day-editor__list">
        {day.blocks.map((block, i) => {
          const visual = blockVisual(block);
          return (
            <li className="day-editor__item" key={block.id}>
              <ExerciseImage src={visual.image} figure={visual.figure} name={block.name} compact className="day-editor__thumb" />
              <div className="day-editor__item-main">
                <span className="day-editor__item-name">{block.name}</span>
                <span className="day-editor__item-meta">
                  <span>{MODE_LABELS[block.mode]}</span>
                  <span>~{Math.round(blockDurationSec(block, tier) / 6) / 10} min</span>
                </span>
              </div>
              <div className="day-editor__item-actions">
                <button type="button" className="btn btn--ghost btn--small" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                <button type="button" className="btn btn--ghost btn--small" onClick={() => move(i, 1)} disabled={i === day.blocks.length - 1}>↓</button>
                <button type="button" className="btn btn--ghost btn--small" onClick={() => setEditing(i)}>Edit</button>
                <button type="button" className="btn btn--ghost btn--small" onClick={() => duplicate(i)}>Duplicate</button>
                <button type="button" className="btn btn--ghost btn--small" onClick={() => remove(i)}>Remove</button>
              </div>
            </li>
          );
        })}
      </ol>

      <button type="button" className="btn btn--primary" onClick={() => setEditing('new')}>
        + Add exercise
      </button>
    </div>
  );
}
