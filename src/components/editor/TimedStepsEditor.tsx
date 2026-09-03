import type { TimedSubStep } from '../../data/types';

interface Props {
  steps: TimedSubStep[];
  onChange: (steps: TimedSubStep[]) => void;
}

/** Raw editor for a timed block's sub-steps (warm-ups/stretches) - e.g. "Left side" / 30, "Right
 * side" / 30. Deliberately literal rather than offering a magic "split by side" button: the
 * underlying data is just a list of {label, durationSec}, so editing it directly is both simpler
 * to build and easier to reason about than a conversion layer on top of it. */
export function TimedStepsEditor({ steps, onChange }: Props) {
  function update(i: number, patch: Partial<TimedSubStep>) {
    onChange(steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function remove(i: number) {
    onChange(steps.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...steps, { label: `Step ${steps.length + 1}`, durationSec: 30 }]);
  }

  return (
    <div className="timed-steps">
      {steps.map((s, i) => (
        <div className="timed-steps__row" key={i}>
          <input
            type="text"
            value={s.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="Label, e.g. Left side"
          />
          <input
            type="number"
            min={1}
            value={s.durationSec}
            onChange={(e) => update(i, { durationSec: Number(e.target.value) || 0 })}
          />
          <span className="timed-steps__unit">sec</span>
          <button type="button" className="btn btn--ghost btn--small" onClick={() => remove(i)} disabled={steps.length <= 1}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn btn--ghost btn--small" onClick={add}>
        + Add step
      </button>
    </div>
  );
}
