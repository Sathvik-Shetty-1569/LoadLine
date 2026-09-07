import { useState } from 'react';
import type { Step } from '../data/types';
import { ExerciseImage } from './ExerciseImage';
import { exerciseVideoUrl, hasOwnVideo } from '../lib/exerciseVideo';

interface AutoProps {
  step: Step;
  remainingSec: number;
  onAdvance: () => void;
  onSkip: () => void;
}

export interface SetLog {
  reps?: number;
  weightKg?: number;
}

interface WorkProps {
  step: Step;
  lastValues: SetLog | null;
  onAdvance: (log?: SetLog) => void;
  onSkip: () => void;
}

interface MaxTimeProps {
  step: Step;
  elapsedSec: number;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onSkip: () => void;
}

/** "What it targets" line, purpose chips, and a form-video link. An explicit `step.videoUrl` opens
 * that; otherwise the link is a YouTube search for the movement so there's always something to
 * check when you don't know how to perform it. */
export function ExerciseInfo({ step }: { step: Step }) {
  const hasTags = !!step.tags && step.tags.length > 0;

  return (
    <div className="step__info">
      {step.focus && <div className="step__focus">Targets: {step.focus}</div>}
      {hasTags && (
        <div className="step__tags">
          {step.tags!.map((t) => (
            <span className="step__tag" key={t}>{t}</span>
          ))}
        </div>
      )}
      <a
        className="step__video"
        href={exerciseVideoUrl(step.label, step.videoUrl)}
        target="_blank"
        rel="noreferrer"
      >
        {hasOwnVideo(step.videoUrl) ? 'Watch demo video ▸' : 'How to perform ▸'}
      </a>
    </div>
  );
}

/** Purely presentational - all timer state (and pause control) lives in Session, so a global
 * Pause genuinely freezes the countdown instead of just hiding it. The countdown is a guide only:
 * reaching zero chimes but does NOT advance - the user taps Next. */
export function AutoTimedStepView({ step, remainingSec, onAdvance, onSkip }: AutoProps) {
  return (
    <div className={`step step--${step.kind}`}>
      <div className="step__label">{step.detail}</div>
      <h2 className="step__title">{step.label}</h2>
      {step.prescription && <div className="step__prescription">{step.prescription}</div>}
      <ExerciseInfo step={step} />
      <ExerciseImage src={step.image} figure={step.figure} name={step.label} className="step__figure" />
      <div className="step__timer">{remainingSec}</div>
      {remainingSec === 0 && <div className="step__timeup">Time's up - tap Next when you're done</div>}
      {step.notes && <p className="step__notes">{step.notes}</p>}
      <div className="step__actions">
        <button type="button" className="btn btn--primary" onClick={onAdvance}>
          Next
        </button>
        <button type="button" className="btn btn--ghost btn--small" onClick={onSkip}>
          Skip - not done
        </button>
      </div>
    </div>
  );
}

/** Mounted fresh per step (Session keys it by step.id), so this local input state can never leak
 * from one set into the next. Logging is entirely optional - "Set done" always works, filled in
 * or not, per the program's rule that a set's real length/output is never enforced by the app. */
export function ManualWorkStepView({ step, lastValues, onAdvance, onSkip }: WorkProps) {
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
      <ExerciseInfo step={step} />
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

      <div className="step__actions">
        <button type="button" className="btn btn--primary" onClick={handleDone}>
          Set done
        </button>
        <button type="button" className="btn btn--ghost btn--small" onClick={onSkip}>
          Skip - not done
        </button>
      </div>
    </div>
  );
}

export function MaxTimeStepView({ step, elapsedSec, isRunning, onStart, onStop, onSkip }: MaxTimeProps) {
  return (
    <div className="step step--maxtime">
      <div className="step__label">{step.detail}</div>
      <h2 className="step__title">{step.label}</h2>
      {step.prescription && <div className="step__prescription">{step.prescription}</div>}
      <ExerciseInfo step={step} />
      <ExerciseImage src={step.image} figure={step.figure} name={step.label} className="step__figure" />
      <div className="step__timer">{elapsedSec}</div>
      {step.notes && <p className="step__notes">{step.notes}</p>}
      {!isRunning ? (
        <div className="step__actions">
          <button type="button" className="btn btn--primary" onClick={onStart}>
            Start
          </button>
          <button type="button" className="btn btn--ghost btn--small" onClick={onSkip}>
            Skip - not done
          </button>
        </div>
      ) : (
        <button type="button" className="btn btn--primary" onClick={onStop}>
          Stop
        </button>
      )}
    </div>
  );
}
