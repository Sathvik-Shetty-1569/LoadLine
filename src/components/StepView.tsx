import { useState } from 'react';
import type { Step } from '../data/types';
import { ExerciseImage } from './ExerciseImage';

interface AutoProps {
  step: Step;
  remainingSec: number;
  onAdvance: () => void;
}

export interface SetLog {
  reps?: number;
  weightKg?: number;
}

interface WorkProps {
  step: Step;
  lastValues: SetLog | null;
  onAdvance: (log?: SetLog) => void;
}

interface MaxTimeProps {
  step: Step;
  elapsedSec: number;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
}

/** Purely presentational - all timer state (and pause control) lives in Session, so a global
 * Pause genuinely freezes the countdown instead of just hiding it. */
export function AutoTimedStepView({ step, remainingSec, onAdvance }: AutoProps) {
  return (
    <div className={`step step--${step.kind}`}>
      <div className="step__label">{step.detail}</div>
      <h2 className="step__title">{step.label}</h2>
      {step.prescription && <div className="step__prescription">{step.prescription}</div>}
      <ExerciseImage src={step.image} figure={step.figure} name={step.label} className="step__figure" />
      <div className="step__timer">{remainingSec}</div>
      {step.notes && <p className="step__notes">{step.notes}</p>}
      <button type="button" className="btn btn--ghost" onClick={onAdvance}>
        Skip
      </button>
    </div>
  );
}

/** Mounted fresh per step (Session keys it by step.id), so this local input state can never leak
 * from one set into the next. Logging is entirely optional - "Set done" always works, filled in
 * or not, per the program's rule that a set's real length/output is never enforced by the app. */
export function ManualWorkStepView({ step, lastValues, onAdvance }: WorkProps) {
  const [showInputs, setShowInputs] = useState(true);
  const [reps, setReps] = useState(lastValues?.reps !== undefined ? String(lastValues.reps) : '');
  const [weightKg, setWeightKg] = useState(lastValues?.weightKg !== undefined ? String(lastValues.weightKg) : '');

  function handleDone() {
    const repsNum = reps.trim() === '' ? undefined : Number(reps);
    const weightNum = weightKg.trim() === '' ? undefined : Number(weightKg);
    onAdvance(repsNum !== undefined || weightNum !== undefined ? { reps: repsNum, weightKg: weightNum } : undefined);
  }

  return (
    <div className={`step step--work${step.toFailure ? ' step--failure' : ''}`}>
      <div className="step__label">{step.detail}</div>
      {step.toFailure && <div className="step__failure-badge">To failure</div>}
      <h2 className="step__title">{step.label}</h2>
      {step.prescription && <div className="step__prescription">{step.prescription}</div>}
      <ExerciseImage src={step.image} figure={step.figure} name={step.label} className="step__figure" />
      {step.notes && <p className="step__notes">{step.notes}</p>}

      {showInputs ? (
        <div className="step__log">
          <label>
            Reps
            <input type="number" inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value)} />
          </label>
          <label>
            Weight (kg)
            <input type="number" inputMode="decimal" step="0.5" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
          </label>
          <button
            type="button"
            className="step__log-hide"
            aria-label="Hide logging"
            onClick={() => {
              // Discard the values, don't just hide the fields - otherwise a dismissed,
              // still-prefilled set would get silently logged as if it were re-entered.
              setReps('');
              setWeightKg('');
              setShowInputs(false);
            }}
          >
            ×
          </button>
        </div>
      ) : (
        <button type="button" className="btn btn--ghost btn--small" onClick={() => setShowInputs(true)}>
          Log reps / weight
        </button>
      )}

      <button type="button" className="btn btn--primary" onClick={handleDone}>
        Set done
      </button>
    </div>
  );
}

export function MaxTimeStepView({ step, elapsedSec, isRunning, onStart, onStop }: MaxTimeProps) {
  return (
    <div className="step step--maxtime">
      <div className="step__label">{step.detail}</div>
      <h2 className="step__title">{step.label}</h2>
      {step.prescription && <div className="step__prescription">{step.prescription}</div>}
      <ExerciseImage src={step.image} figure={step.figure} name={step.label} className="step__figure" />
      <div className="step__timer">{elapsedSec}</div>
      {step.notes && <p className="step__notes">{step.notes}</p>}
      {!isRunning ? (
        <button type="button" className="btn btn--primary" onClick={onStart}>
          Start
        </button>
      ) : (
        <button type="button" className="btn btn--primary" onClick={onStop}>
          Stop
        </button>
      )}
    </div>
  );
}
